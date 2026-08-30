const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

function getToken(): string | null {
  return localStorage.getItem('access_token');
}

interface RequestOptions {
  method?: string;
  body?: unknown;
  isForm?: boolean;
  auth?: boolean;
}

/**
 * Wrapper fetch generik. Semua modul api/*.ts memakai ini supaya
 * penanganan token dan error konsisten di satu tempat.
 */
export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, isForm = false, auth = true } = options;

  const headers: Record<string, string> = {};
  if (auth) {
    const token = getToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }

  let fetchBody: BodyInit | undefined;
  if (body !== undefined) {
    if (isForm) {
      fetchBody = body as FormData;
      // jangan set Content-Type manual untuk FormData, browser yang set boundary-nya
    } else {
      headers['Content-Type'] = 'application/json';
      fetchBody = JSON.stringify(body);
    }
  }

  const response = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: fetchBody,
  });

  if (!response.ok) {
    let detail = `Request gagal (${response.status})`;
    try {
      const errJson = await response.json();
      if (typeof errJson.detail === 'string') detail = errJson.detail;
    } catch {
      // response bukan JSON, pakai pesan default
    }
    throw new ApiError(response.status, detail);
  }

  // beberapa endpoint (jarang) bisa balas kosong
  const text = await response.text();
  return text ? (JSON.parse(text) as T) : (undefined as T);
}
