<template>
  <Navbar />
  <main>
    <router-view />
    <ToastContainer />
  </main>
</template>

<script setup>
import Navbar from './components/Navbar.vue'
import ToastContainer from './components/ToastContainer.vue'
</script>

<style scoped>
.main-header {
  background: #1976d2;
  color: #fff;
  padding: 1.2rem 0;
  text-align: center;
  letter-spacing: 1px;
}

main {
  min-height: 80vh;
  width: 100%;
}
</style>
