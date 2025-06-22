<template>
    <div class="pagination-section" v-if="totalPages >= 1">
        <div class="pagination-container">
            <button class="pagination-btn" :disabled="currentPage === 1" @click="$emit('change', currentPage - 1)">
                <span class="pagination-icon">◀</span>
                Previous
            </button>
            <div class="page-numbers">
                <button v-for="page in totalPages" :key="page" class="page-btn"
                    :class="{ 'page-active': page === currentPage }" @click="$emit('change', page)">
                    {{ page }}
                </button>
            </div>
            <button class="pagination-btn" :disabled="currentPage === totalPages"
                @click="$emit('change', currentPage + 1)">
                Next
                <span class="pagination-icon">▶</span>
            </button>
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    currentPage: { type: Number, required: true },
    totalPages: { type: Number, required: true }
})
</script>

<style scoped>
.pagination-section {
    margin-top: 2rem;
}

.pagination-container {
    background: white;
    border-radius: 20px;
    padding: 1.5rem;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1rem;
}

.pagination-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1rem;
    border: 2px solid #e2e8f0;
    background: white;
    color: #4a5568;
    border-radius: 12px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
}

.pagination-btn:hover:not(:disabled) {
    border-color: #667eea;
    color: #667eea;
}

.pagination-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.page-numbers {
    display: flex;
    gap: 0.5rem;
}

.page-btn {
    padding: 0.75rem 1rem;
    border: 2px solid #e2e8f0;
    background: white;
    color: #4a5568;
    border-radius: 12px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    min-width: 45px;
}

.page-btn:hover {
    border-color: #667eea;
    color: #667eea;
}

.page-active {
    background: #667eea;
    color: white;
    border-color: #667eea;
}

@media (max-width: 768px) {
    .pagination-container {
        flex-direction: column;
        gap: 1rem;
    }

    .page-numbers {
        order: -1;
    }
}
</style>