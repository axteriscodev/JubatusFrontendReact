export interface User {
  id: number;
  email: string;
  fullName: string;
  level: number;
}

export interface UserState {
  user: User | null;
  isAuthenticated: boolean;
}
