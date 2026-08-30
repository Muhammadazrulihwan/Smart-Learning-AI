import { apiRequest } from './client';
import { UserProfile } from '../types';

export async function register(username: string, email: string, password: string): Promise<UserProfile> {
  return apiRequest<UserProfile>('/auth/register', {
    method: 'POST',
    auth: false,
    body: { username, email, password },
  });
}

/**
 * PENTING: endpoint /auth/login backend memakai OAuth2PasswordRequestForm,
 * yaitu form-urlencoded (bukan JSON) dengan field 'username' dan 'password'.
 * Ini beda dari kebanyakan endpoint lain yang pakai JSON.
 */
export async function login(username: string, password: string): Promise<{ access_token: string }> {
  const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

  const form = new URLSearchParams();
  form.append('username', username);
  form.append('password', password);

  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: form.toString(),
  });

  if (!response.ok) {
    let detail = 'Username atau password salah';
    try {
      const errJson = await response.json();
      if (typeof errJson.detail === 'string') detail = errJson.detail;
    } catch {
      // ignore
    }
    throw new Error(detail);
  }

  return response.json();
}

export async function getMe(): Promise<UserProfile> {
  return apiRequest<UserProfile>('/auth/me');
}
