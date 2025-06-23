import { defineStore } from 'pinia'
import axios from '../api/axios'
import { ref } from 'vue'
import router from '@/router'

//user ile ilgili isler bu storeda yapilir (CRUD gibi.)
export const useUserStore = defineStore('user', () => {
  const user = ref(null)
  const token = ref('')
  const loading = ref(false)
  const error = ref('')

  function loadFromLocalStorage() {
    const storedUser = localStorage.getItem('user')
    const storedToken = localStorage.getItem('token')

    try {
      user.value = storedUser ? JSON.parse(storedUser) : null
    } catch (e) {
      user.value = null
      localStorage.removeItem('user')
    }

    token.value = storedToken || ''
  }

  async function login(email, password) {
    loading.value = true
    error.value = ''
    try {
      const res = await axios.post('/auth/login', { email, password })
      user.value = res.data.user
      token.value = res.data.token
      localStorage.setItem('user', JSON.stringify(user.value))
      localStorage.setItem('token', token.value)
      return true
    } catch (err) {
      error.value = err.response?.data?.message || 'Login failed'
      return false
    } finally {
      loading.value = false
    }
  }

  async function register(name, email, phone, password) {
    loading.value = true
    error.value = ''
    try {
      const res = await axios.post('/auth/register', { name, email, phone, password })
      user.value = res.data.user
      token.value = res.data.token
      localStorage.setItem('user', JSON.stringify(user.value))
      localStorage.setItem('token', token.value)
      return true
    } catch (err) {
      error.value = err.response?.data?.message || 'Register failed'
      return false
    } finally {
      loading.value = false
    }
  }

  //logout oldugunda localstorageden user ve tokeni sil ardından logine yonlendir
  async function logout() {
    user.value = null
    token.value = '';
    try {
      await axios.post('/auth/logout');
      router.push('/login')
    } catch (err) {
      error.value = err.response?.data?.message || 'Logout failed'
      return false
    } finally {
      loading.value = false;
      localStorage.setItem('user', '')
      localStorage.setItem('token', '')
    }

  }

  loadFromLocalStorage()

  return {
    user,
    token,
    loading,
    error,
    login,
    register,
    logout,
  }
})
