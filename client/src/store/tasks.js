import { defineStore } from 'pinia'
import axios from '../api/axios'
import { ref } from 'vue'

export const useTasksStore = defineStore('tasks', () => {
  const tasks = ref([])
  const task = ref({})
  const totalCount = ref(0)
  const metaData = ref({
    page: 0,
    total: 0,
    totalPages: 1,
    limit: 5,
  })
  const loading = ref(false)
  const error = ref('')

  async function fetchTasks(params = {}) {
    loading.value = true
    tasks.value = []
    error.value = ''
    try {
      const res = await axios.get('/tasks', { params })
      tasks.value = res.data.tasks || res.data
      metaData.value = res.data.meta
    } catch (err) {
      error.value = err.response?.data?.message || 'Could not fetch tasks'
    } finally {
      loading.value = false
    }
  }

  async function addTask(task) {
    loading.value = true
    error.value = ''

    //file gondermek icin formData sekline cevirdim
    try {
      const formData = new FormData();

      for (const key in task) {
        if (task[key] !== undefined && task[key] !== null) {
          if (key === 'attachment' && task[key] instanceof File) {
            formData.append(key, task[key])
          } else {
            formData.append(key, task[key])
          }
        }
      }

      const res = await axios.post('/tasks', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      tasks.value.push(res.data)
      return true
    } catch (err) {
      error.value = err.response?.data?.message || 'Could not add task'
      return false
    } finally {
      loading.value = false
    }
  }

  async function updateTask(id, task) {
    loading.value = true
    error.value = ''
    try {
      const formData = new FormData()

      for (const key in task) {
        if (task[key] !== undefined && task[key] !== null) {
          formData.append(key, task[key])
        }
      }

      const res = await axios.put(`/tasks/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      const idx = tasks.value.findIndex(t => t.id === id)
      if (idx !== -1) tasks.value[idx] = res.data
      return true
    } catch (err) {
      error.value = err.response?.data?.message || 'Could not update task'
      return false
    } finally {
      loading.value = false
    }
  }

  async function deleteTask(id) {
    loading.value = true
    error.value = ''
    try {
      await axios.delete(`/tasks/${id}`)
      tasks.value = tasks.value.filter(t => t.id !== id)
      return true
    } catch (err) {
      error.value = err.response?.data?.message || 'Could not delete task'
      return false
    } finally {
      loading.value = false
    }
  }

  async function getTask(id) {
    loading.value = true
    error.value = ''
    task.value = {};
    try {
      const res = await axios.get(`/tasks/${id}`)
      task.value = res?.data?.task;
      return res.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Could not fetch task'
      return null
    } finally {
      loading.value = false
    }
  }

  return { tasks, task, totalCount, metaData, loading, error, fetchTasks, addTask, updateTask, deleteTask, getTask }
}) 