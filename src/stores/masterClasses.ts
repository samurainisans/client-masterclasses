import { defineStore } from 'pinia';
import data from '@/assets/enriched_masterclasses.json';

type MasterClass = {
    title: string;
    description: string;
    location_name: string;
    categories: string[];
    image: string | undefined;
    speakers: {
        name: string;
        title: string;
        image: string | undefined;
    }[];
    organizer: {
        name: string | null;
        logo: string | null;
    };
    registration_deadline: string;
    start_time: string;
    coordinates: {
        latitude: number;
        longitude: number;
    };
    country: string;
    province: string;
    area: string;
    locality: string;
    street?: string;
    house?: string;
    postal_code?: string;
};

function parseData(data: any[]): MasterClass[] {
    return data.map((item) => ({
        ...item,
        coordinates: {
            latitude: parseFloat(item.coordinates.latitude),
            longitude: parseFloat(item.coordinates.longitude),
        },
    }));
}

export const useMasterClassesStore = defineStore('masterClasses', {
    state: () => ({
        masterClasses: parseData(data),
    }),
    getters: {
        getMasterClasses: (state) => state.masterClasses,
    },
    actions: {
        updateMasterClass(index: number, newData: MasterClass) {
            this.masterClasses[index] = newData;
        },
    },
});