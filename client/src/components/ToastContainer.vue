<template>
  <div class="toast-container-wrapper">
    <div class="toast-container">
      <component
        v-for="toast in toasts"
        :key="toast.id"
        :is="toast.component"
        v-bind="toast.props"
      />
    </div>
  </div>
</template>

<script setup>
import { useToast } from '../composables/useToast'

const { toasts } = useToast()
</script>

<style scoped>
.toast-container-wrapper {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
  pointer-events: none;
}

.toast-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

@media (max-width: 480px) {
  .toast-container-wrapper {
    top: 10px;
    right: 10px;
    left: 10px;
  }
}
</style> 