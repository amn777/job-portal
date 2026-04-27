import axios from 'axios';

const API_BASE = 'https://job-portal-4-ll7r.onrender.com/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auto-logout on 401
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.clear();
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

// ─── AUTH ───────────────────────────────────────────
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login:    (data) => api.post('/auth/login',    data),
};

// ─── JOBS ────────────────────────────────────────────
export const jobAPI = {
  getAll:   (page = 0, size = 10) =>
    api.get(`/jobs?page=${page}&size=${size}`),
  search:   (params) =>
    api.get('/jobs/search', { params }),
  getById:  (id) => api.get(`/jobs/${id}`),
  create:   (data) => api.post('/jobs', data),
  update:   (id, data) => api.put(`/jobs/${id}`, data),
  delete:   (id) => api.delete(`/jobs/${id}`),
  getMyJobs:(page = 0, size = 10) =>
    api.get(`/jobs/my-jobs?page=${page}&size=${size}`),
};

// ─── APPLICATIONS ────────────────────────────────────
export const applicationAPI = {
  apply:          (data) => api.post('/applications', data),
  getMyApps:      (page = 0, size = 10) =>
    api.get(`/applications/my?page=${page}&size=${size}`),
  getJobApps:     (jobId, page = 0, size = 10) =>
    api.get(`/applications/job/${jobId}?page=${page}&size=${size}`),
  updateStatus:   (id, status) =>
    api.patch(`/applications/${id}/status`, { status }),
};

// ─── REFERRALS ───────────────────────────────────────
export const referralAPI = {
  create:         (data) => api.post('/referrals', data),
  getMyReferrals: ()     => api.get('/referrals/my'),
  getLeaderboard: ()     => api.get('/referrals/leaderboard'),
};

// ─── NOTIFICATIONS ───────────────────────────────────
export const notificationAPI = {
  getAll:       () => api.get('/notifications'),
  getUnread:    () => api.get('/notifications/unread-count'),
  markAllRead:  () => api.put('/notifications/mark-all-read'),
};

// ─── ADMIN ───────────────────────────────────────────
export const adminAPI = {
  getStats:       () => api.get('/admin/stats'),
  getAllUsers:     () => api.get('/admin/users'),
  deleteUser:     (id) => api.delete(`/admin/users/${id}`),
  toggleJob:      (id) => api.patch(`/admin/jobs/${id}/toggle`),
};

// ─── SAVED JOBS ──────────────────────────────────────
export const savedJobAPI = {
  save:     (jobId) => api.post(`/saved-jobs/${jobId}`),
  unsave:   (jobId) => api.delete(`/saved-jobs/${jobId}`),
  getMySaved: ()    => api.get('/saved-jobs'),
};

export default api;
