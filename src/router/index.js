import { createRouter, createWebHistory } from 'vue-router'
import EditGamePage from '@/components/EditGamePage.vue'
import GamesPage from '@/components/Games/GamesPage.vue'
import LoginPage from '@/components/LoginPage.vue'
import RegisterPage from '@/components/RegisterPage.vue'

const routes = [
  { path: '/', name: 'main', component: GamesPage },
  { path: '/:id', name: 'edit', component: EditGamePage, params: true },
  { path: '/login', name: 'login', component: LoginPage },
  { path: '/register', name: 'register', component: RegisterPage }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
