<template>
    <div class="task-form-wrapper">
        <div class="task-form-container">
            <div class="form-header">
                <h2>Create New Task</h2>
                <p class="form-subtitle">Fill in the details below to create your task</p>
            </div>

            <form @submit.prevent="onSubmit" class="form-body">
                <div class="form-group">
                    <label for="title">
                        <span class="label-text">Task Title</span>
                        <span class="required">*</span>
                    </label>
                    <div class="input-wrapper">
                        <input v-model="form.title" type="text" id="title" placeholder="Enter task title..." required />
                        <div class="input-icon">📝</div>
                    </div>
                </div>

                <div class="form-group">
                    <label for="description">
                        <span class="label-text">Description</span>
                        <span class="required">*</span>
                    </label>
                    <div class="input-wrapper">
                        <textarea v-model="form.description" id="description" placeholder="Describe your task..."
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
                            <Dropdown v-model="form.priority" :options="priorityOptions" placeholder="Select priority"
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
                            <input v-model="form.end_date" type="date" id="dueDate" required />
                            <div class="input-icon">📅</div>
                        </div>
                    </div>
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
                            <div class="upload-icon">📎</div>
                            <p class="upload-text">Click to upload or drag files here</p>
                            <p class="upload-hint">Supports: Images, Videos, PDF, Word, Excel</p>
                            <div v-if="form.attachment" class="selected-file">
                                Selected File: {{ form.attachment.name }}
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
                        Create Task
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useTasksStore } from '../store/tasks';
import { useToast } from '../composables/useToast';
import { formatDateToInput } from '@/utils/dateUtils';
import Dropdown from '@/components/Dropdown.vue'

const tasksStore = useTasksStore()
const { success, error } = useToast()
const router = useRouter()

const priorityOptions = [
    { value: 'high', label: 'High Priority' },
    { value: 'medium', label: 'Medium Priority' },
    { value: 'low', label: 'Low Priority' }
]

const form = ref({
    title: '',
    description: '',
    priority: '',
    end_date: new Date(),
    attachment: null
})

onMounted(() => {
    form.value.end_date = formatDateToInput(new Date())
})

function onFileChange(e) {
    const file = e.target.files[0];
    form.value.attachment = file;
}

async function onSubmit() {
    try {
        const successResult = await tasksStore.addTask(form.value);
        if (successResult) {
            success('Task created successfully!', 'Success', { duration: 3000 })
            router.push('/tasks')
        } else {
            error('Failed to create task. Please try again.', 'Error', { duration: 5000 })
        }
    } catch (err) {
        error('An unexpected error occurred while creating the task.', 'Error', { duration: 5000 })
    }
}
</script>

<style>
@import '@/assets/common-form.css';
</style>