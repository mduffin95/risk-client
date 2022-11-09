import { createApp } from 'vue'
import { createPinia } from 'pinia'
import Oruga from '@oruga-ui/oruga-next'
import '@oruga-ui/oruga-next/dist/oruga.css'
import App from './App.vue'
import router from './router'

const pinia = createPinia()
createApp(App)
  .use(pinia)
  .use(Oruga)
  .use(router)
  .mount('#app')
