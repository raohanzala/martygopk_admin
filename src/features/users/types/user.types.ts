export interface UserFormValues {
  name: string;
  email: string;
  password: string;
  role: 'user' | 'admin';
}
