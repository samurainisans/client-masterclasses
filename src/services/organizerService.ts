// src/services/organizerService.ts
import axios from 'axios'

const BASE_URL_AUTH = 'http://localhost:8000'

export const fetchMasterClasses = async (organizerId: number) => {
  try {
    const response = await axios.get(`${BASE_URL_AUTH}/organizer/${organizerId}/masterclasses/`)
    return response.data
  } catch (error) {
    console.error('Ошибка при загрузке мероприятий:', error)
    throw error
  }
}

// Вы можете добавить другие функции, связанные с организаторами, здесь
