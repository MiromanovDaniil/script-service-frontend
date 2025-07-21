import { createRouter, createWebHistory } from 'vue-router'
import EditGamePage from '@/components/EditGamePage.vue'
import GamesPage from '@/components/Games/GamesPage.vue'
import LoginPage from '@/components/LoginPage.vue'
import RegisterPage from '@/components/RegisterPage.vue'
import UserProfilePage from '@/components/UserProfilePage.vue'
import StatisticsPage from '@/components/StatisticsPage.vue'

const routes = [
  { path: '/', name: 'main', component: GamesPage },
  { path: '/:id', name: 'edit', component: EditGamePage, params: true },
  { path: '/login', name: 'login', component: LoginPage },
  { path: '/register', name: 'register', component: RegisterPage },
  { path: '/profile', name: 'profile', component: UserProfilePage },
  { path: '/stats', name: 'stats', component: StatisticsPage },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  const isAuth = sessionStorage.getItem('user_id')

  if (!isAuth && to.path !== '/login' && to.path !== '/register') {
  }
  else if (isAuth && (to.path === '/login' || to.path === '/register')) {
    next('/')
  } else {
    next()
  }
})

export default router
