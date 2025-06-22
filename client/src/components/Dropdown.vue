<template>
  <select
    :id="id"
    :required="required"
    :value="modelValue"
    @input="$emit('update:modelValue', $event.target.value)"
    class="dropdown-select"
  >
    <option value="" disabled>{{ placeholder }}</option>
    <option v-for="opt in options" :key="opt.value" :value="opt.value">
      {{ opt.label }}
    </option>
  </select>
</template>

<script setup>
const props = defineProps({
  modelValue: [String, Number],
  options: { type: Array, required: true },
  placeholder: { type: String, default: 'Select...' },
  id: { type: String, default: '' },
  required: { type: Boolean, default: false }
})
</script>

<style scoped>
.dropdown-select {
  width: 100%;
  padding: 1rem 3rem 1rem 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 1rem;
  background: #f7fafc;
  color: #2d3748;
  transition: all 0.3s ease;
}
.dropdown-select:focus {
  outline: none;
  border-color: #667eea;
  background: white;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

</style> 