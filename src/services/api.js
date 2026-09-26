import { auth } from '@/config/firebase';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export async function fetchWithAuth(endpoint, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  try {
    const currentUser = auth.currentUser;
    if (currentUser) {
      const token = await currentUser.getIdToken();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }
  } catch (e) {
    console.warn('[API] Failed to get Firebase token:', e);
  }

  const url = endpoint.startsWith('http') ? endpoint : `${BASE_URL}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => null);
  return { ok: response.ok, status: response.status, data };
}

export default fetchWithAuth;
