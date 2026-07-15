# assets/js

| File | Purpose |
|------|---------|
| **`firebase.js`** | Central Firebase Auth + Firestore helpers |

## Keys

Paste Firebase web config in:

```
config/firebase-keys.js
```

Then import:

```html
<script type="module">
  import { firebaseReady, signUp, signIn } from "./assets/js/firebase.js";
  console.log("Firebase ready?", firebaseReady);
</script>
```

## Note

Signup/login pages currently use **local accounts** (`js/local-auth.js`) until you finish Firebase setup and we reconnect them. This file is ready for when keys are real.
