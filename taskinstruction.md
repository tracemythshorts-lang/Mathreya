# Authentication Stabilization and Facial Verification Requirements

## Current task scope

Do not begin database schema creation in this task.

Do not implement Firebase.

Do not implement WebAuthn.

Do not implement passkeys.

Do not implement Windows Hello.

Do not implement Touch ID.

Do not implement Android fingerprint authentication.

Do not implement device biometric authentication.

Use Appwrite as the authentication provider.

The current task is to stabilize Appwrite authentication and prepare the architecture for future actual facial verification.

## Appwrite authentication methods

Use:

* Email/Password
* Email OTP
* Phone OTP

The canonical authenticated identity is:

```text
appwriteUserId = account.$id
```

All future user records must reference this ID.

## Required UI text

Replace:

```text
Create Appwrite Account
```

with:

```text
Create Account
```

Replace:

```text
Sign In with Appwrite
```

with:

```text
Sign In
```

Replace:

```text
Send Appwrite SMS OTP
```

with:

```text
Send SMS OTP
```

Use clear labels:

```text
Create Account
Sign In
Send Email OTP
Send SMS OTP
Verify OTP
Resend OTP
```

Do not expose authentication-provider branding in normal user action buttons.

## Email/password flow

Implement and verify:

```text
Enter Email + Password
→ Sign In
→ Appwrite primary authentication
→ Create authenticated session
```

Use the official installed Appwrite SDK methods.

Do not invent API method names.

## Email OTP flow

Implement and verify:

```text
Enter Email
→ Send Email OTP
→ User receives email
→ Enter OTP
→ Verify with Appwrite
→ Create authenticated session
```

Requirements:

* Use Appwrite's official token/session flow.
* Do not generate custom email OTP values.
* Do not hard-code OTP values.
* Handle invalid OTP.
* Handle expired OTP.
* Handle resend requests safely.

## Phone OTP flow

Implement and verify:

```text
Enter Phone Number
→ Send SMS OTP
→ User receives SMS
→ Enter OTP
→ Verify with Appwrite
→ Create authenticated session
```

Requirements:

* Use official Appwrite phone authentication.
* Validate phone number format before requesting OTP.
* Handle invalid OTP.
* Handle expired OTP.
* Handle resend requests safely.
* Do not expose unnecessary internal provider error messages directly to users.

## Development mock phone testing

Real SMS is currently unavailable because the Appwrite phone authentication allowance or budget limit has been exceeded.

First inspect whether Appwrite Mock Phone Numbers are available in the current Appwrite project configuration.

If available:

1. Configure the approved development test phone number in Appwrite.
2. Configure the approved development OTP in Appwrite.
3. Keep application code identical to the production authentication flow.
4. The application must call Appwrite for OTP initiation and verification.

Do not create a frontend authentication bypass.

Do not permanently hard-code the development phone number or OTP into production application logic.

If Appwrite mock phone testing is unavailable, report the exact limitation before implementing any temporary development-only fallback.

## Environment variables

Frontend:

```env
VITE_APPWRITE_ENDPOINT=
VITE_APPWRITE_PROJECT_ID=
```

Server only:

```env
APPWRITE_ENDPOINT=
APPWRITE_PROJECT_ID=
APPWRITE_API_KEY=
```

Never expose:

```text
APPWRITE_API_KEY
```

to browser code.

Never create:

```text
VITE_APPWRITE_API_KEY
```

Do not add Firebase environment variables.

## Facial verification architecture requirement

Mathreya requires actual facial verification.

This is a dedicated face-verification system and is not:

* WebAuthn
* Passkeys
* Windows Hello
* Face ID
* Touch ID
* Android fingerprint
* Device PIN authentication

Do not implement facial verification as a simple browser image comparison.

Do not implement facial verification as a fake UI flow.

Do not begin provider integration until the provider/API architecture has been selected.

## Future facial enrollment requirements

After primary identity creation and required Appwrite authentication:

1. Request camera permission.
2. Capture a clear live face.
3. Validate image quality.
4. Detect a human face.
5. Perform liveness/anti-spoofing checks where supported.
6. Extract or securely obtain a protected facial reference.
7. Associate the facial reference with `appwriteUserId`.
8. Do not store the biometric reference in the normal user profile.
9. Do not store biometric data in localStorage.
10. Do not expose biometric templates to frontend code.

## Future facial login requirements

The intended final authentication flow is:

```text
Email/Phone + Password or OTP
        ↓
Primary Appwrite authentication
        ↓
No protected application access yet
        ↓
Live facial verification
        ↓
Face match against enrolled reference
        ↓
Successful match
        ↓
Grant protected application access
```

The face verification process must focus on facial identity characteristics rather than scene similarity.

Clothing and background changes must not be treated as identity changes.

The provider/system should use facial verification or facial embeddings/templates rather than arbitrary image similarity.

## Face mismatch behavior

If face verification fails:

1. Do not grant protected application access.
2. Show a clear verification failure message.
3. Allow retry.
4. Do not expose raw face-match scores.
5. Apply a configured retry limit.
6. After retry failure, offer:

   * Email OTP recovery, and/or
   * Phone SMS OTP recovery.
7. OTP recovery must use Appwrite.
8. Do not overwrite the enrolled face reference automatically after OTP recovery.
9. Record the event for future audit logging.

## Biometric security rules

Never:

* Store raw fingerprint data.
* Store biometric templates in localStorage.
* Put biometric data into a public Appwrite bucket.
* Store biometric templates in a normal user profile document.
* Expose biometric templates to browser code.
* Claim guaranteed fingerprint-only or face-only enforcement through device APIs.

Raw facial captures must have minimal retention and be deleted when no longer required by the verification architecture.

## User profile requirement

Do not display the raw biometric enrollment reference in the profile.

Instead display metadata such as:

```text
Facial verification: Enrolled
Enrollment date
Last successful verification
```

A normal profile image may exist independently and must not automatically be used as the biometric reference.

## Required verification

After Appwrite authentication changes:

```powershell
npm run lint
npm run build
```

Then manually test:

### Email/password

* Create account.
* Sign in.
* Sign out.
* Sign in again.

### Email OTP

* Request OTP.
* Enter invalid OTP.
* Verify error handling.
* Request another OTP.
* Verify valid OTP.
* Confirm session creation.

### Phone OTP

* Configure Appwrite mock phone testing if available.
* Request OTP.
* Enter invalid OTP.
* Verify error handling.
* Enter the configured valid mock OTP.
* Confirm Appwrite session creation.

## Completion report

Report:

1. Exact files changed.
2. Exact Appwrite SDK methods used.
3. Email/password test result.
4. Email OTP test result.
5. Mock phone OTP test result.
6. Any Appwrite configuration blocker.
7. Facial verification implementation status.
8. `npm run lint` result.
9. `npm run build` result.

Stop after authentication stabilization.

Do not start database creation.
Do not implement a facial recognition provider yet.
