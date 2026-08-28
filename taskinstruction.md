# Mathreya Authentication Integration — Firebase + WebAuthn + Appwrite

## Scope

Implement and verify the complete authentication flow for Mathreya.

Do not start database Phase 9.

Do not modify unrelated application features.

Do not work on `/api/v1/health` during this task.

Preserve the existing:

* Appwrite backend integration
* WebAuthn/passkey implementation
* Existing Mathreya UI design
* Existing React application architecture

---

# Authentication Architecture

Use:

* **Firebase Authentication** as the primary identity provider
* **WebAuthn / Passkeys** as the required second-stage device authentication
* **Appwrite** as the application backend and future database/storage provider

Do not use Firebase Firestore or Firebase Storage for Mathreya application data.

Do not create a custom biometric system.

Do not upload:

* Fingerprints
* Facial images
* Biometric templates

The operating system or device must perform biometric authentication locally through WebAuthn.

---

# Firebase Environment Variables

Use these environment variables:

```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_FIREBASE_MEASUREMENT_ID=
```

Requirements:

* Read them using `import.meta.env`.
* Do not hardcode Firebase configuration.
* Do not expose Firebase Admin credentials.
* Do not commit real `.env` secrets.
* Update `.env.example` with empty placeholders only.
* Preserve existing Appwrite environment variables.

Create one canonical Firebase client module inside the existing `src/lib` architecture.

Do not initialize Firebase more than once.

---

# Registration Flow

The registration page must collect:

1. Full Name
2. Date of Birth
3. Email OR Mobile Number
4. Password for Email registration

The registration UI must clearly provide:

* Register with Email
* Register with Mobile

---

## Email Registration

Flow:

```text
Full Name
+ Date of Birth
+ Email
+ Password
        ↓
Firebase create email/password account
        ↓
Primary identity created
        ↓
Mandatory WebAuthn/passkey enrollment
        ↓
Account ready
```

Use Firebase Authentication's official email/password authentication.

Preserve the Firebase UID.

---

## Mobile Registration

Flow:

```text
Full Name
+ Date of Birth
+ Mobile Number
        ↓
Firebase phone authentication
        ↓
Firebase reCAPTCHA verification
        ↓
SMS OTP sent
        ↓
User enters OTP
        ↓
Firebase verifies OTP
        ↓
Mandatory WebAuthn/passkey enrollment
        ↓
Account ready
```

Use Firebase's official:

* `RecaptchaVerifier`
* Phone authentication
* OTP confirmation flow

Do not:

* Implement custom OTP logic
* Hardcode OTP values
* Store OTP values manually
* Bypass Firebase app verification

Ensure React does not create duplicate reCAPTCHA verifier instances.

---

# Mandatory Device Security Enrollment

After successful primary registration:

Show a security screen or modal:

```text
Secure your Mathreya account
```

Then invoke the existing WebAuthn registration flow.

The device/browser determines the available authentication method.

Examples:

### PC / Laptop

* Windows Hello
* Windows fingerprint
* Windows face recognition
* Touch ID
* Device PIN
* Other supported passkey authenticators

### Mobile

* Fingerprint
* Face ID
* Face Unlock
* Device authentication
* Device PIN/passcode
* Other supported passkey authenticators

Do not ask the user to upload a fingerprint or face.

Do not implement custom face recognition.

The UI should explain:

```text
Your device securely handles fingerprint or face verification.
Mathreya never receives your fingerprint or facial data.
```

If the preferred platform biometric is unavailable, provide:

```text
Try other options
```

This must use browser/device-supported passkey alternatives.

---

# Login Flow

A successful Firebase authentication must NOT immediately redirect the user to Home.

The required sequence is:

```text
Primary Authentication
        ↓
WebAuthn / Passkey Verification
        ↓
Final Mathreya Authentication
        ↓
Home
```

---

## Email Login

```text
Email
+ Password
        ↓
Firebase Authentication succeeds
        ↓
DO NOT redirect to Home
        ↓
WebAuthn authentication challenge
        ↓
Fingerprint / Face / Windows Hello / Passkey
        ↓
WebAuthn verification succeeds
        ↓
Home
```

If WebAuthn fails or is cancelled:

