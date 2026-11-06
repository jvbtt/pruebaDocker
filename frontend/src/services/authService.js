const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8081/api';

async function handleResponse(response) {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const errorMessage =
      data?.message ||
      (data?.errors && Object.values(data.errors).join(' ')) ||
      'Error en la comunicación con el servidor';
    throw new Error(errorMessage);
  }
  return data;
}

export const authService = {
  async login(email, password) {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    return handleResponse(response);
  },

  async register(name, email, password) {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({ name, email, password }),
    });
    return handleResponse(response);
  },

  async getProfile(token) {
    const response = await fetch(`${API_URL}/auth/me`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    return handleResponse(response);
  },
};

