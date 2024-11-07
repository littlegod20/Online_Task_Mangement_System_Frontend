export interface AuthProps {
  username: string | null;
  email: string | null;
  password: string | null;
  role?: "user" | "admin" | null;
}
