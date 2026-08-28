import React, { createContext, useContext, useState, useEffect } from 'react';
import { account, ID } from '../lib/appwrite/client';
import { UserProfile } from '../types';

export type AuthStatus = 'unauthenticated' | 'authenticated' | 'recovering' | 'loading';

interface TokenResult {
  userId: string;
}

interface AuthContextType {
  status: AuthStatus;
  user: UserProfile | null;
  appwriteUserId: string | null;
  error: string | null;

  // Actions
  signupWithEmail: (name: string, dob: string, email: string, pass: string, stage: string, phone?: string) => Promise<void>;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  sendEmailOTP: (email: string) => Promise<TokenResult>;
  verifyEmailOTPOnly: (userId: string, otpCode: string) => Promise<void>;
  logout: () => Promise<void>;
  sendPasswordRecovery: (email: string) => Promise<void>;
  setUserPhotoUrl: (photoUrl: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [status, setStatus] = useState<AuthStatus>('loading');
  const [user, setUser] = useState<UserProfile | null>(null);
  const [appwriteUserId, setAppwriteUserId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Check active Appwrite session on mount
  useEffect(() => {
    async function checkCurrentSession() {
      try {
        const appwriteUser = await account.get();
        if (appwriteUser) {
          setAppwriteUserId(appwriteUser.$id);
          const savedPhoto = localStorage.getItem('mathreya_user_face_photo') || undefined;
          const wasRegistered = localStorage.getItem(`mathreya_registered_${appwriteUser.$id}`);

          setUser({
            name: appwriteUser.name || 'Mathreya Sanctuary Member',
            email: appwriteUser.email || 'user@mathreya.care',
            phone: appwriteUser.phone || '+91 98765 43210',
            age: 26,
            stage: 'pregnancy_prenatal',
            avatarUrl: savedPhoto,
            faceAuthEnabled: false,
            isAuthenticated: true,
            isFirstLogin: !wasRegistered,
            pregnancyWeek: 24,
            emergencyContactName: 'Dr. Priya Sharma (Sister / OB-GYN)',
            emergencyContactPhone: '+91 98111 22233',
            location: 'Bengaluru, Karnataka',
          });
          setStatus('authenticated');
        } else {
          setStatus('unauthenticated');
        }
      } catch (err) {
        // No active session found
        setAppwriteUserId(null);
        setUser(null);
        setStatus('unauthenticated');
      }
    }
    checkCurrentSession();
  }, []);

  // 1. Appwrite Email Registration — creates account with name/email/password/phone
  const signupWithEmail = async (name: string, dob: string, email: string, pass: string, stage: string, phone?: string) => {
    try {
      setError(null);
      setStatus('loading');

      // If there's an active OTP session from email verification, log it out first
      // so account.create() can work cleanly
      try { await account.deleteSession('current'); } catch {}

      // Create Appwrite account with name, email, password
      const userId = ID.unique();
      await account.create(userId, email, pass, name);

      // Create session
      await account.createEmailPasswordSession(email, pass);

      // Get authenticated Appwrite user object
      const appwriteUser = await account.get();
      setAppwriteUserId(appwriteUser.$id);

      // Store phone and dob in Appwrite preferences
      try {
        await account.updatePrefs({
          phone: phone || '',
          dob: dob || '',
          stage: stage || 'pregnancy_prenatal',
        });
      } catch {}

      try {
        localStorage.setItem(`mathreya_registered_${appwriteUser.$id}`, 'true');
        localStorage.setItem(`mathreya_registered_${email}`, 'true');
      } catch {}

      const savedPhoto = localStorage.getItem('mathreya_user_face_photo') || undefined;
      const userProfile: UserProfile = {
        name: name || appwriteUser.name,
        email: email || appwriteUser.email,
        phone: phone || '',
        age: 26,
        stage: (stage as any) || 'pregnancy_prenatal',
        avatarUrl: savedPhoto,
        faceAuthEnabled: false,
        isAuthenticated: true,
        isFirstLogin: true,
        pregnancyWeek: 24,
        emergencyContactName: 'Dr. Priya Sharma (Sister / OB-GYN)',
        emergencyContactPhone: '+91 98111 22233',
        location: 'Bengaluru, Karnataka',
      };

      setUser(userProfile);
      setStatus('authenticated');
    } catch (err: any) {
      setError(err.message || 'Email registration failed on Appwrite.');
      setStatus('unauthenticated');
      throw err;
    }
  };

  // 2. Appwrite Email Password Login
  const loginWithEmail = async (email: string, pass: string) => {
    try {
      setError(null);
      setStatus('loading');

      // Create Appwrite Email Password Session
      await account.createEmailPasswordSession(email, pass);

      const appwriteUser = await account.get();
      setAppwriteUserId(appwriteUser.$id);

      const userKey = appwriteUser.$id || email;
      let wasRegistered = false;
      try {
        wasRegistered = !!localStorage.getItem(`mathreya_registered_${userKey}`);
        if (!wasRegistered) {
          localStorage.setItem(`mathreya_registered_${userKey}`, 'true');
        }
      } catch {}

      const savedPhoto = localStorage.getItem('mathreya_user_face_photo') || undefined;
      const userProfile: UserProfile = {
        name: appwriteUser.name || 'Mathreya Sanctuary Member',
        email: appwriteUser.email || email,
        phone: appwriteUser.phone || '+91 98765 43210',
        age: 26,
        stage: 'pregnancy_prenatal',
        avatarUrl: savedPhoto,
        faceAuthEnabled: false,
        isAuthenticated: true,
        isFirstLogin: !wasRegistered,
        pregnancyWeek: 24,
        emergencyContactName: 'Dr. Priya Sharma (Sister / OB-GYN)',
        emergencyContactPhone: '+91 98111 22233',
        location: 'Bengaluru, Karnataka',
      };

      setUser(userProfile);
      setStatus('authenticated');
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your Appwrite credentials.');
      setStatus('unauthenticated');
      throw err;
    }
  };

  // 3. Appwrite Email OTP Send
  const sendEmailOTP = async (email: string): Promise<TokenResult> => {
    try {
      setError(null);
      const token = await account.createEmailToken(ID.unique(), email);
      return { userId: token.userId };
    } catch (err: any) {
      setError(err.message || 'Failed to send Email OTP.');
      throw err;
    }
  };

  // 4. Verify Email OTP token only — confirms email ownership without creating the account
  // The OTP session created here is temporary; it gets deleted in signupWithEmail before account.create()
  const verifyEmailOTPOnly = async (userId: string, otpCode: string) => {
    try {
      setError(null);
      // Create a temporary session to verify the token
      await account.createSession(userId, otpCode);
      // Session will be cleared in signupWithEmail before account.create()
    } catch (err: any) {
      setError(err.message || 'Invalid or expired Email OTP code.');
      throw err;
    }
  };

  // 7. Appwrite Password Recovery
  const sendPasswordRecovery = async (email: string) => {
    try {
      setError(null);
      const redirectUrl = typeof window !== 'undefined' ? `${window.location.origin}/login` : 'http://localhost:3000/login';
      await account.createRecovery(email, redirectUrl);
    } catch (err: any) {
      setError(err.message || 'Failed to send password recovery email via Appwrite.');
      throw err;
    }
  };

  // 8. Sign Out
  const logout = async () => {
    try {
      await account.deleteSession('current');
    } catch {}
    setAppwriteUserId(null);
    setUser(null);
    setError(null);
    setStatus('unauthenticated');
  };

  const setUserPhotoUrl = (photoUrl: string) => {
    try { localStorage.setItem('mathreya_user_face_photo', photoUrl); } catch {}
    setUser((prev) => prev ? { ...prev, avatarUrl: photoUrl } : prev);
  };

  return (
    <AuthContext.Provider
      value={{
        status,
        user,
        appwriteUserId,
        error,

        signupWithEmail,
        loginWithEmail,
        sendEmailOTP,
        verifyEmailOTPOnly,
        logout,
        sendPasswordRecovery,
        setUserPhotoUrl,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
