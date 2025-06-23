<template>
  <div class="auth-bg">
    <div class="auth-card">
      <h2 class="auth-title">Sign In</h2>
      <p class="auth-subtitle">Welcome back! Please enter your credentials.</p>
      <form @submit.prevent="onLogin" class="auth-form">
        <div class="auth-form-group">
          <label for="email">Email</label>
          <div class="auth-input-wrapper">
            <input v-model="email" type="email" id="email" class="auth-input" placeholder="Enter your email" required />
          </div>
        </div>
        <div class="auth-form-group">
          <label for="password">Password</label>
          <div class="auth-input-wrapper">
            <input v-model="password" autocomplete="password" type="password" id="password" class="auth-input"
              placeholder="Enter your password" required />
          </div>
        </div>
        <button type="submit" class="auth-btn" :disabled="userStore.loading">
          {{ userStore.loading ? 'Signing in...' : 'Sign In' }}
        </button>
        <p v-if="userStore.error" class="auth-error">{{ userStore.error }}</p>
        <p class="auth-switch-link">
          Don't have an account? <router-link to="/register">Sign Up</router-link>
        </p>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../store/user'
import { useToast } from '../composables/useToast'

const email = ref('')
const password = ref('')
const router = useRouter()
const userStore = useUserStore()
const { success, error } = useToast()

async function onLogin() {
  try {
    const successResult = await userStore.login(email.value, password.value)
    if (successResult) {
      success('Login successful! Welcome back.', 'Success', { duration: 3000 })
      router.push('/tasks')
    } else {
      error('Login failed. Please check your credentials.', 'Error', { duration: 5000 })
    }
  } catch (err) {
    error('An unexpected error occurred during login.', 'Error', { duration: 5000 })
  }
}
</script>

<style>
@import '@/assets/auth-form.css';
</style>