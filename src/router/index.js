import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'LANDING',
    component: () => import('../views/Landing.vue')
  },
  {
    path: '/',
    name: 'LOBBY',
    component: () => import('../views/Lobby.vue'),
    props: true
  },
  {
    path: '/:id/',
    name: 'GAME',
    component: () => import('../views/Game.vue'),
    props: true
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router