// Base API handler for BookLoop
const BASE_URL = '/api';

function getStoredToken() {
  return localStorage.getItem('bookloop_token');
}

async function request(endpoint, options = {}) {
  const token = getStoredToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorMsg = data?.message || data?.data?.message || `HTTP ${response.status}: Request failed`;
    const error = new Error(errorMsg);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

export const api = {
  // Auth endpoints
  auth: {
    loginOrRegister: (payload) =>
      request('/auth/register-or-login', {
        method: 'POST',
        body: JSON.stringify(payload),
      }),
    verifyOtp: (payload) =>
      request('/auth/verify-otp', {
        method: 'POST',
        body: JSON.stringify(payload),
      }),
    resendOtp: (payload) =>
      request('/auth/resend-otp', {
        method: 'POST',
        body: JSON.stringify(payload),
      }),
    directLogin: (payload) =>
      request('/auth/direct-login', {
        method: 'POST',
        body: JSON.stringify(payload),
      }),
  },

  // Books endpoints
  books: {
    getMyBooks: () => request('/books/my'),
    discover: (params = {}) => {
      const query = new URLSearchParams();
      if (params.genre && params.genre !== 'All') query.append('genre', params.genre);
      if (params.search) query.append('search', params.search);
      const qs = query.toString() ? `?${query.toString()}` : '';
      return request(`/books/discover${qs}`);
    },
    getById: (id) => request(`/books/${id}`),
    create: (book) =>
      request('/books', {
        method: 'POST',
        body: JSON.stringify(book),
      }),
    update: (id, book) =>
      request(`/books/${id}`, {
        method: 'PUT',
        body: JSON.stringify(book),
      }),
    delete: (id) =>
      request(`/books/${id}`, {
        method: 'DELETE',
      }),
  },

  // Borrowing Requests
  requests: {
    create: (payload) =>
      request('/requests', {
        method: 'POST',
        body: JSON.stringify(payload),
      }),
    getIncoming: () => request('/requests/incoming'),
    getMyRequests: () => request('/requests/my'),
    approve: (id) =>
      request(`/requests/${id}/approve`, {
        method: 'PUT',
      }),
   reject: (id, reason) =>
  request(`/requests/${id}/reject`, {
    method: 'PUT',
    body: JSON.stringify({ reason }),
  }),
    returnBook: (id) =>
      request(`/requests/${id}/return`, {
        method: 'PUT',
      }),
  },

  // User Profile and Statistics
  user: {
    getProfile: () => request('/user/profile'),
    updateProfile: (profile) =>
      request('/user/profile', {
        method: 'PUT',
        body: JSON.stringify(profile),
      }),
    getStats: () => request('/user/stats'),
  },
};
