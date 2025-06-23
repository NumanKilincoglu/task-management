<template>
    <div class="pagination-section" v-if="totalPages >= 1">
        <div class="pagination-container">
            <button class="pagination-btn" :disabled="currentPage === 1" @click="$emit('change', currentPage - 1)">
                <span class="pagination-icon">◀</span>
                Previous
            </button>
            <div class="page-numbers">
                <button v-if="pages[0] > 1" class="page-btn" @click="$emit('change', 1)">1</button>
                <span v-if="pages[0] > 2" class="ellipsis">...</span>
                <button v-for="page in pages" :key="page" class="page-btn"
                    :class="{ 'page-active': page === currentPage }" @click="$emit('change', page)">
                    {{ page }}
                </button>
                <span v-if="pages[pages.length - 1] < totalPages - 1" class="ellipsis">...</span>
                <button v-if="pages[pages.length - 1] < totalPages" class="page-btn"
                    @click="$emit('change', totalPages)">{{ totalPages }}</button>
            </div>
            <button class="pagination-btn" :disabled="currentPage === totalPages"
                @click="$emit('change', currentPage + 1)">
                Next
                <span class="pagination-icon">▶</span>
            </button>
        </div>
        <div class="pagination-info">
            Page {{ currentPage }} of {{ totalPages }}<span v-if="totalCount !== undefined"> • {{ totalCount }}
                results</span>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue'
const props = defineProps({
    currentPage: { type: Number, required: true },
    totalPages: { type: Number, required: true },
    totalCount: { type: Number, required: false }
})

const maxVisible = 6

//sadece 6 adet sayi gorunecek pagination barda
const pages = computed(() => {
    const pages = []
    if (props.totalPages <= maxVisible) {
        for (let i = 1; i <= props.totalPages; i++) pages.push(i)
    } else {
        let start = Math.max(1, props.currentPage - Math.floor(maxVisible / 2))
        let end = start + maxVisible - 1
        if (end > props.totalPages) {
            end = props.totalPages
            start = end - maxVisible + 1
        }
        for (let i = start; i <= end; i++) pages.push(i)
    }
    return pages
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

.pagination-info {
    margin-top: 0.5rem;
    text-align: center;
    color: #4a5568;
    font-size: 1rem;
    font-weight: 500;
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
    align-items: center;
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

.ellipsis {
    padding: 0 0.5rem;
    color: #a0aec0;
    font-size: 1.2rem;
    user-select: none;
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