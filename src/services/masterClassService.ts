// services/masterClassService.ts
import axios from 'axios';

const BASE_URL = 'http://127.0.0.1:8000';

export const fetchMasterClasses = async () => {
  const response = await axios.get(`${BASE_URL}/masterclasses/`); // Добавил слэш в конце
  return response.data;
};
