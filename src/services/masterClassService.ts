// src/services/masterClassService.ts
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

// get organizers {{BASE_URL}}/users/organizers
export const fetchOrganizers= async () => {
  try {
    const response = await axios.get(`${BASE_URL}/users/organizers`);
    return response.data;
  } catch (error) {
    console.error('Error fetching organizers:', error);
    throw error;
  }
};

// get speakers {{BASE_URL}}/users/speakers
export const fetchSpeakers = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/users/speakers`);
    return response.data;
  } catch (error) {
    console.error('Error fetching speakers:', error);
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

// search masterclasses by title {{BASE_URL}}/masterclasses/?search=title
export const searchMasterClassesByTitle = async (title: string) => {
  try {
    const params = new URLSearchParams();
    params.append('search', title);
    const response = await axios.get(`${BASE_URL}/masterclasses/`, { params });
    return response.data;
  } catch (error) {
    console.error('Error searching master classes:', error);
    throw error;
  }
};

// create masterclass {{BASE_URL}}/masterclasses
export const createMasterClassAPI = async (masterClass) => {
  try {
    // Вывод JSON объекта masterClass в консоль
    console.log('Creating master class with data:', JSON.stringify(masterClass, null, 2));

    const formData = new FormData();
    Object.keys(masterClass).forEach(key => {
      if (Array.isArray(masterClass[key])) {
        masterClass[key].forEach(value => formData.append(key, value));
      } else {
        formData.append(key, masterClass[key]);
      }
    });

    const response = await axios.post(`${BASE_URL}/masterclasses/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating master class:', error);
    throw error;
  }
};

// geocode address {{BASE_URL}}/gis/geocode
export const geocodeAddress = async (locationName: string) => {
  try {
    const response = await axios.get(`${BASE_URL}/gis/geocode`, { params: { location_name: locationName } });
    return response.data;
  } catch (error) {
    console.error('Error fetching geocode data:', error);
    throw error;
  }
};
