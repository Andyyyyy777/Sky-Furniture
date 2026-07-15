/**
 * Admin local unlock (optional).
 * Default: empty — no shared password on the public site.
 *
 * For local development only, create admin-access.local.js (gitignored)
 * from admin-access.example.js and set localPassword.
 *
 * Production: sign in with an ADMIN_EMAILS account, then open /admin/.
 */
window.SKY_ADMIN_ACCESS = window.SKY_ADMIN_ACCESS || {
  localPassword: ""
};
