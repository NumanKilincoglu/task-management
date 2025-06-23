<template>
    <nav class="navbar">
        <div class="navbar-left">
            <router-link to="/tasks" class="navbar-logo">ShipEntegra</router-link>
        </div>
        <div class="navbar-right">
            <div class="user-info">
                <img :src="avatarUrl" alt="User Avatar" class="user-avatar" />
                <span class="user-name">{{ userName }}</span>
            </div>
            <button v-if="userStore?.user" class="logout-btn" @click="onLogout">
                <span class="btn-icon">🚪</span>
                Logout
            </button>
        </div>
    </nav>
</template>

<script setup>
import { computed } from 'vue'
import { useUserStore } from '../store/user'

const avatarUrl = `https://i.pravatar.cc/40?img=33`

const userStore = useUserStore()
const userName = computed(() => userStore.user?.email || 'Guest')

async function onLogout() {
    await userStore.logout()
}

</script>

<style scoped>
.navbar {
    width: 100%;
    background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.75rem 2rem;
    box-shadow: 0 2px 12px rgba(102, 126, 234, 0.08);
    position: sticky;
    top: 0;
    z-index: 100;
}

.navbar-logo {
    font-size: 1.5rem;
    font-weight: 700;
    color: #fff;
    text-decoration: none;
    letter-spacing: 1px;
}

.navbar-right {
    display: flex;
    align-items: center;
    gap: 1.5rem;
}

.user-info {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    background: rgba(255, 255, 255, 0.08);
    padding: 0.4rem 1rem 0.4rem 0.4rem;
    border-radius: 999px;
}

.user-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid #fff;
    box-shadow: 0 2px 8px rgba(102, 126, 234, 0.15);
}

.user-name {
    font-weight: 600;
    font-size: 1.05rem;
    color: #fff;
    letter-spacing: 0.5px;
}

.logout-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: #e53e3e;
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.logout-btn:hover {
  background: #c53030;
  transform: translateY(-2px);
}
</style>