import { ref, markRaw } from 'vue'
import Toast from '../components/Toast.vue'

const toasts = ref([])
let toastId = 0

export function useToast() {
  const showToast = (options) => {
    const id = ++toastId
    const toast = {
      id,
      component: markRaw(Toast),
      props: {
        ...options,
        onClose: () => removeToast(id)
      }
    }

    toasts.value.push(toast)
    return id
  }

  const removeToast = (id) => {
    const index = toasts.value.findIndex(toast => toast.id === id)
    if (index > -1) {
      toasts.value.splice(index, 1)
    }
  }

  const success = (message, title = 'Success', options = {}) => {
    return showToast({
      type: 'success',
      title,
      message,
      ...options
    })
  }

  const error = (message, title = 'Error', options = {}) => {
    return showToast({
      type: 'error',
      title,
      message,
      ...options
    })
  }

  const warning = (message, title = 'Warning', options = {}) => {
    return showToast({
      type: 'warning',
      title,
      message,
      ...options
    })
  }

  const info = (message, title = 'Info', options = {}) => {
    return showToast({
      type: 'info',
      title,
      message,
      ...options
    })
  }

  const clearAll = () => {
    toasts.value = []
  }

  return {
    toasts,
    showToast,
    success,
    error,
    warning,
    info,
    removeToast,
    clearAll
  }
} 