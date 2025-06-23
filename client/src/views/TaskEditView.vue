<template>
    <div class="task-form-wrapper">
        <div class="task-form-container">
            <div class="form-header">
                <h2>Edit Task</h2>
                <p class="form-subtitle">Fill in the details below to update your task</p>
            </div>

            <form @submit.prevent="onSubmit" class="form-body">
                <div class="form-group">
                    <label for="title">
                        <span class="label-text">Task Title</span>
                        <span class="required">*</span>
                    </label>
                    <div class="input-wrapper">
                        <input v-model="task.title" type="text" id="title" placeholder="Enter task title..." required />
                        <div class="input-icon">📝</div>
                    </div>
                </div>

                <div class="form-group">
                    <label for="description">
                        <span class="label-text">Description</span>
                        <span class="required">*</span>
                    </label>
                    <div class="input-wrapper">
                        <textarea v-model="task.description" id="description" placeholder="Describe your task..."
                            required></textarea>
                        <div class="input-icon">📄</div>
                    </div>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label for="priority">
                            <span class="label-text">Priority Level</span>
                            <span class="required">*</span>
                        </label>
                        <div class="input-wrapper">
                            <Dropdown v-model="task.priority" :options="priorityOptions" placeholder="Select priority"
                                id="priority" required />
                            <div class="input-icon">🎯</div>
                        </div>
                    </div>

                    <div class="form-group">
                        <label for="dueDate">
                            <span class="label-text">Due Date</span>
                            <span class="required">*</span>
                        </label>
                        <div class="input-wrapper">
                            <input v-model="dateModel" type="date" id="dueDate" required />
                            <div class="input-icon">📅</div>
                        </div>
                    </div>
                </div>

                <div class="form-group">
                    <Switch v-model="task.is_completed" :true-value="1" :false-value="0">Completed</Switch>
                </div>

                <div class="form-group">
                    <label for="media">
                        <span class="label-text">Attachments</span>
                        <span class="optional">(optional)</span>
                    </label>
                    <div class="file-upload-wrapper">
                        <input @change="onFileChange" type="file" id="media"
                            accept="image/*,video/*,.pdf,.doc,.docx,.xls,.xlsx" class="file-input" />
                        <div class="file-upload-area">
                            <div v-if="task.file_name" class="existing-file">
                                <div class="file-icon">📎</div>
                                <div class="file-info">
                                    <p class="file-name">
                                        {{ task.attachment ? task.attachment.name : (task.file_name || 'Current Attachment') }}
                                    </p>
                                    <p class="file-hint">
                                        {{ task.attachment ? 'New file selected' : 'Click to change file' }}
                                    </p>
                                </div>
                            </div>
                            <div v-else class="upload-placeholder">
                                <div class="upload-icon">📎</div>
                                <p class="upload-text">Click to upload or drag files here</p>
                                <p class="upload-hint">Supports: Images, Videos, PDF, Word, Excel</p>
                                <div v-if="task.attachment" class="selected-file">
                                    Selected File: {{ task.attachment.name }}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="form-actions">
                    <button type="button" @click="$router.push('/tasks')" class="btn btn-secondary">
                        <span class="btn-icon">✕</span>
                        Cancel
                    </button>
                    <button type="submit" class="btn btn-primary">
                        <span class="btn-icon">💾</span>
                        Update Task
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup>
import { onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTasksStore } from '../store/tasks';
import { useToast } from '../composables/useToast';
import { storeToRefs } from 'pinia'
import Dropdown from '@/components/Dropdown.vue'
import Switch from '@/components/Switch.vue'

const tasksStore = useTasksStore()
const { task } = storeToRefs(tasksStore)
const { success, error } = useToast()
const route = useRoute()
const router = useRouter()

const priorityOptions = [
    { value: 'high', label: 'High Priority' },
    { value: 'medium', label: 'Medium Priority' },
    { value: 'low', label: 'Low Priority' }
]

function getTask() {
    tasksStore.getTask(route.params.id)
}

function onFileChange(e) {
    task.value.attachment = e.target.files[0]
}

function getDateOnly(dateStr) {
    if (!dateStr) return '';
    return dateStr.split('T')[0];
}

const dateModel = computed({
    get: () => getDateOnly(task.value.end_date),
    set: val => { task.value.end_date = val }
});

async function onSubmit() {
    try {

        const payload = {
            title: task.value.title,
            description: task.value.description,
            priority: task.value.priority,
            end_date: task.value.end_date,
            is_completed: task.value.is_completed,
            ...(task.value.attachment && { attachment: task.value.attachment })
        };

        const successResult = await tasksStore.updateTask(route.params.id, payload);
        if (successResult) {
            success('Task updated successfully!', 'Success', { duration: 3000 })
            router.push('/tasks')
        } else {
            
            error('Failed to update task. Please try again.', 'Error', { duration: 5000 })
        }
    } catch (err) {
        console.log(err)
        error('An unexpected error occurred while updating the task.', 'Error', { duration: 5000 })
    }
}

onMounted(() => {
    getTask();
});
</script>

<style>
@import '@/assets/common-form.css';
</style>