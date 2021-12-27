import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'lobby',
    component: () => import('../views/Lobby.vue')
  },
  {
    path: '/:id/',
    name: 'game',
    component: () => import('../views/Game.vue'),
    props: true
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router