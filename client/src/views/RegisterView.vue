<template>
  <div class="auth-bg">
    <div class="auth-card">
      <h2 class="auth-title">Register</h2>
      <p class="auth-subtitle">Create your account to get started.</p>
      <form @submit.prevent="onRegister" class="auth-form">
        <div class="auth-form-group">
          <label for="name">Name</label>
          <div class="auth-input-wrapper">
            <span class="auth-input-icon">👤</span>
            <input v-model="userCredentials.name" type="text" id="name" class="auth-input" placeholder="Enter your name" required />
          </div>
        </div>
        <div class="auth-form-group">
          <label for="email">Email</label>
          <div class="auth-input-wrapper">
            <span class="auth-input-icon">✉️</span>
            <input v-model="userCredentials.email" type="email" id="email" class="auth-input" placeholder="Enter your email" required />
          </div>
        </div>
        <div class="auth-form-group">
          <label for="phone">Phone</label>
          <div class="auth-input-wrapper">
            <span class="auth-input-icon">📱</span>
            <input v-model="userCredentials.phone" type="tel" id="phone" class="auth-input" placeholder="Enter your phone" required />
          </div>
        </div>
        <div class="auth-form-group">
          <label for="password">Password</label>
          <div class="auth-input-wrapper">
            <span class="auth-input-icon">🔒</span>
            <input v-model="userCredentials.password" type="password" id="password" class="auth-input" placeholder="Create a password" required />
          </div>
        </div>
        <div class="auth-form-group">
          <label for="confirmPassword">Confirm Password</label>
          <div class="auth-input-wrapper">
            <span class="auth-input-icon">🔒</span>
            <input v-model="userCredentials.confirmPassword" type="password" id="confirmPassword" class="auth-input" placeholder="Confirm your password" required />
          </div>
        </div>
        <button type="submit" class="auth-btn">Register</button>
        <p v-if="userCredentials.password && userCredentials.confirmPassword && userCredentials.password !== userCredentials.confirmPassword" class="auth-warning">
          Passwords do not match.
        </p>
        <p class="auth-switch-link">
          Already have an account? <router-link to="/login">Sign In</router-link>
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

const userCredentials = ref({ name: '', email: '', phone: '', password: '', confirmPassword: '' })
const userStore = useUserStore()
const router = useRouter()
const { success, error, warning } = useToast()

async function onRegister() {
  if (userCredentials.value.password !== userCredentials.value.confirmPassword) {
    warning('Passwords do not match. Please try again.', 'Warning', { duration: 5000 })
    return
  }

  try {
    const successResult = await userStore.register(
      userCredentials.value.name,
      userCredentials.value.email,
      userCredentials.value.phone,
      userCredentials.value.password
    )
    if (successResult) {
      success('Registration successful! Please sign in with your new account.', 'Success', { duration: 4000 })
      router.push('/login')
    } else {
      error('Registration failed. Please try again.', 'Error', { duration: 5000 })
    }
  } catch (err) {
    error('An unexpected error occurred during registration.', 'Error', { duration: 5000 })
  }
}
</script>

<style>
@import '@/assets/auth-form.css';
</style>