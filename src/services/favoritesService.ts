// src/services/favoritesService.ts
import axios from 'axios'

const API_URL = 'http://localhost:8000/api'

export const favoritesService = {
  async addFavorite(masterClassId: number) {
    return axios.post(`${API_URL}/masterclasses/favorites/add/`, {
      master_class_id: masterClassId
    })
  },

  async removeFavorite(masterClassId: number) {
    return axios.delete(`${API_URL}/masterclasses/favorites/remove/`, {
      data: { master_class_id: masterClassId }
    })
  },

  async getMyFavorites() {
    const response = await axios.get(`${API_URL}/masterclasses/favorites/my/`)
    return response.data
  }
}
