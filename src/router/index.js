import { createRouter, createWebHistory } from 'vue-router'
import EditGamePage from '@/components/EditGamePage.vue'
import GamesPage from '@/components/Games/GamesPage.vue'
import LoginPage from '@/components/LoginPage.vue'
import RegisterPage from '@/components/RegisterPage.vue'
import UserProfilePage from '@/components/UserProfilePage.vue'
import SearchPage from '@/components/SearchPage.vue'

const routes = [
  { path: '/', name: 'main', component: GamesPage },
  { path: '/:id', name: 'edit', component: EditGamePage, params: true },
  { path: '/login', name: 'login', component: LoginPage },
  { path: '/register', name: 'register', component: RegisterPage },
  { path: '/profile', name: 'profile', component: UserProfilePage },
  { path: '/search', name: 'search', component: SearchPage },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
