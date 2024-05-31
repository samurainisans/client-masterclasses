// stores/masterClasses.ts
import { defineStore } from 'pinia';
import { fetchMasterClasses } from '@/services/masterClassService';

type MasterClass = {
    id: number;
    title: string;
    description: string;
    location_name: string;
    categories: number[];
    image: string | null;
    speakers: number;
    organizer: number;
    registration_deadline: string;
    start_date: string;
    end_date: string;
    duration: number;
    coordinates: {
        latitude: number;
        longitude: number;
    };
    country: string;
    province: string;
    area: string;
    locality: string;
    street: string;
    house: string;
    postal_code: string;
};

export const useMasterClassesStore = defineStore('masterClasses', {
    state: () => ({
        masterClasses: [] as MasterClass[],
        loading: false,
        error: null as string | null,
    }),
    getters: {
        getMasterClasses: (state) => state.masterClasses,
    },
    actions: {
        async fetchMasterClasses() {
            this.loading = true;
            try {
                const data = await fetchMasterClasses();
                this.masterClasses = data.map((item) => ({
                    ...item,
                    coordinates: {
                        latitude: parseFloat(item.latitude),
                        longitude: parseFloat(item.longitude),
                    },
                }));
                this.loading = false;
            } catch (error) {
                this.error = 'Failed to load master classes';
                this.loading = false;
            }
        },
        updateMasterClass(index: number, newData: MasterClass) {
            this.masterClasses[index] = newData;
        },
    },
});
