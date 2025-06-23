<template>
    <div class="task-card" :class="{ 'task-completed': task.is_completed }">
        <div class="task-header">
            <h3 class="task-title">{{ task.title }}</h3>
            <div class="task-status" :class="task.is_completed ? 'status-completed' : 'status-pending'">
                <span class="status-icon">{{ task.is_completed ? '✅' : '⏳' }}</span>
                <span class="status-text">{{ task.is_completed ? 'Completed' : 'Pending' }}</span>
            </div>
        </div>
        <div class="task-meta">
            <div class="task-priority" :class="`priority-${task.priority}`">
                <span class="priority-icon">
                    {{ getPriorityIcon(task.priority) }}
                </span>
                <span class="priority-text">{{ getPriorityLabel(task.priority) }}</span>
            </div>
            <div class="task-due-date">
                <span class="due-icon">📅</span>
                <span class="due-text">{{ formatDateToInput(task?.end_date) }}</span>
            </div>
        </div>
        <div class="task-actions">
            <button class="action-btn btn-details" @click="$emit('view')">
                <span class="action-icon">👁️</span>
                <span class="action-text">View</span>
            </button>
            <button class="action-btn btn-edit" @click="$emit('edit')">
                <span class="action-icon">✏️</span>
                <span class="action-text">Edit</span>
            </button>
            <button class="action-btn btn-delete" @click="$emit('delete', task.id)">
                <span class="action-icon">🗑️</span>
                <span class="action-text">Delete</span>
            </button>
            <button v-if="!task.is_completed" class="action-btn btn-complete" @click="$emit('complete', task)">
                <span class="action-icon">✅</span>
                <span class="action-text">Complete</span>
            </button>
        </div>
    </div>
</template>

<script setup>
import { formatDateToInput } from "../utils/dateUtils";

const props = defineProps({
    task: { type: Object, required: true }
})

function getPriorityIcon(priority) {
    const icons = {
        high: '🔥',
        medium: '⚡',
        low: '🌱'
    }
    return icons[priority] || '📌'
}

function getPriorityLabel(priority) {
    if (!priority) return;
    return priority.charAt(0).toUpperCase() + priority.slice(1)
}
</script>

<style scoped>
.task-card {
    background: white;
    border-radius: 20px;
    padding: 1.5rem;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
    border: 2px solid transparent;
}

.task-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
    border-color: #667eea;
}

.task-completed {
    opacity: 1;
    background: #e2e8f0;
    color: #a0aec0;
    border: 2px solid #cbd5e1;
}

.task-completed .task-title {
    text-decoration: line-through;
    color: #a0aec0;
}

.task-completed .task-status.status-completed {
    background: #f1f5f9;
    color: #a0aec0;
}

.task-completed .task-meta,
.task-completed .task-priority,
.task-completed .task-due-date,
.task-completed .action-btn {
    color: #a0aec0;
}

.task-completed .action-btn {
    background: #f1f5f9;
}

.task-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 1rem;
    gap: 1rem;
}

.task-title {
    font-size: 1.25rem;
    font-weight: 700;
    color: #2d3748;
    margin: 0;
    line-height: 1.3;
}

.task-status {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    padding: 0.25rem 0.75rem;
    border-radius: 20px;
    font-size: 0.875rem;
    font-weight: 600;
    white-space: nowrap;
}

.status-completed {
    background: #c6f6d5;
    color: #22543d;
}

.status-pending {
    background: #fed7d7;
    color: #742a2a;
}

.task-meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
    gap: 1rem;
}

.task-priority {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    padding: 0.25rem 0.75rem;
    border-radius: 20px;
    font-size: 0.875rem;
    font-weight: 600;
}

.priority-high {
    background: #fed7d7;
    color: #742a2a;
}

.priority-medium {
    background: #fef5e7;
    color: #744210;
}

.priority-low {
    background: #c6f6d5;
    color: #22543d;
}

.task-due-date {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    color: #718096;
    font-size: 0.875rem;
}

.task-actions {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
}

.action-btn {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    padding: 0.5rem 0.75rem;
    border: none;
    border-radius: 8px;
    font-size: 0.875rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    background: #f7fafc;
    color: #4a5568;
}

.btn-details:hover {
    background: #667eea;
    color: white;
}

.btn-edit:hover {
    background: #f6ad55;
    color: white;
}

.btn-delete:hover {
    background: #e53e3e;
    color: white;
}

.btn-complete:hover {
    background: #38a169;
    color: white;
}
</style>