import { UserProfile } from '../types/auth';

const STORAGE_USERS_KEY = 'medicai_mobile_users';
const STORAGE_CURRENT_USER_KEY = 'medicai_mobile_current_user';

// In-memory fallback
let inMemoryCurrentUser: UserProfile | null = null;
let inMemoryUsers: Array<UserProfile & { password: string }> = [
  {
    id: 'demo-user-1',
    email: 'doctor@medicai.uz',
    fullName: 'Dr. Zohidjon Zaylobiddinov',
    role: 'resident',
    courseLevel: '2-kurs Rezident',
    createdAt: new Date().toISOString(),
    password: 'password123',
  },
];

export async function loginUser(email: string, password: string): Promise<UserProfile> {
  const normalizedEmail = email.trim().toLowerCase();
  const user = inMemoryUsers.find(
    (u) => u.email.toLowerCase() === normalizedEmail && u.password === password
  );

  if (!user) {
    // If not found in demo list, allow login for any email with min 4 char password or create dynamic
    if (password.length >= 4) {
      const newUser: UserProfile & { password: string } = {
        id: `user-${Date.now()}`,
        email: normalizedEmail,
        fullName: normalizedEmail.split('@')[0],
        role: 'student',
        courseLevel: '4-kurs Tibbiyot talabasi',
        createdAt: new Date().toISOString(),
        password,
      };
      inMemoryUsers.push(newUser);
      inMemoryCurrentUser = newUser;
      return newUser;
    }
    throw new Error('Noto\'g\'ri email yoki parol kiritildi');
  }

  inMemoryCurrentUser = user;
  return user;
}

export async function registerUser(
  fullName: string,
  email: string,
  password: string,
  role: 'student' | 'resident' | 'doctor',
  courseLevel?: string
): Promise<UserProfile> {
  const normalizedEmail = email.trim().toLowerCase();

  if (inMemoryUsers.some((u) => u.email.toLowerCase() === normalizedEmail)) {
    throw new Error('Bu email orqali allaqachon ro\'yxatdan o\'tilgan');
  }

  const newUser: UserProfile & { password: string } = {
    id: `user-${Date.now()}`,
    email: normalizedEmail,
    fullName: fullName.trim(),
    role,
    courseLevel: courseLevel || (role === 'doctor' ? 'Shifokor' : 'Tibbiyot talabasi'),
    createdAt: new Date().toISOString(),
    password,
  };

  inMemoryUsers.push(newUser);
  inMemoryCurrentUser = newUser;
  return newUser;
}

export async function getCurrentUser(): Promise<UserProfile | null> {
  return inMemoryCurrentUser;
}

export async function logoutUser(): Promise<void> {
  inMemoryCurrentUser = null;
}
