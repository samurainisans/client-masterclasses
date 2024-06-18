import { defineStore } from 'pinia'
import { registrationService } from '@/services/registrationService'

export const useRegistrationStore = defineStore('registration', {
  state: () => ({
    registrationStatus: null as string | null
  }),

  actions: {
    async registerForMasterClass(masterClassId: number) {
      try {
        const response = await registrationService.registerForMasterClass(masterClassId)
        this.registrationStatus = response.status
        return response
      } catch (error) {
        this.registrationStatus = 'registration failed'
        throw error
      }
    }
  }
})
