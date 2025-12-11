// src/main.js (Asegúrate de que esta es la versión correcta que funciona)

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './index.css'

import App from './App.vue'
import router from './router'
import axios from 'axios'
import { useAuthStore } from './stores/auth' // <-- Importación necesaria

// Configuración CRÍTICA de Axios para el Back-end (Resuelve el 405)
axios.defaults.baseURL = 'http://localhost:8000/api'
axios.defaults.withCredentials = true

const app = createApp(App)

app.use(createPinia())
app.use(router)

// 🎯 Inicializar Auth Store
const authStore = useAuthStore()
authStore.initialize()

app.mount('#app')
