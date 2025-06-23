import axios from 'axios'
import router from '../router'
import { useToast } from '../composables/useToast'

const instance = axios.create({
  baseURL: 'http://localhost:3002',
  headers: {
    'Content-Type': 'application/json',
  },
})

instance.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

//herhangi bir requestten 401(Unauthorized) donerse logine yonlendirmek icin interceptor
instance.interceptors.response.use(
  response => response,
  error => {
    const toast = useToast()
    if (
      error.response &&
      error.response.status === 401
    ) {
      toast.error(error.response.data?.message, 'Unauthorized', { duration: 5000 })
      router.push('/login')
    }
    return Promise.reject(error)
  }
)

export default instance 