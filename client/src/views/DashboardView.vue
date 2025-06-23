<template>
  <div class="dashboard-wrapper">
    <div class="dashboard-container">
      <header class="dashboard-header">
        <div class="header-content">
          <div class="header-left">
            <h1 class="dashboard-title">📋 Task Dashboard</h1>
          </div>
        </div>
      </header>

      <div class="filters-section">
        <div class="filters-container">
          <div class="filter-group">
            <button class="add-task-btn" @click="$router.push('/tasks/create')">
              <span class="btn-icon">➕</span>
              Add New Task
            </button>
          </div>

          <div class="filter-group">
            <div class="search-wrapper">
              <input v-model="filterOptions.searchQuery" placeholder="Search tasks..." class="search-input" />
              <span class="search-icon">🔍</span>
            </div>
          </div>

          <div class="filter-group">
            <Dropdown v-model="filterOptions.status" :options="statusOptions" placeholder="Select status" id="status"
              required />
          </div>

          <div class="filter-group">
            <Dropdown v-model="filterOptions.priority" :options="priorityOptions" placeholder="Select priority"
              id="priority" required />
          </div>

          <div class="filter-group">
            <input v-model="filterOptions.endDate" type="date" class="filter-input" />
          </div>

          <div class="filter-group">
            <label class="checkbox-wrapper">
              <input type="checkbox" v-model="filterOptions.hasAttachment" true-value="true" false-value=""
                class="checkbox-input" />
              <span class="checkbox-custom"></span>
              <span class="checkbox-label">Has Attachment</span>
            </label>
          </div>

          <div class="filter-group">
            <Dropdown v-model="orderBySelection" :options="orderByOptions" placeholder="Order By" id="orderby"
              required />
          </div>

          <div class="filter-group">
            <Dropdown v-model="filterOptions.limit" :options="limitOptions" placeholder="Size" id="size" required />
          </div>
        </div>
      </div>

      <div v-if="tasksStore.loading" class="loading-container">
        <div class="loading-spinner"></div>
        <p class="loading-text">Loading your tasks...</p>
      </div>

      <div v-if="tasksStore.error" class="error-container">
        <span class="error-icon">⚠️</span>
        <p class="error-text">{{ tasksStore.error }}</p>
      </div>

      <div class="tasks-section">
        <div v-if="!tasksStore.loading && tasksStore.tasks.length === 0" class="empty-state">
          <div class="empty-icon">📭</div>
          <h3 class="empty-title">No tasks found</h3>
          <p class="empty-description">Create your first task to get started!</p>
          <button class="empty-action-btn" @click="$router.push('/tasks/create')">
            <span class="btn-icon">➕</span>
            Create Task
          </button>
        </div>

        <div v-else class="tasks-grid">
          <TaskCard v-for="task in tasksStore.tasks" :key="task.id" :task="task"
            @view="() => $router.push(`/tasks/${task.id}`)" @edit="() => $router.push(`/tasks/${task.id}/edit`)"
            @delete="onDelete" @complete="onComplete" />
        </div>
      </div>

      <PaginationBar v-if="tasksStore.metaData.totalPages >= 0" :current-page="filterOptions.page"
        :total-pages="tasksStore.metaData.totalPages" @change="goToPage" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import { useTasksStore } from '../store/tasks'
import { useToast } from '../composables/useToast'
import TaskCard from '@/components/TaskCard.vue'
import PaginationBar from '@/components/PaginationBar.vue'
import Dropdown from '@/components/Dropdown.vue'
import { formatDateToInput } from '@/utils/dateUtils'
const tasksStore = useTasksStore()
const { success, error, warning } = useToast()

const statusOptions = [
  { value: '', label: 'All' },
  { value: 'completed', label: 'Completed' },
  { value: 'not_completed', label: 'Not Completed' }
]

const priorityOptions = [
  { value: '', label: 'All' },
  { value: 'high', label: 'High Priority' },
  { value: 'medium', label: 'Medium Priority' },
  { value: 'low', label: 'Low Priority' }
]

const orderByOptions = [
  { value: 'created_at-desc', label: 'Latest Tasks' },
  { value: 'created_at-asc', label: 'Created DESC' },
  { value: 'end_date-asc', label: 'End Date ASC' },
  { value: 'end_date-desc', label: 'End Date DESC' },
  { value: 'is_completed-desc', label: 'First Completed' },
  { value: 'is_completed-asc', label: 'Latest Completed' }
]

const limitOptions = [
  { value: 5, label: 'Default Size 5' },
  { value: 10, label: '10' },
  { value: 20, label: '20' },
  { value: 50, label: '50' }
]

const filterOptions = ref({
  searchQuery: '',
  status: '',
  priority: '',
  endDate: '',
  hasAttachment: '',
  orderBy: '',
  orderDir: 'desc',
  page: 1,
  limit: 5
})

const orderBySelection = computed({
  get() {
    return `${filterOptions.value.orderBy || 'created_at'}-${filterOptions.value.orderDir || 'desc'}`;
  },
  set(val) {
    const [orderBy, orderDir] = val.split('-');
    filterOptions.value.orderBy = orderBy;
    filterOptions.value.orderDir = orderDir;
  }
});

