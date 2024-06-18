import axios from 'axios'

const BASE_URL = 'http://127.0.0.1:8000/api'

interface MasterClass {
  [key: string]: any
}

interface FetchResponse {
  results: any[]
  next?: string
}

interface Category {
  id: number
  name: string
}

interface City {
  id: number
  name: string
}

interface Organizer {
  id: number
  username: string
}

interface Speaker {
  id: number
  username: string
}

export const fetchMasterClasses = async (
  categories: number[] = [],
  cities: string[] = [],
  startDate: Date | null = null,
  endDate: Date | null = null,
  fetchAll: boolean = false
): Promise<any[]> => {
  try {
    const params = new URLSearchParams()
    categories.forEach((category) => params.append('categories', category.toString()))
    cities.forEach((city) => params.append('locality', city))
    if (startDate) {
      params.append('start_date', startDate.toISOString())
    }
    if (endDate) {
      params.append('end_date', endDate.toISOString())
    }

    const fetchPage = async (url: string): Promise<FetchResponse> => {
      const response = await axios.get(url, { params })
      return response.data
    }

    let data: any[] = []
    let url = `${BASE_URL}/masterclasses/`
    let response = await fetchPage(url)
    data = response.results

    if (fetchAll) {
      while (response.next) {
        response = await fetchPage(response.next)
        data = data.concat(response.results)
      }
    }

    return data
  } catch (error) {
    console.error('Error fetching master classes:', error)
    throw error
  }
}

export const fetchMasterClassesByCity = async (city: string): Promise<any[]> => {
  try {
    const response = await axios.get(`${BASE_URL}/masterclasses/by_city/?locality=${city}`)
    return response.data
  } catch (error) {
    console.error('Не удалось загрузить мастер-классы по городу', error)
    throw error
  }
}

export const fetchMasterClassById = async (id: number): Promise<any> => {
  try {
    const response = await axios.get(`${BASE_URL}/masterclasses/${id}/`)
    return response.data
  } catch (error) {
    console.error('Error fetching master class:', error)
    throw error
  }
}

export const fetchOrganizers = async (): Promise<Organizer[]> => {
  try {
    const response = await axios.get(`${BASE_URL}/users/organizers/`)
    return response.data
  } catch (error) {
    console.error('Error fetching organizers:', error)
    throw error
  }
}

export const fetchSpeakers = async (): Promise<Speaker[]> => {
  try {
    const response = await axios.get(`${BASE_URL}/users/speakers/`)
    return response.data
  } catch (error) {
    console.error('Error fetching speakers:', error)
    throw error
  }
}

export const fetchCategories = async (): Promise<Category[]> => {
  try {
    const response = await axios.get(`${BASE_URL}/masterclasses/categories/`)
    return response.data
  } catch (error) {
    console.error('Error fetching categories:', error)
    throw error
  }
}

export const fetchCities = async (): Promise<City[]> => {
  try {
    const response = await axios.get(`${BASE_URL}/masterclasses/cities/`)
    return response.data
  } catch (error) {
    console.error('Error fetching cities:', error)
    throw error
  }
}

export const searchMasterClassesByTitle = async (title: string): Promise<any[]> => {
  try {
    const params = new URLSearchParams()
    params.append('search', title)
    const response = await axios.get(`${BASE_URL}/masterclasses/`, { params })
    return response.data
  } catch (error) {
    console.error('Error searching master classes:', error)
    throw error
  }
}

export const createMasterClassAPI = async (masterClass: MasterClass): Promise<any> => {
  try {
    console.log('Creating master class with data:', JSON.stringify(masterClass, null, 2))

    const formData = new FormData()
    Object.keys(masterClass).forEach((key) => {
      if (key === 'categories') {
        ;(masterClass[key] as any[]).forEach((value: any) => formData.append(key, value))
      } else if (key === 'image_url' && masterClass[key]) {
        formData.append('image_url', masterClass[key], (masterClass[key] as File).name)
      } else {
        formData.append(key, masterClass[key])
      }
    })

    const response = await axios.post(`${BASE_URL}/masterclasses/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return response.data
  } catch (error) {
    console.error('Error creating master class:', error)
    throw error
  }
}

export const geocodeAddress = async (locationName: string): Promise<any> => {
  try {
    const response = await axios.get(`${BASE_URL}/gis/geocode/`, {
      params: { location_name: locationName }
    })
    return response.data
  } catch (error) {
    console.error('Error fetching geocode data:', error)
    throw error
  }
}

export const reverseGeocodeCoordinates = async (
  longitude: number,
  latitude: number
): Promise<any> => {
  try {
    const response = await axios.get(`${BASE_URL}/gis/reverse-geocode/`, {
      params: { longitude, latitude }
    })
    return response.data
  } catch (error) {
    console.error('Error fetching reverse geocode data:', error)
    throw error
  }
}
