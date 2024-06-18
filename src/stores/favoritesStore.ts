import { defineStore } from 'pinia'
import { favoritesService } from '@/services/favoritesService'
import Cookies from 'js-cookie'

export const useFavoritesStore = defineStore('favorites', {
  state: () => ({
    favorites: [] as number[]
  }),

  actions: {
    async addFavorite(masterClassId: number) {
      try {
        await favoritesService.addFavorite(masterClassId)
        this.favorites.push(masterClassId)
      } catch (error) {
        console.error('Error adding favorite', error)
      }
    },

    async removeFavorite(masterClassId: number) {
      try {
        await favoritesService.removeFavorite(masterClassId)
        this.favorites = this.favorites.filter((id) => id !== masterClassId)
      } catch (error) {
        console.error('Error removing favorite', error)
      }
    },

    async fetchFavorites() {
      const accessToken = Cookies.get('access_token')
      if (!accessToken) {
        console.warn('User is not authenticated')
        return
      }
      try {
        const data = await favoritesService.getMyFavorites()
        this.favorites = data.map(
          (favorite: { master_class: { id: number } }) => favorite.master_class.id
        )
      } catch (error) {
        console.error('Error fetching favorites', error)
      }
    },

    isFavorite(masterClassId: number): boolean {
      return this.favorites.includes(masterClassId)
    }
  }
})
