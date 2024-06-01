// services/masterClassService.ts
import axios from 'axios';

const BASE_URL = 'http://127.0.0.1:8000/api';

//get masterclasses {{BASE_URL}}/masterclasses
export const fetchMasterClasses = async () => {
  const response = await axios.get(`${BASE_URL}/masterclasses/`); // Добавил слэш в конце
  return response.data;
};

//get categories {{BASE_URL}}/masterclasses/categories
export const fetchCategories = async () => {
  const response = await axios.get(`${BASE_URL}/masterclasses/categories`);
  return response.data;
};