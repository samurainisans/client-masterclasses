// src/services/usersService.ts
import axios from 'axios';
import Cookies from 'js-cookie';

const BASE_URL = 'http://127.0.0.1:8000';

axios.interceptors.request.use((config) => {
  const accessToken = Cookies.get('access_token');
  if (accessToken) {
    config.headers['Authorization'] = `Bearer ${accessToken}`;
  }
  return config;
});

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = Cookies.get('refresh_token');
      if (refreshToken) {
        try {
          const response = await axios.post(`${BASE_URL}/token/refresh/`, { refresh: refreshToken });
          Cookies.set('access_token', response.data.access, { secure: true });
          originalRequest.headers['Authorization'] = `Bearer ${response.data.access}`;
          return axios(originalRequest);
        } catch (e) {
          console.error('Refresh token invalid:', e);
        }
      }
    }
    return Promise.reject(error);
  }
);

export const userService = {
  async register(user: any) {
    return axios.post(`${BASE_URL}/register/`, user);
  },
  async login(credentials: any) {
    const response = await axios.post(`${BASE_URL}/login/`, credentials);
    const { access, refresh } = response.data;
    Cookies.set('access_token', access, { secure: true });
    Cookies.set('refresh_token', refresh, { secure: true });
    axios.defaults.headers.common['Authorization'] = `Bearer ${access}`;
    return response.data;
  },
  async getUserInfo(userId: number) {
    return axios.get(`${BASE_URL}/api/users/${userId}/`);
  },
  async updateUser(userId: number, userData: FormData) {
    return axios.put(`${BASE_URL}/users/${userId}/`, userData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },
  logout() {
    Cookies.remove('access_token');
    Cookies.remove('refresh_token');
    delete axios.defaults.headers.common['Authorization'];
  }
};

export function parseJwt(token: string) {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split('')
      .map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join('')
  );
  return JSON.parse(jsonPayload);
}
