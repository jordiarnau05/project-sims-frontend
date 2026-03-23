import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import Vue3Toastify from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'

const app = createApp(App)
const pinia = createPinia()

const isMobile = typeof window !== 'undefined' && window.innerWidth < 768

app
  .use(pinia)
  .use(router)
  .use(Vue3Toastify, {
    autoClose: 2800,
    newestOnTop: true,
    closeOnClick: true,
    pauseOnHover: true,
    pauseOnFocusLoss: true,
    draggable: true,
    hideProgressBar: false,
    limit: 3,
    position: isMobile ? 'top-right' : 'bottom-right',
    theme: 'dark',
  })
  .mount('#app')
