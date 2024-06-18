<!-- src/components/ui/permission/AuthGuard.vue -->
<template>
  <slot v-if="hasAccess"></slot>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useUserStore } from '@/stores/userStore'

const props = defineProps<{ roles: string[] }>()

const userStore = useUserStore()
const user = computed(() => userStore.user)

const hasAccess = computed(() => {
  if (!user.value) {
    return false
  }
  return props.roles.includes(user.value.role)
})
</script>