* Do not redirect to Home.
* Keep the user out of protected application areas.
* Show a clear error.
* Allow retry.

---

## Mobile Login

```text
Mobile Number
        ↓
Firebase Phone Authentication
        ↓
Firebase SMS OTP
        ↓
Firebase verifies OTP
        ↓
DO NOT redirect to Home
        ↓
WebAuthn authentication challenge
        ↓
Fingerprint / Face / Device Authentication / Passkey
        ↓
WebAuthn verification succeeds
        ↓
Home
```

---

# Important Device Behavior

Do not create separate fake buttons for:

* Face ID
* Fingerprint
* Windows Hello

Use one WebAuthn/passkey request.

The operating system or browser decides which authentication method to present.

Expected examples:

* Windows laptop → Windows Hello fingerprint or face
* Windows desktop → Windows Hello or another supported authenticator
* Android → fingerprint/face/device authentication
* iPhone/iPad → Face ID or Touch ID
* Compatible device without biometrics → device passcode/PIN or another passkey option

Provide a visible:

```text
Try other options
```

fallback where appropriate.

---

# Authentication State

Update `AuthContext` so it represents these states:

```text
unauthenticated
primary_authenticated
awaiting_passkey
authenticated
recovering
```

The final Mathreya application session must only become:

```text
authenticated
```

after:

1. Firebase primary authentication succeeds.
2. WebAuthn authentication succeeds.

Firebase `onAuthStateChanged` alone must NOT grant access to protected Mathreya routes.

---

# Canonical Identity

Firebase UID must be the canonical user identity.

Identity relationship:

```text
Firebase User UID
        ↓
WebAuthn Credential(s)
        ↓
Future Appwrite User/Application Records
```

WebAuthn credentials must be associated with the Firebase UID.

Do not create duplicate Appwrite users for the same person.

Before database Phase 9, document the final identity mapping clearly.

If the current WebAuthn implementation uses another identifier, migrate carefully to Firebase UID mapping.

Do not destroy existing passkey data.

If there are no real production users yet, document that assumption and use Firebase UID as the clean canonical identity.

---

# Password Recovery

Implement or preserve Firebase email/password recovery.

Password recovery must not bypass required WebAuthn second-stage authentication when a passkey is enrolled and required.

---

# UI Requirements

Preserve the existing Mathreya design.

Do not redesign unrelated pages.

The flow should be understandable.

## Registration

```text
Create Account
        ↓
Verify Email or Mobile
        ↓
Secure your Mathreya account
        ↓
Fingerprint / Face / Device Passkey
        ↓
Account Ready
```

## Login

```text
Email + Password
        OR
Mobile + OTP
        ↓
Primary identity verified
        ↓
Confirm identity on this device
        ↓
Fingerprint / Face / Windows Hello / Passkey
        ↓
Home
```

---

# Technical Requirements

Use Firebase Authentication for:

* Email/password authentication
* Password recovery
* Phone number authentication
* Firebase SMS OTP

Use existing SimpleWebAuthn/WebAuthn implementation for:

* Passkey registration
* Passkey authentication
* Device biometric/passkey authentication

Keep Appwrite for:

* Backend application architecture
* Future database
* Future storage
* Future application records

Do not use Firebase Firestore for application healthcare data.

---

# Required Dependency

Install Firebase if it is not already installed:

```bash
npm install firebase
```

Do not add unnecessary authentication libraries.

---

# Testing Requirements

Before completion:

1. Run:

```bash
npm run lint
```

2. Run:

```bash
npm run build
```

3. Test email registration flow.

4. Test email login flow.

5. Test phone OTP UI and Firebase integration.

6. Verify successful primary authentication does not redirect directly to Home.

7. Verify WebAuthn is triggered after successful primary authentication.

8. Verify Home access occurs only after successful WebAuthn verification.

9. Verify cancelling WebAuthn prevents Home access.

---

# Completion Report

Report exactly:

1. Files created.
2. Files modified.
3. Files deleted.
4. Firebase flows implemented.
5. Final registration flow.
6. Final login flow.
7. Firebase UID → WebAuthn → Appwrite identity mapping.
8. `npm run lint` result.
9. `npm run build` result.
10. Any blockers.

Stop after authentication integration.

Do not start Phase 9 database work.
    