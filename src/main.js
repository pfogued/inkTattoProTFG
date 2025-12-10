import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './index.css'

import App from './App.vue'
import router from './router'
import axios from 'axios' // <-- 1. AÑADE ESTA LÍNEA

// 🎯 Configuración CRÍTICA de Axios para el Back-end (Resuelve el 405)
axios.defaults.baseURL = 'http://localhost:8000/api' // <-- 2. AÑADE ESTA LÍNEA
axios.defaults.withCredentials = true // <-- 3. AÑADE ESTA LÍNEA

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
