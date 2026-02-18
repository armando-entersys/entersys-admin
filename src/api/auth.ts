import { api } from '../lib/axios';
import type { LoginCredentials, AuthResponse } from '../types/auth';

interface RegisterData {
  email: string;
  password: string;
  full_name: string;
}

export const authApi = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    // FastAPI espera form-data para OAuth2PasswordRequestForm
    const formData = new URLSearchParams();
    formData.append('username', credentials.username);
    formData.append('password', credentials.password);

    const { data } = await api.post<AuthResponse>('/auth/token', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    return data;
  },

  async register(userData: RegisterData): Promise<any> {
    const { data } = await api.post('/auth/register', userData);
    return data;
  },

  async requestPasswordReset(email: string): Promise<any> {
    const { data } = await api.post('/auth/forgot-password', { email });
    return data;
  },

  async resetPassword(token: string, newPassword: string): Promise<any> {
    const { data } = await api.post('/auth/reset-password', {
      token,
      new_password: newPassword,
    });
    return data;
  },

  logout() {
    localStorage.removeItem('access_token');
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem('access_token');
  },
};
