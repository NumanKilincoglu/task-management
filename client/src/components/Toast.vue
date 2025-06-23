<template>
  <Teleport to="body">
    <div class="toast-container" v-if="isVisible">
      <Transition name="toast" appear>
        <div class="toast" :class="[`toast-${type}`, { 'toast-with-progress': showProgress }]">
          <div class="toast-content">
            <div class="toast-icon">
              <span v-if="type === 'success'">✅</span>
              <span v-else-if="type === 'error'">❌</span>
              <span v-else-if="type === 'warning'">⚠️</span>
              <span v-else>ℹ️</span>
            </div>
            <div class="toast-body">
              <h4 class="toast-title">{{ title }}</h4>
              <p class="toast-message">{{ message }}</p>
            </div>
            <button class="toast-close" @click="close">
              <span>✕</span>
            </button>
          </div>
          <div v-if="showProgress" class="toast-progress">
            <div class="progress-bar" :style="{ width: progressWidth + '%' }"></div>
          </div>
        </div>
      </Transition>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  type: {
    type: String,
    default: 'info',
    validator: (value) => ['success', 'error', 'warning', 'info'].includes(value)
  },
  title: {
    type: String,
    default: ''
  },
  message: {
    type: String,
    required: false,
    default : ''
  },
  duration: {
    type: Number,
    default: 5000
  },
  showProgress: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['close'])

const isVisible = ref(false)
const progressWidth = ref(100)
let progressInterval = null
let closeTimeout = null

const close = () => {
  isVisible.value = false
  clearTimeout(closeTimeout)
  clearInterval(progressInterval)
  emit('close')
}

const startProgress = () => {
  if (!props.showProgress) return

  const startTime = Date.now()

  progressInterval = setInterval(() => {
    const now = Date.now()
    const elapsed = now - startTime
    const remaining = Math.max(0, 100 - (elapsed / props.duration) * 100)

    progressWidth.value = remaining

    if (remaining <= 0) {
      close()
    }
  }, 10)
}

onMounted(() => {
  isVisible.value = true

  if (props.duration > 0) {
    closeTimeout = setTimeout(close, props.duration)
    startProgress()
  }
})

onUnmounted(() => {
  clearTimeout(closeTimeout)
  clearInterval(progressInterval)
})
</script>

<style scoped>
.toast-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
  pointer-events: none;
}

.toast {
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  min-width: 320px;
  max-width: 400px;
  pointer-events: auto;
  overflow: hidden;
  border-left: 4px solid;
  position: relative;
}

.toast-success {
  border-left-color: #38a169;
}

.toast-error {
  border-left-color: #e53e3e;
}

.toast-warning {
  border-left-color: #d69e2e;
}

.toast-info {
  border-left-color: #3182ce;
}

.toast-content {
  display: flex;
  align-items: flex-start;
  padding: 1rem;
  gap: 0.75rem;
}

.toast-icon {
  font-size: 1.25rem;
  flex-shrink: 0;
  margin-top: 0.125rem;
}

.toast-body {
  flex: 1;
  min-width: 0;
}

.toast-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: #2d3748;
  margin: 0 0 0.25rem 0;
  line-height: 1.2;
}

.toast-message {
  font-size: 0.875rem;
  color: #4a5568;
  margin: 0;
  line-height: 1.4;
}

.toast-close {
  background: none;
  border: none;
  color: #a0aec0;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 4px;
  font-size: 1rem;
  line-height: 1;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.toast-close:hover {
  background: #f7fafc;
  color: #4a5568;
}

.toast-progress {
  height: 3px;
  background: #e2e8f0;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background: currentColor;
  transition: width 0.1s linear;
  border-radius: 0 0 0 12px;
}

.toast-success .progress-bar {
  background: #38a169;
}

.toast-error .progress-bar {
  background: #e53e3e;
}

.toast-warning .progress-bar {
  background: #d69e2e;
}

.toast-info .progress-bar {
  background: #3182ce;
}

.toast-enter-active {
  transition: all 0.3s ease;
}

.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

@media (max-width: 480px) {
  .toast-container {
    top: 10px;
    right: 10px;
    left: 10px;
  }

  .toast {
    min-width: auto;
    max-width: none;
  }
}
</style>