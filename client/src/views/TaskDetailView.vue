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
              <input :value="task.end_date" type="text" readonly />
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
.task-form-wrapper {
  min-height: 100vh;
  padding: 2rem 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.task-form-container {
  background: white;
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  padding: 3rem;
  max-width: 600px;
  width: 100%;
  backdrop-filter: blur(10px);
}

.form-header {
  text-align: center;
  margin-bottom: 2.5rem;
}

h2 {
  font-size: 2.2rem;
  font-weight: 700;
  color: #2d3748;
  margin-bottom: 0.5rem;
  background: linear-gradient(135deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.form-subtitle {
  color: #718096;
  font-size: 1rem;
  margin: 0;
}

.form-body {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

@media (max-width: 768px) {
  .form-row {
    grid-template-columns: 1fr;
  }
}

label {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-weight: 600;
  color: #4a5568;
  font-size: 0.9rem;
}

.label-text {
  color: #2d3748;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  right: 1rem;
  font-size: 1.2rem;
  color: #a0aec0;
  pointer-events: none;
}

input,
textarea {
  width: 100%;
  padding: 1rem 3rem 1rem 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 1rem;
  background: #f7fafc;
  color: #2d3748;
  cursor: default;
}

input:read-only,
textarea:read-only {
  background: #f7fafc;
  color: #4a5568;
  border-color: #e2e8f0;
}

textarea {
  min-height: 120px;
  resize: none;
}

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

.btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.875rem 1.5rem;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
  text-decoration: none;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
}

.btn-secondary {
  background: #f7fafc;
  color: #4a5568;
  border: 2px solid #e2e8f0;
}

.btn-secondary:hover {
  background: #edf2f7;
  border-color: #cbd5e0;
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

.btn-icon {
  font-size: 1.1rem;
}

@media (max-width: 640px) {
  .task-form-container {
    padding: 2rem 1.5rem;
    margin: 1rem;
  }

  .form-actions {
    flex-direction: column;
  }

  .btn {
    justify-content: center;
  }
}
</style>