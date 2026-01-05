export interface User {
  data: any;
  _id: string;
  username: string;
  role: "admin" | "user";
}

export interface LoginPayload {
  companyEmail: string;
  password: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
    error?: string | null; 
}
