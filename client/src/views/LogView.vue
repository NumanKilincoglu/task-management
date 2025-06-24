<template>
    <div class="logview-wrapper">
        <div class="logview-header">
            <h1>📝 Logs</h1>
            <div class="logview-tabs">
                <button :class="{ active: activeTab === 'mail' }" @click="activeTab = 'mail'">Mail Logs</button>
                <button :class="{ active: activeTab === 'task' }" @click="activeTab = 'task'">Task Logs</button>
            </div>
            <div v-if="activeTab === 'mail'" class="logview-filters">
                <Dropdown v-model="mailLogParams.status" :options="mailStatusOptions" placeholder="Status"
                    @update:modelValue="onMailDropdownChange" />
                <Dropdown v-model="mailLogParams.orderBy" :options="mailSortOptions" placeholder="Sort by Sent At"
                    @update:modelValue="onMailDropdownChange" />
            </div>
            <div v-else class="logview-filters">
                <Dropdown v-model="taskLogParams.action" :options="taskActionOptions" placeholder="Action"
                    @update:modelValue="onTaskDropdownChange" />
                <Dropdown v-model="taskLogParams.orderBy" :options="taskSortOptions" placeholder="Sort by Created At"
                    @update:modelValue="onTaskDropdownChange" />
            </div>
            <input v-model="searchQuery" placeholder="Search..." class="logview-search" @input="debouncedFetch" />
        </div>

        <div v-if="logsStore.loading" class="logview-loading">
            <div class="spinner"></div>
            <span>Loading...</span>
        </div>
        <div v-if="logsStore.error" class="logview-error">
            <span>⚠️ {{ logsStore.error }}</span>
        </div>

        <div class="logview-table-card">
            <table class="logview-table" v-if="activeTab === 'mail'">
                <thead>
                    <tr>
                        <th>Recipient</th>
                        <th>Subject</th>
                        <th>Status</th>
                        <th>Sent At</th>
                        <th>Task ID</th>
                        <th>Error</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="log in logsStore.mailLogs" :key="log.id">
                        <td>{{ log.recipient }}</td>
                        <td>{{ log.subject }}</td>
                        <td>
                            <span :class="['status', log.status]">{{ log.status }}</span>
                        </td>
                        <td>{{ log.sentAt ? new Date(log.sentAt).toLocaleString() : '-' }}</td>
                        <td>{{ log.taskId }}</td>
                        <td>
                            <span v-if="log.error">{{ log.error }}</span>
                            <span v-else>-</span>
                        </td>
                    </tr>
                </tbody>
            </table>
            <table class="logview-table" v-else>
                <thead>
                    <tr>
                        <th>Task ID</th>
                        <th>User ID</th>
                        <th>Action</th>
                        <th>Changes</th>
                        <th>Created At</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="log in logsStore.taskLogs" :key="log._id">
                        <td>{{ log.taskId }}</td>
                        <td>{{ log.userId }}</td>
                        <td>{{ log.action }}</td>
                        <td>{{ log.changes }}</td>
                        <td>{{ log.createdAt ? new Date(log.createdAt).toLocaleString() : '-' }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <PaginationBar v-if="logsStore.metaData.totalPages >= 1" :current-page="logsStore.metaData.page"
            :total-pages="logsStore.metaData.totalPages" @change="changePage" />
    </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { useLogsStore } from '../store/logs'
import PaginationBar from '@/components/PaginationBar.vue'
import Dropdown from '@/components/Dropdown.vue'
import { debounce } from '@/utils/helpers'

const logsStore = useLogsStore()
const activeTab = ref('mail')
const searchQuery = ref('')

const mailStatusOptions = [
    { value: '', label: 'All Status' },
    { value: 'sent', label: 'Sent' },
    { value: 'failed', label: 'Failed' }
]
const mailSortOptions = [
    { value: '-sentAt', label: 'Sent At Desc' },
    { value: 'sentAt', label: 'Sent At Asc' }
]
const taskActionOptions = [
    { value: '', label: 'All Actions' },
    { value: 'created', label: 'Created' },
    { value: 'updated', label: 'Updated' },
    { value: 'completed', label: 'Completed' },
    { value: 'deleted', label: 'Deleted' }
]
const taskSortOptions = [
    { value: '-createdAt', label: 'Created At Desc' },
    { value: 'createdAt', label: 'Created At Asc' }
]

const mailLogParams = ref({
    page: 1,
    limit: 10,
    status: '',
    search: '',
    orderBy: '-sentAt'
})
const taskLogParams = ref({
    page: 1,
    limit: 10,
    action: '',
    search: '',
    orderBy: '-createdAt'
})

function updateParams() {
    mailLogParams.value.page = logsStore.metaData.page
    mailLogParams.value.limit = logsStore.metaData.limit
    mailLogParams.value.search = searchQuery.value
    taskLogParams.value.page = logsStore.metaData.page
    taskLogParams.value.limit = logsStore.metaData.limit
    taskLogParams.value.search = searchQuery.value
}

function filterParams(obj) {
    return Object.fromEntries(
        Object.entries(obj).filter(([k, v]) => v !== '' && v !== undefined && v !== null)
    )
}

async function fetchLogs() {
    updateParams()
    if (activeTab.value === 'mail') {
        await logsStore.getMailLogs(filterParams(mailLogParams.value))
    } else {
        await logsStore.getTaskLogs(filterParams(taskLogParams.value))
    }
}

function changePage(page) {
    logsStore.metaData.page = page
    fetchLogs()
}

const debouncedFetch = debounce(fetchLogs, 1000)

function onMailDropdownChange() {
    logsStore.metaData.page = 1
    fetchLogs()
}
function onTaskDropdownChange() {
    logsStore.metaData.page = 1
    fetchLogs()
}

watch(searchQuery, () => {
    logsStore.metaData.page = 1
    debouncedFetch()
})

watch(activeTab, () => {
    logsStore.metaData.page = 1
    fetchLogs()
})

onMounted(() => {
    fetchLogs()
})
</script>

<style scoped>
.logview-wrapper {
    min-height: 100vh;
    background: transparent;
    padding: 2.5rem;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.logview-header {
    background: #fff;
    border-radius: 18px;
    box-shadow: 0 4px 24px rgba(80, 0, 120, 0.08);
    padding: 2rem 2.5rem 1.5rem 2.5rem;
    margin-bottom: 2rem;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 1.2rem;
}

.logview-header h1 {
    font-size: 2.2rem;
    font-weight: 800;
    background: linear-gradient(90deg, #7c3aed, #38bdf8);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin: 0;
}

.logview-tabs {
    display: flex;
    gap: 1rem;
}

.logview-tabs button {
    background: #ede9fe;
    color: #7c3aed;
    border: none;
    border-radius: 8px;
    padding: 0.5rem 1.5rem;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s, color 0.2s;
}

.logview-tabs button.active {
    background: #7c3aed;
    color: #fff;
}

.logview-search {
    width: 100%;
    max-width: 350px;
    padding: 0.7rem 1.2rem;
    border: 2px solid #e0e7ff;
    border-radius: 10px;
    font-size: 1rem;
    background: #f3f4f6;
    color: #312e81;
    transition: border 0.2s;
}

.logview-search:focus {
    outline: none;
    border-color: #7c3aed;
    background: #fff;
}

.logview-loading,
.logview-error {
    background: #fff;
    border-radius: 16px;
    box-shadow: 0 2px 12px rgba(80, 0, 120, 0.07);
    padding: 2rem;
    margin-bottom: 2rem;
    width: 100%;
    max-width: 900px;
    text-align: center;
    font-size: 1.1rem;
}

.spinner {
    width: 32px;
    height: 32px;
    border: 4px solid #e0e7ff;
    border-top: 4px solid #7c3aed;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 0 auto 1rem;
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}

.logview-table-card {
    background: #fff;
    border-radius: 18px;
    box-shadow: 0 4px 24px rgba(80, 0, 120, 0.08);
    padding: 2rem 1rem;
    width: 100%;
    overflow-x: auto;
}

.logview-table {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0;
    font-size: 1.05rem;
}

.logview-table th,
.logview-table td {
    padding: 0.85rem 1.1rem;
    border-bottom: 1px solid #e0e7ff;
    text-align: left;
    color: black;
}

.logview-table th {
    background: #f3f4f6;
    color: #7c3aed;
    font-weight: 700;
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
}

.logview-table tr:last-child td {
    border-bottom: none;
}

.logview-table tr:hover {
    background: #f5f3ff;
}

.status {
    padding: 0.3em 0.8em;
    border-radius: 8px;
    font-size: 0.98em;
    font-weight: 600;
    display: inline-block;
}

.status.success {
    background: #d1fae5;
    color: #059669;
}

.status.failed {
    background: #fee2e2;
    color: #dc2626;
}

.logview-filters {
    display: flex;
    gap: 1rem;
    margin-bottom: 1rem;
}

@media (max-width: 600px) {

    .logview-header,
    .logview-table-card,
    .logview-loading,
    .logview-error {
        padding: 1rem;
        max-width: 100vw;
    }

    .logview-header h1 {
        font-size: 1.3rem;
    }

    .logview-table th,
    .logview-table td {
        padding: 0.5rem 0.4rem;
        font-size: 0.95rem;
    }
}
</style>