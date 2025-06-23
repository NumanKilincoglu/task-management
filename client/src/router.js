import { createRouter, createWebHistory } from 'vue-router'

import LoginView from './views/LoginView.vue'
import RegisterView from './views/RegisterView.vue'
import DashboardView from './views/DashboardView.vue'
import TaskDetailView from './views/TaskDetailView.vue'
import TaskCreateView from './views/TaskCreateView.vue'
import TaskEditView from './views/TaskEditView.vue'

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: LoginView },
  { path: '/register', component: RegisterView },
  { path: '/tasks', component: DashboardView },
  { path: '/tasks/create', component: TaskCreateView },
  { path: '/tasks/:id', component: TaskDetailView },
  { path: '/tasks/:id/edit', component: TaskEditView },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router 