function fetchWithFilters() {
  const filtered = Object.fromEntries(
    Object.entries(filterOptions.value).filter(
      ([, v]) => v !== undefined && v !== null && v !== ''
    )
  )

  tasksStore.fetchTasks(filtered)
}

function goToPage(page) {
  if (page >= 1 && page <= tasksStore.metaData.totalPages) {
    filterOptions.value.page = page
  }
}

async function onDelete(id) {
  try {
    await tasksStore.deleteTask(id)
    success('Task deleted successfully!', 'Success', { duration: 3000 })
    fetchWithFilters()
  } catch (err) {
    error('Failed to delete task. Please try again.', 'Error', { duration: 5000 })
  }
}

async function onComplete(task) {
  try {

    task.is_completed = 1;
    await tasksStore.updateTask(task.id, task)
    success('Task marked as completed!', 'Success', { duration: 3000 })
    fetchWithFilters()
  } catch (err) {
    console.log(err)
    error('Failed to update task. Please try again.', 'Error', { duration: 5000 })
  }
}

onMounted(fetchWithFilters)

watch(filterOptions.value, () => {
  debouncedFetch()
})

//filtre degistikce surekli calismamasi icin delay fonksiyonu
function debounce(fn, delay = 300) {
  let timeout

  return function (...args) {
    clearTimeout(timeout)
    timeout = setTimeout(() => {
      fn.apply(this, args)
    }, delay)
  }
}

const debouncedFetch = debounce(fetchWithFilters, 1000)
</script>

<style scoped>
.dashboard-wrapper {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  width: 100%;
  padding: 2.5rem;
}

.dashboard-container {
  width: 100%;
}

.dashboard-header {
  margin-bottom: 2rem;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.header-left {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.dashboard-title {
  font-size: 2.5rem;
  font-weight: 800;
  color: #2d3748;
  margin: 0;
  background: linear-gradient(135deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.dashboard-subtitle {
  color: #718096;
  font-size: 1.1rem;
  margin: 0;
}

.filters-section {
  margin-bottom: 2rem;
}

.filters-container {
  background: white;
  border-radius: 20px;
  padding: 1.5rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  align-items: center;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.add-task-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 1.5rem;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.add-task-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
}

.search-wrapper {
  position: relative;
}

.search-input {
  width: 100%;
  padding: 0.75rem 2.5rem 0.75rem 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 1rem;
  background: #f7fafc;
  color: #2d3748;
  transition: all 0.3s ease;
}

.search-input:focus {
  outline: none;
  border-color: #667eea;
  background: white;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.search-icon {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #a0aec0;
  pointer-events: none;
}

.filter-select,
.filter-input {
  padding: 0.75rem 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 1rem;
  background: #f7fafc;
  transition: all 0.3s ease;
  color: #2d3748;
}

.filter-select:focus,
.filter-input:focus {
  outline: none;
  border-color: #667eea;
  background: white;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.checkbox-wrapper {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
}

.checkbox-input {
  display: none;
}

.checkbox-custom {
  width: 20px;
  height: 20px;
  border: 2px solid #e2e8f0;
  border-radius: 6px;
  position: relative;
  transition: all 0.3s ease;
}

.checkbox-input:checked+.checkbox-custom {
  background: #667eea;
  border-color: #667eea;
}

.checkbox-input:checked+.checkbox-custom::after {
  content: '✓';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-size: 12px;
  font-weight: bold;
}

.checkbox-label {
  color: #4a5568;
  font-weight: 500;
}

.loading-container,
.error-container {
  background: white;
  border-radius: 20px;
  padding: 3rem;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #e2e8f0;
  border-top: 4px solid #667eea;
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

.loading-text {
  color: #4a5568;
  font-size: 1.1rem;
  margin: 0;
}

.error-icon {
  font-size: 2rem;
  display: block;
  margin-bottom: 1rem;
}

.error-text {
  color: #e53e3e;
  font-size: 1.1rem;
  margin: 0;
}

.empty-state {
  background: white;
  border-radius: 20px;
  padding: 4rem 2rem;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.empty-icon {
  font-size: 4rem;
  display: block;
  margin-bottom: 1rem;
}

.empty-title {
  font-size: 1.5rem;
  color: #2d3748;
  margin: 0 0 0.5rem 0;
}

.empty-description {
  color: #718096;
  margin: 0 0 2rem 0;
}

.empty-action-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 2rem;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.empty-action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
}

.tasks-section {
  margin-bottom: 2rem;
}

.tasks-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
}

@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }

  .dashboard-title {
    font-size: 2rem;
  }

  .filters-container {
    grid-template-columns: 1fr;
  }

  .tasks-grid {
    grid-template-columns: 1fr;
  }

  .task-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .task-meta {
    flex-direction: column;
    align-items: flex-start;
  }

  .page-numbers {
    order: -1;
  }
}

@media (max-width: 480px) {
  .dashboard-wrapper {
    padding: 1rem 0.5rem;
  }

  .header-content,
  .filters-container,
  .task-card {
    padding: 1rem;
  }

  .task-actions {
    flex-direction: column;
  }

  .action-btn {
    justify-content: center;
  }
}
</style>