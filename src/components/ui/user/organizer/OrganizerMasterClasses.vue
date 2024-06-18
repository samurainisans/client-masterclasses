<template>
  <div class="organizer-master-classes-container">
    <div class="organizer-master-classes">
      <h2>Мои мероприятия</h2>
      <div class="master-class-list">
        <MasterClassCard
          v-for="masterClass in masterClasses"
          :key="masterClass.id"
          :masterClass="masterClass"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { fetchMasterClasses } from '@/services/organizerService';
import { parseJwt } from '@/services/usersService';
import MasterClassCard from "@/components/ui/masterclass/MasterClassCard.vue";
import Cookies from "js-cookie";

interface MasterClass {
  id: number;
  title: string;
  // Add other properties as needed
}

const masterClasses = ref<MasterClass[]>([]);
const accessToken = Cookies.get('access_token');

let organizerId: number | undefined;

if (accessToken) {
  const decodedToken = parseJwt(accessToken);
  organizerId = decodedToken.user_id;
} else {
  console.error('Токен доступа не найден');
}

const loadMasterClasses = async () => {
  if (!organizerId) {
    console.error('ID организатора не найден');
    return;
  }
  try {
    const data = await fetchMasterClasses(organizerId);
    masterClasses.value = data;
  } catch (error) {
    console.error('Ошибка при загрузке мастер-классов:', error);
  }
};

onMounted(loadMasterClasses);
</script>

<style scoped lang="scss">
@import '@/assets/variables';

.organizer-master-classes-container {
  display: flex;
  justify-content: center;
  padding: 20px;
}

.organizer-master-classes {
  max-width: 1380px;
  width: 100%;

  h2 {
    margin-bottom: 20px;
    color: $green;
  }

  .master-class-list {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
  }
}
</style>
