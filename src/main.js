import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './index.css'

import App from './App.vue'
import router from './router'
import axios from 'axios'
import { useAuthStore } from './stores/auth'

// CONFIGURACIÓN CORREGIDA:
// Quitamos el /api del final para que no se duplique en las llamadas de los componentes
axios.defaults.baseURL = 'http://localhost:8000'
axios.defaults.withCredentials = true

const app = createApp(App)

app.use(createPinia())
app.use(router)

const authStore = useAuthStore()
authStore.initialize()

app.mount('#app')
