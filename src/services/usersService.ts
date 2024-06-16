// src/services/usersService.ts
import axios from 'axios';

const BASE_URL = 'http://127.0.0.1:8000';

export const userService = {
  async register(user: any) {
    console.log(JSON.stringify(user));
    return axios.post(`${BASE_URL}/register/`, user);
  },
  async login(credentials: any) {
    console.log(JSON.stringify(credentials));
    const response = await axios.post(`${BASE_URL}/login/`, credentials);
    const { access, refresh } = response.data;
    localStorage.setItem('access_token', access);
    localStorage.setItem('refresh_token', refresh);
    axios.defaults.headers.common['Authorization'] = `Bearer ${access}`;
    return response.data;
  },
  async getUserInfo(userId: number) {
    const response = await axios.get(`${BASE_URL}/api/users/${userId}/`);
    return response.data;
  },
  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
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
