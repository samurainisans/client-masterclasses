// src/stores/masterClasses.ts

import { defineStore } from 'pinia'
import {
  fetchMasterClasses,
  fetchMasterClassById,
  searchMasterClassesByTitle,
  createMasterClassAPI,
  fetchCategories,
  fetchOrganizers,
  fetchSpeakers,
  geocodeAddress,
  reverseGeocodeCoordinates
} from '@/services/masterClassService'

type User = {
  id: number
  username: string
  first_name: string
  last_name: string
  email: string
  bio: string | null
  image: string | null
}


export type Category = {
  id: number
  name: string
}


type MasterClass = {
  id: number
  title: string
  description: string
  location_name: string
  categories: Category[]
  image_url: string | null
  speakers: User[]
  organizer: User
  registration_deadline: string
  start_date: string
  end_date: string
  duration: number
  coordinates: {
    latitude: number
    longitude: number
  }
  country: string
  province: string
  area: string
  locality: string
  street: string
  house: string
  postal_code: string
  requires_approval: boolean
  price: string
}

type Organizer = Omit<User, 'id'> & { id: number }

type Speaker = Omit<User, 'id'> & { id: number }

export const useMasterClassesStore = defineStore('masterClasses', {
  state: () => ({
    masterClasses: [] as MasterClass[],
    organizers: [] as User[],
    speakers: [] as User[],
    loading: false,
    error: null as string | null,
    selectedCategories: [] as number[],
    selectedCities: [] as string[],
    startDate: null as Date | null,
    endDate: null as Date | null,
    addressData: {
      latitude: 0,
      longitude: 0,
      country: '',
      province: '',
      area: '',
      locality: '',
      street: '',
      house: '',
      postal_code: ''
    },
    selectedMasterClass: null as MasterClass | null
  }),
  getters: {
    getMasterClasses: (state) => state.masterClasses,
    getOrganizers: (state) => state.organizers,
    getSpeakers: (state) => state.speakers,
    getSelectedMasterClass: (state) => state.selectedMasterClass
  },
  actions: {
    async fetchMasterClasses() {
      this.loading = true
      try {
        const data = await fetchMasterClasses(
          this.selectedCategories,
          this.selectedCities,
          this.startDate,
          this.endDate
        )
        this.masterClasses = data.map((item) => ({
          ...item,
          coordinates: {
            latitude: parseFloat(item.latitude),
            longitude: parseFloat(item.longitude)
          }
        }))
        this.loading = false
      } catch (error) {
        this.error = 'Failed to load master classes'
        this.loading = false
      }
    },
    async fetchMasterClassById(id: number) {
      this.loading = true
      try {
        const data = await fetchMasterClassById(id)
        this.selectedMasterClass = {
          ...data,
          coordinates: {
            latitude: parseFloat(data.latitude),
            longitude: parseFloat(data.longitude)
          }
        }
        this.loading = false
      } catch (error) {
        this.error = 'Failed to load master class'
        this.loading = false
      }
    },
    async fetchAllMasterClasses(b: boolean) {
      this.loading = true
      try {
        const data = await fetchMasterClasses(
          this.selectedCategories,
          this.selectedCities,
          this.startDate,
          this.endDate,
          true
        )
        this.masterClasses = data.map((item) => ({
          ...item,
          coordinates: {
            latitude: parseFloat(item.latitude),
            longitude: parseFloat(item.longitude)
          }
        }))
        this.loading = false
      } catch (error) {
        this.error = 'Failed to load all master classes'
        this.loading = false
      }
    },
    async fetchOrganizers() {
      try {
        const organizers = await fetchOrganizers()
        this.organizers = organizers.map((organizer: any) => ({
          id: organizer.id,
          username: organizer.username,
          first_name: organizer.first_name,
          last_name: organizer.last_name,
          email: organizer.email,
          bio: organizer.bio,
          image: organizer.image
        }))
      } catch (error) {
        this.error = 'Failed to fetch organizers'
      }
    },
    async fetchSpeakers() {
      try {
        const speakers = await fetchSpeakers()
        this.speakers = speakers.map((speaker: any) => ({
          id: speaker.id,
          username: speaker.username,
          first_name: speaker.first_name,
          last_name: speaker.last_name,
          email: speaker.email,
          bio: speaker.bio,
          image: speaker.image
        }))
      } catch (error) {
        this.error = 'Failed to fetch speakers'
      }
    },
    async createMasterClass(masterClass: any) {
      this.loading = true
      try {
        await createMasterClassAPI(masterClass)
        await this.fetchMasterClasses()
        this.loading = false
      } catch (error) {
        this.error = 'Failed to create master class'
        this.loading = false
      }
    },
    async searchMasterClassesByTitle(title: string) {
      this.loading = true
      try {
        const data = await searchMasterClassesByTitle(title)
        this.masterClasses = data.map((item) => ({
          ...item,
          coordinates: {
            latitude: parseFloat(item.latitude),
            longitude: parseFloat(item.longitude)
          }
        }))
        this.loading = false
      } catch (error) {
        this.error = 'Failed to search master classes'
        this.loading = false
      }
    },
    async fetchCategories() {
      try {
        return await fetchCategories()
      } catch (error) {
        this.error = 'Failed to fetch categories'
      }
    },
    async geocodeAddress(locationName: string) {
      try {
        const data = await geocodeAddress(locationName)
        this.addressData = {
          latitude: data.latitude,
          longitude: data.longitude,
          country: data.country,
          province: data.province,
          area: data.area,
          locality: data.locality,
          street: data.street,
          house: data.house,
          postal_code: data.postal_code
        }
      } catch (error) {
        this.error = 'Failed to geocode address'
      }
    },
    async reverseGeocodeCoordinates(longitude: number, latitude: number) {
      try {
        const data = await reverseGeocodeCoordinates(longitude, latitude)
        this.addressData = {
          latitude: data.latitude,
          longitude: data.longitude,
          country: data.country,
          province: data.province,
          area: data.area,
          locality: data.locality,
          street: data.street,
          house: data.house,
          postal_code: data.postal_code
        }
      } catch (error) {
        this.error = 'Failed to reverse geocode coordinates'
      }
    },
    setSelectedCategories(categories: number[]) {
      this.selectedCategories = categories
    },
    setSelectedCities(cities: string[]) {
      this.selectedCities = cities
    },
    setStartDate(date: Date | null) {
      this.startDate = date
    },
    setEndDate(date: Date | null) {
      this.endDate = date
    }
  }
})
