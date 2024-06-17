import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

export const registrationService = {
  async registerForMasterClass(masterClassId: number) {
    const response = await axios.post(`${API_URL}/masterclasses/${masterClassId}/register/`);
    return response.data;
  },
};
