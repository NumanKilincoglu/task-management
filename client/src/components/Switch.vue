<template>
  <label class="switch">
    <input
      type="checkbox"
      :checked="modelValue == trueValue"
      @change="$emit('update:modelValue', $event.target.checked ? trueValue : falseValue)"
    />
    <span class="slider"></span>
    <span class="switch-label"><slot /></span>
  </label>
</template>

<script setup>
const props = defineProps({
  modelValue: { type: [Boolean, Number], required: true },
  trueValue: { type: [Boolean, Number], default: 1 },
  falseValue: { type: [Boolean, Number], default: 0 }
})
</script>

<style scoped>
.switch {
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  gap: 0.5rem;
}
.switch input {
  display: none;
}
.slider {
  width: 40px;
  height: 22px;
  background: #e2e8f0;
  border-radius: 999px;
  position: relative;
  transition: background 0.3s;
  box-sizing: border-box;
}
.switch input:checked + .slider {
  background: linear-gradient(135deg, #667eea, #764ba2);
}
.slider::before {
  content: '';
  position: absolute;
  left: 3px;
  top: 3px;
  width: 16px;
  height: 16px;
  background: #fff;
  border-radius: 50%;
  transition: transform 0.3s;
  box-shadow: 0 2px 8px rgba(102,126,234,0.15);
}
.switch input:checked + .slider::before {
  transform: translateX(18px);
}
.switch-label {
  font-size: 1rem;
  color: #4a5568;
  user-select: none;
}
</style> 