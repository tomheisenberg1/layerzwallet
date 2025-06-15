# Unlock Screen Implementation

This implementation adds an unlock screen with the Z-spinner loading indicator as the first screen in the Expo app when the wallet is encrypted.

## Features

1. **Z-Spinner Loading Animation**: The custom Z-spinner with gradient paths rotates 3 times before settling
2. **Password Input**: After the spinner animation (4 seconds), a password input field appears
3. **Authentication Flow**: Validates the password against the encrypted mnemonic
4. **Session Management**: Once unlocked, the session is maintained until the app goes to background
5. **Auto-logout**: Session is cleared when the app goes to background or becomes inactive

## Files Created/Modified

### New Files:

- `components/ZSpinner.tsx` - The animated Z-spinner component
- `app/unlock.tsx` - The unlock screen with password input
- `src/hooks/AuthContext.tsx` - Authentication context (ready for future use)

### Modified Files:

- `app/_layout.tsx` - Added unlock route and background state handling
- `app/index.tsx` - Added session authentication check logic
- `src/modules/background-executor.ts` - Cleaned up (removed unused session methods)

## How to Test

1. **Start the app**: The app should work normally for unencrypted wallets
2. **Create encrypted wallet**: Go through onboarding and create a password
3. **Background the app**: Put the app in background or close it
4. **Reopen the app**: You should see the Z-spinner followed by the unlock screen
5. **Enter password**: Enter the correct password to unlock
6. **Access wallet**: You should be taken to the main wallet interface

## Flow Logic

1. `index.tsx` checks if mnemonic exists and is encrypted
2. If encrypted, checks if session is authenticated (`session_authenticated` storage key)
3. If not authenticated, redirects to `/unlock`
4. Unlock screen shows Z-spinner for 4 seconds, then password input
5. On successful unlock, sets `session_authenticated = 'true'` and navigates to main app
6. `_layout.tsx` clears session authentication when app goes to background

## Session Storage Key

- `session_authenticated`: Set to `'true'` when user successfully unlocks, cleared when app backgrounds

## Security Features

- Password is validated by attempting to decrypt the mnemonic
- Session is cleared when app goes to background for security
- No persistent session - user must re-authenticate each app launch after backgrounding

## Future Enhancements

- Biometric authentication option
- Configurable session timeout
- PIN code alternative
- Failed attempt limiting
