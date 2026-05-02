import AsyncStorage from '@react-native-async-storage/async-storage';
import * as LocalAuthentication from 'expo-local-authentication';

const USERS_KEY = 'freshloop_users';
const SESSION_KEY = 'freshloop_session';

export type UserRole = 'home' | 'business' | 'npo' | 'admin';
export type AccountStatus = 'active' | 'pending';

export interface StoredUser {
  id: string;
  email: string;
  password: string;
  role: UserRole;
  name: string;
  status: AccountStatus;
  biometricEnabled: boolean;
  createdAt: string;
  bizName?: string;
  bizType?: string;
  vatNumber?: string;
  phone?: string;
  orgName?: string;
  regNumber?: string;
}

export interface AuthSession {
  userId: string;
  email: string;
  role: UserRole;
  name: string;
  status: AccountStatus;
  biometricEnabled: boolean;
}

export interface AuthResult {
  success: boolean;
  error?: string;
  session?: AuthSession;
}

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

async function getUsers(): Promise<StoredUser[]> {
  const raw = await AsyncStorage.getItem(USERS_KEY);
  return raw ? JSON.parse(raw) : [];
}

async function saveUsers(users: StoredUser[]): Promise<void> {
  await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export async function getSession(): Promise<AuthSession | null> {
  const raw = await AsyncStorage.getItem(SESSION_KEY);
  return raw ? JSON.parse(raw) : null;
}

async function persistSession(session: AuthSession): Promise<void> {
  await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export async function clearSession(): Promise<void> {
  await AsyncStorage.removeItem(SESSION_KEY);
}

function sessionFromUser(user: StoredUser): AuthSession {
  return {
    userId: user.id,
    email: user.email,
    role: user.role,
    name: user.name,
    status: user.status,
    biometricEnabled: user.biometricEnabled,
  };
}

export async function registerHomeUser(data: {
  fullName: string;
  email: string;
  password: string;
  confirmPass: string;
}): Promise<AuthResult> {
  const { fullName, email, password, confirmPass } = data;

  if (!fullName.trim()) return { success: false, error: 'Please enter your full name.' };
  if (!isValidEmail(email)) return { success: false, error: 'Please enter a valid email address.' };
  if (password.length < 8) return { success: false, error: 'Password must be at least 8 characters.' };
  if (password !== confirmPass) return { success: false, error: 'Passwords do not match.' };

  const users = await getUsers();
  if (users.some(u => u.email === email.trim().toLowerCase())) {
    return { success: false, error: 'An account with this email already exists.' };
  }

  const user: StoredUser = {
    id: generateId(),
    email: email.trim().toLowerCase(),
    password,
    role: 'home',
    name: fullName.trim(),
    status: 'active',
    biometricEnabled: false,
    createdAt: new Date().toISOString(),
  };
  await saveUsers([...users, user]);

  const session = sessionFromUser(user);
  await persistSession(session);
  return { success: true, session };
}

const ADMIN_EMAIL    = 'admin@freshloop.co.za';
const ADMIN_PASSWORD = 'Admin@123';

export async function signInUser(
  email: string,
  password: string,
  role: UserRole,
): Promise<AuthResult> {
  if (!email.trim()) return { success: false, error: 'Please enter your email address.' };
  if (!password) return { success: false, error: 'Please enter your password.' };

  if (role === 'admin') {
    if (email.trim().toLowerCase() !== ADMIN_EMAIL) {
      return { success: false, error: 'No admin account found with this email.' };
    }
    if (password !== ADMIN_PASSWORD) {
      return { success: false, error: 'Incorrect password. Please try again.' };
    }
    const session: AuthSession = {
      userId: 'admin-001',
      email: ADMIN_EMAIL,
      role: 'admin',
      name: 'Platform Admin',
      status: 'active',
      biometricEnabled: false,
    };
    await persistSession(session);
    return { success: true, session };
  }

  const users = await getUsers();
  const user = users.find(
    u => u.email === email.trim().toLowerCase() && u.role === role,
  );

  if (!user) return { success: false, error: 'No account found with this email.' };
  if (user.password !== password) return { success: false, error: 'Incorrect password. Please try again.' };

  const session = sessionFromUser(user);
  await persistSession(session);
  return { success: true, session };
}

export async function registerBusiness(data: {
  bizName: string;
  bizType: string;
  email: string;
  phone: string;
  vatNumber: string;
  password: string;
  confirmPass: string;
}): Promise<AuthResult> {
  if (!data.bizName.trim()) return { success: false, error: 'Please enter your business name.' };
  if (!data.bizType) return { success: false, error: 'Please select a business type.' };
  if (!isValidEmail(data.email)) return { success: false, error: 'Please enter a valid email address.' };
  if (!data.phone.trim()) return { success: false, error: 'Please enter a contact number.' };
  if (data.password.length < 8) return { success: false, error: 'Password must be at least 8 characters.' };
  if (data.password !== data.confirmPass) return { success: false, error: 'Passwords do not match.' };

  const users = await getUsers();
  if (users.some(u => u.email === data.email.trim().toLowerCase())) {
    return { success: false, error: 'An account with this email already exists.' };
  }

  const user: StoredUser = {
    id: generateId(),
    email: data.email.trim().toLowerCase(),
    password: data.password,
    role: 'business',
    name: data.bizName.trim(),
    bizName: data.bizName.trim(),
    bizType: data.bizType,
    phone: data.phone.trim(),
    vatNumber: data.vatNumber.trim(),
    status: 'pending',
    biometricEnabled: false,
    createdAt: new Date().toISOString(),
  };
  await saveUsers([...users, user]);

  const session = sessionFromUser(user);
  await persistSession(session);
  return { success: true, session };
}

export async function registerNPO(data: {
  orgName: string;
  regNumber: string;
  email: string;
  phone: string;
  password: string;
  confirmPass: string;
}): Promise<AuthResult> {
  if (!data.orgName.trim()) return { success: false, error: 'Please enter your organisation name.' };
  if (!data.regNumber.trim()) return { success: false, error: 'Please enter the NPO registration number.' };
  if (!isValidEmail(data.email)) return { success: false, error: 'Please enter a valid email address.' };
  if (!data.phone.trim()) return { success: false, error: 'Please enter a contact number.' };
  if (data.password.length < 8) return { success: false, error: 'Password must be at least 8 characters.' };
  if (data.password !== data.confirmPass) return { success: false, error: 'Passwords do not match.' };

  const users = await getUsers();
  if (users.some(u => u.email === data.email.trim().toLowerCase())) {
    return { success: false, error: 'An account with this email already exists.' };
  }

  const user: StoredUser = {
    id: generateId(),
    email: data.email.trim().toLowerCase(),
    password: data.password,
    role: 'npo',
    name: data.orgName.trim(),
    orgName: data.orgName.trim(),
    regNumber: data.regNumber.trim(),
    phone: data.phone.trim(),
    status: 'pending',
    biometricEnabled: false,
    createdAt: new Date().toISOString(),
  };
  await saveUsers([...users, user]);

  const session = sessionFromUser(user);
  await persistSession(session);
  return { success: true, session };
}

export async function enableBiometric(
  userId: string,
  promptMessage = 'Confirm your identity to enable biometrics',
): Promise<AuthResult> {
  const hasHardware = await LocalAuthentication.hasHardwareAsync();
  if (!hasHardware) {
    return { success: false, error: 'This device does not support biometric authentication.' };
  }

  const isEnrolled = await LocalAuthentication.isEnrolledAsync();
  if (!isEnrolled) {
    return {
      success: false,
      error: 'No biometrics enrolled. Please set up fingerprint or Face ID in your device settings.',
    };
  }

  const result = await LocalAuthentication.authenticateAsync({
    promptMessage,
    cancelLabel: 'Cancel',
    disableDeviceFallback: false,
  });

  if (!result.success) {
    return { success: false, error: 'Biometric verification cancelled or failed.' };
  }

  const users = await getUsers();
  const idx = users.findIndex(u => u.id === userId);
  if (idx !== -1) {
    users[idx].biometricEnabled = true;
    await saveUsers(users);
  }

  const session = await getSession();
  if (session && session.userId === userId) {
    session.biometricEnabled = true;
    await persistSession(session);
  }

  return { success: true };
}

export async function biometricSignIn(role: UserRole): Promise<AuthResult> {
  const hasHardware = await LocalAuthentication.hasHardwareAsync();
  const isEnrolled = await LocalAuthentication.isEnrolledAsync();

  if (!hasHardware || !isEnrolled) {
    return { success: false, error: 'Biometrics not available on this device.' };
  }

  const result = await LocalAuthentication.authenticateAsync({
    promptMessage: 'Sign in to FreshLoop',
    cancelLabel: 'Cancel',
  });

  if (!result.success) {
    return { success: false, error: 'Biometric authentication failed or was cancelled.' };
  }

  const users = await getUsers();
  const user = users.find(u => u.role === role && u.biometricEnabled);
  if (!user) {
    return {
      success: false,
      error: 'No account with biometrics set up. Please sign in with email and password first.',
    };
  }

  const session = sessionFromUser(user);
  await persistSession(session);
  return { success: true, session };
}
