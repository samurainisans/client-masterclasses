// services/masterClassService.ts
import axios from 'axios';

const BASE_URL = 'http://127.0.0.1:8000/api';

// get masterclasses {{BASE_URL}}/masterclasses
export const fetchMasterClasses = async (categories = [], cities = [], startDate = null, endDate = null) => {
  try {
    const params = new URLSearchParams();
    categories.forEach(category => params.append('categories', category.toString()));
    cities.forEach(city => params.append('locality', city));
    if (startDate) {
      params.append('start_date', startDate.toISOString());
    }
    if (endDate) {
      params.append('end_date', endDate.toISOString());
    }

    const response = await axios.get(`${BASE_URL}/masterclasses/`, { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching master classes:', error);
    throw error;
  }
};

// get categories {{BASE_URL}}/masterclasses/categories
export const fetchCategories = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/masterclasses/categories`);
    return response.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

// get cities {{BASE_URL}}/masterclasses/cities
export const fetchCities = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/masterclasses/cities`);
    return response.data;
  } catch (error) {
    console.error('Error fetching cities:', error);
    throw error;
  }
};
