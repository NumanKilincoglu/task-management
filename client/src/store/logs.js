import { ref } from 'vue'
import { defineStore } from 'pinia'
import axios from '../api/axios'

export const useLogsStore = defineStore('logs', () => {
    const mailLogs = ref([])
    const taskLogs = ref([])
    const loading = ref(false)
    const error = ref(null)
    const metaData = ref({ total: 0, page: 1, limit: 10, totalPages: 1 })

    async function getMailLogs(params = {}) {
        loading.value = true
        error.value = null
        mailLogs.value = [];
        try {
            const { data } = await axios.get('/logs/mail', { params })
            mailLogs.value = data.logs || []
            metaData.value = data.meta || { total: 0, page: 1, limit: 10, totalPages: 1 }
        } catch (err) {
            error.value = err.response?.data?.message || 'Failed to fetch mail logs'
        } finally {
            loading.value = false
        }
    }

    async function getTaskLogs(params = {}) {
        loading.value = true
        error.value = null
        taskLogs.value = [];
        try {
            const { data } = await axios.get('/logs/task', { params })
            taskLogs.value = data.logs || []
            metaData.value = data.meta || { total: 0, page: 1, limit: 10, totalPages: 1 }
        } catch (err) {
            error.value = err.response?.data?.message || 'Failed to fetch task logs'
        } finally {
            loading.value = false
        }
    }

    return {
        mailLogs,
        taskLogs,
        loading,
        error,
        metaData,
        getMailLogs,
        getTaskLogs
    }
}) 