import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'LANDING',
    component: () => import('../views/LandingPage.vue')
  },
  {
    path: '/:id/lobby',
    name: 'LOBBY',
    component: () => import('../views/LobbyPage.vue'),
    props: true
  },
  {
    path: '/:id/game',
    name: 'GAME',
    component: () => import('../views/GamePage.vue'),
    props: true
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router