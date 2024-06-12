// src/services/usersService.ts
import axios from 'axios';

const BASE_URL = 'http://127.0.0.1:8000/';

export const userService = {
  register(user: any) {
    return axios.post(`${BASE_URL}/register/`, user);
  },
  login(credentials: any) {
    return axios.post(`${BASE_URL}/login/`, credentials);
  }
};
