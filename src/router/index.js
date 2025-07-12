import { createRouter, createWebHistory } from 'vue-router'
import EditGamePage from '@/components/EditGamePage.vue'
import GamesPage from '@/components/Games/GamesPage.vue'

const routes = [
  { path: '/', name: 'main', component: GamesPage },
  { path: '/:id', name: 'edit', component: EditGamePage, params: true }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
