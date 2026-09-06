export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  role: 'student' | 'resident' | 'doctor';
  courseLevel?: string;
  createdAt: string;
}
