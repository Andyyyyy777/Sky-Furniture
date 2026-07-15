/**
 * Sky Furniture Cloud Functions
 *
 * Environment config (Firebase CLI):
 *   firebase functions:config:set \
 *     paystack.secret="sk_test_xxx" \
 *     email.user="you@gmail.com" \
 *     email.pass="app-password" \
 *     email.from="Sky Furniture <orders@skyfurniture.ng>" \
 *     email.admin="admin@skyfurniture.ng"
 *
 * Or use .env / secrets (Firebase Functions v2):
 *   firebase functions:secrets:set PAYSTACK_SECRET_KEY
 */

const functions = require("firebase-functions");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");

admin.initializeApp();
const db = admin.firestore();

function getConfig() {
  const cfg = functions.config();
  return {
    paystackSecret: process.env.PAYSTACK_SECRET_KEY || cfg.paystack?.secret || "",
    emailUser: process.env.EMAIL_USER || cfg.email?.user || "",
    emailPass: process.env.EMAIL_PASS || cfg.email?.pass || "",
    emailFrom: process.env.EMAIL_FROM || cfg.email?.from || "Sky Furniture <noreply@skyfurniture.ng>",
    adminEmail: process.env.ADMIN_EMAIL || cfg.email?.admin || ""
  };
}

function createTransport() {
  const { emailUser, emailPass } = getConfig();
  if (!emailUser || !emailPass) return null;
  // Gmail example — use App Password. Or swap for SendGrid SMTP / Resend.
  return nodemailer.createTransport({
    service: "gmail",
    auth: { user: emailUser, pass: emailPass }
  });
}

function formatNgn(amount) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0
  }).format(amount || 0);
}

async function verifyPaystackReference(reference) {
  const { paystackSecret } = getConfig();
  if (!paystackSecret) {
    throw new functions.https.HttpsError("failed-precondition", "Paystack secret not configured");
  }
  const res = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, {
    headers: {
      Authorization: `Bearer ${paystackSecret}`,
      "Content-Type": "application/json"
    }
  });
  const body = await res.json();
  if (!res.ok || !body.status) {
    throw new Error(body.message || "Paystack verification failed");
  }
  return body.data;
}

async function sendOrderEmails(order, orderId) {
  const transport = createTransport();
  const { emailFrom, adminEmail } = getConfig();
  if (!transport) {
    console.warn("Email transport not configured — skipping notifications");
    return { skipped: true };
  }

  const customerEmail = order.customer?.email || order.userEmail;
  const total = formatNgn(order.totals?.total);
  const itemsList = (order.items || [])
    .map((i) => `• ${i.name} × ${i.quantity} — ${formatNgn(i.lineTotal)}`)
    .join("\n");

  const customerHtml = `
    <h2>Thank you for your order</h2>
    <p>Hi ${order.customer?.fullName || "there"},</p>
    <p>We've received your payment for order <strong>${orderId}</strong>.</p>
    <p><strong>Total:</strong> ${total}</p>
    <p><strong>Delivery:</strong> ${order.delivery === "pickup" ? "Store pickup (Ikeja)" : "Home delivery"}</p>
    <pre style="font-family:sans-serif;white-space:pre-wrap">${itemsList}</pre>
    <p>We'll update you when it ships.</p>
    <p>— Sky Furniture</p>
  `;

  const adminHtml = `
    <h2>New paid order</h2>
    <p><strong>ID:</strong> ${orderId}</p>
    <p><strong>Customer:</strong> ${order.customer?.fullName} (${customerEmail})</p>
    <p><strong>Phone:</strong> ${order.customer?.phone || "—"}</p>
    <p><strong>Total:</strong> ${total}</p>
    <p><strong>Paystack ref:</strong> ${order.paymentRef || "—"}</p>
    <pre style="font-family:sans-serif;white-space:pre-wrap">${itemsList}</pre>
  `;

  const jobs = [];
  if (customerEmail) {
    jobs.push(
      transport.sendMail({
        from: emailFrom,
        to: customerEmail,
        subject: `Order confirmed — ${orderId} | Sky Furniture`,
        html: customerHtml
      })
    );
  }
  if (adminEmail) {
    jobs.push(
      transport.sendMail({
        from: emailFrom,
        to: adminEmail,
        subject: `New order ${orderId} — ${total}`,
        html: adminHtml
      })
    );
  }
  await Promise.all(jobs);
  return { sent: jobs.length };
}

/**
 * HTTP endpoint: verify Paystack payment, mark order paid, send emails.
 * POST { reference, orderId }
 * CORS enabled for browser checkout.
 */
exports.verifyPaystackPayment = functions.https.onRequest(async (req, res) => {
  // CORS
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    res.status(204).send("");
    return;
  }
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  try {
    const { reference, orderId } = req.body || {};
    if (!reference || !orderId) {
      res.status(400).json({ error: "reference and orderId required" });
      return;
    }

    const orderRef = db.collection("orders").doc(orderId);
    const orderSnap = await orderRef.get();
    if (!orderSnap.exists) {
      res.status(404).json({ error: "Order not found" });
      return;
    }
    const order = orderSnap.data();

    // Idempotent: already paid
    if (order.status === "paid" && order.paymentRef === reference) {
      res.json({ ok: true, alreadyPaid: true, orderId, reference });
      return;
    }

    const data = await verifyPaystackReference(reference);
    if (data.status !== "success") {
      res.status(402).json({ error: "Payment not successful", status: data.status });
      return;
    }

    // Amount check (Paystack amount is in kobo)
    const expectedKobo = Math.round(Number(order.totals?.total || 0) * 100);
    if (expectedKobo > 0 && Number(data.amount) !== expectedKobo) {
      console.error("Amount mismatch", { expectedKobo, got: data.amount });
      res.status(400).json({ error: "Paid amount does not match order total" });
      return;
    }

    await orderRef.update({
      status: "paid",
      payment: "paystack",
      paymentRef: reference,
      paystack: {
        channel: data.channel,
        paidAt: data.paid_at,
        gatewayResponse: data.gateway_response,
        amount: data.amount
      },
      paidAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    const updated = { ...order, paymentRef: reference, status: "paid" };
    let emailResult = {};
    try {
      emailResult = await sendOrderEmails(updated, orderId);
    } catch (emailErr) {
      console.error("Email failed", emailErr);
      emailResult = { error: emailErr.message };
    }

    res.json({
      ok: true,
      orderId,
      reference,
      status: "paid",
      email: emailResult
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || "Server error" });
  }
});

/**
 * Callable (optional): set admin custom claim — run once as owner
 * In production, use Firebase Admin CLI or a secure one-off script.
 */
exports.setAdminClaim = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError("unauthenticated", "Sign in required");
  }
  // Only allow if caller already has admin claim OR is first bootstrap (disable after setup)
  const caller = await admin.auth().getUser(context.auth.uid);
  const isCallerAdmin = caller.customClaims?.admin === true;
  const bootstrapSecret = functions.config().admin?.bootstrap_secret;
  if (!isCallerAdmin && data.bootstrapSecret !== bootstrapSecret) {
    throw new functions.https.HttpsError("permission-denied", "Not allowed");
  }
  const email = data.email;
  if (!email) throw new functions.https.HttpsError("invalid-argument", "email required");
  const user = await admin.auth().getUserByEmail(email);
  await admin.auth().setCustomUserClaims(user.uid, { admin: true });
  return { ok: true, uid: user.uid, email };
});
