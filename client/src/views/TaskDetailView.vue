<template>
  <div class="task-form-wrapper">
    <div class="task-form-container">
      <div class="form-header">
        <h2>Task Details</h2>
        <p class="form-subtitle">View the complete information for this task</p>
      </div>

      <div v-if="task" class="form-body">
        <div class="form-group">
          <label>
            <span class="label-text">Task Title</span>
          </label>
          <div class="input-wrapper">
            <input :value="task.title" type="text" readonly />
            <div class="input-icon">📝</div>
          </div>
        </div>

        <div class="form-group">
          <label>
            <span class="label-text">Description</span>
          </label>
          <div class="input-wrapper">
            <textarea :value="task.description" readonly></textarea>
            <div class="input-icon">📄</div>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>
              <span class="label-text">Priority Level</span>
            </label>
            <div class="input-wrapper">
              <input :value="task.priority" type="text" readonly />
              <div class="input-icon">🎯</div>
            </div>
          </div>

          <div class="form-group">
            <label>
              <span class="label-text">Due Date</span>
            </label>
            <div class="input-wrapper">
              <input :value="formatDateToInput(task.end_date ?? new Date)" type="text" readonly />
              <div class="input-icon">📅</div>
            </div>
          </div>
        </div>

        <div class="form-group">
          <label>
            <span class="label-text">Status</span>
          </label>
          <div class="input-wrapper">
            <input :value="task.is_completed ? 'Completed' : 'Pending'" type="text" readonly />
            <div class="input-icon">{{ task.is_completed ? '✅' : '⏳' }}</div>
          </div>
        </div>

        <div v-if="task.attachment_url" class="form-group">
          <label>
            <span class="label-text">Attachments</span>
          </label>
          <div class="media-display">
            <div v-if="isImage(task.attachment_url)" class="media-item">
              <img :src="task.attachment_url" alt="Task Image" class="media-preview" />
            </div>
            <div v-else-if="isVideo(task.attachment_url)" class="media-item">
              <video :src="task.attachment_url" controls class="media-preview"></video>
            </div>
            <div v-else class="media-item">
              <a target="_blank" :href="task.attachment_url" :download="task.file_name || 'attachment'" class="file-download">
                <div class="file-icon">📎</div>
                <div class="file-info">
                  <span class="file-name">{{ task.file_name || 'Download Attachment' }}</span>
                  <span class="file-hint">Click to download</span>
                </div>
              </a>
            </div>
          </div>
        </div>

        <div class="form-actions">
          <button @click="$router.push('/tasks')" class="btn btn-secondary">
            <span class="btn-icon">←</span>
            Back to Tasks
          </button>
          <button @click="$router.push(`/tasks/${task.id}/edit`)" class="btn btn-primary">
            <span class="btn-icon">✏️</span>
            Edit Task
          </button>
          <button @click="onDelete" class="btn btn-danger">
            <span class="btn-icon">🗑️</span>
            Delete Task
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTasksStore } from '../store/tasks'
import { storeToRefs } from 'pinia'
import { useToast } from '../composables/useToast'
import {formatDateToInput} from "../utils/dateUtils";

const route = useRoute()
const router = useRouter()
const tasksStore = useTasksStore()
const { task } = storeToRefs(tasksStore)
const { success, error } = useToast()

function getTask() {
  tasksStore.getTask(route.params.id)
}

function isImage(url) {
  if (!url) return false
  return url.match(/\.(jpeg|jpg|png|gif|webp)$/i)
}

function isVideo(url) {
  if (!url) return false
  return url.match(/\.(mp4|webm|ogg|avi|mov)$/i)
}

async function onDelete() {
  try {
    const successResult = await tasksStore.deleteTask(route.params.id)
    if (successResult) {
      success('Task deleted successfully!', 'Success', { duration: 3000 })
      router.push('/tasks')
    } else {
      error('Failed to delete task. Please try again.', 'Error', { duration: 5000 })
    }
  } catch (err) {
    error('An unexpected error occurred while deleting the task.', 'Error', { duration: 5000 })
  }
}

onMounted(getTask)
</script>

<style scoped>
@import '@/assets/common-form.css';


.media-display {
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  padding: 1rem;
  background: #f7fafc;
}

.media-item {
  display: flex;
  align-items: center;
  justify-content: center;
}

.media-preview {
  max-width: 100%;
  max-height: 300px;
  border-radius: 8px;
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.07);
}

.file-download {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  background: white;
  border: 2px dashed #cbd5e0;
  border-radius: 12px;
  text-decoration: none;
  color: #4a5568;
  transition: all 0.3s ease;
  width: 100%;
}

.file-download:hover {
  border-color: #667eea;
  background: #edf2f7;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.file-icon {
  font-size: 2rem;
  color: #667eea;
}

.file-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.file-name {
  font-weight: 600;
  color: #2d3748;
  font-size: 1rem;
}

.file-hint {
  font-size: 0.8rem;
  color: #718096;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid #e2e8f0;
}

.btn-danger {
  background: linear-gradient(135deg, #e53e3e, #c53030);
  color: white;
  box-shadow: 0 4px 15px rgba(229, 62, 62, 0.3);
}

.btn-danger:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(229, 62, 62, 0.4);
}

</style>