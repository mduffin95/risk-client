import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'landing',
    component: () => import('../views/Landing.vue')
  },
  {
    path: '/',
    name: 'lobby',
    component: () => import('../views/Lobby.vue'),
    props: true
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