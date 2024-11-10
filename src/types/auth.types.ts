export interface AuthProps {
  username: string;
  email: string;
  password: string;
  role?: 'admin' |'user' | '';
}
