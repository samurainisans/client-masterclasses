<!--ModalCategories.vue-->
<template>
  <div class="modal-backdrop" @click.self="closeModal">
    <div class="modal-content">
      <div class="modal-header">
        <slot name="header"></slot>
        <button class="close-button" @click="closeModal">&times;</button>
      </div>
      <div class="modal-body">
        <slot name="body"></slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const emits = defineEmits(['close'])

const closeModal = () => {
  emits('close')
}
</script>

<style scoped lang="scss">
@import '@/assets/variables';
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  width: 400px;
  max-width: 90%;
  max-height: 90%;
  display: flex;
  flex-direction: column;
}

.modal-header {
  padding: 10px 15px;
  background: $green;
  color: $white;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-body {
  padding: 15px;
  overflow-y: auto;
}

.close-button {
  background: none;
  border: none;
  color: $white;
  font-size: 24px;
  cursor: pointer;
}
</style>
