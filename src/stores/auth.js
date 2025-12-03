import { defineStore } from 'pinia'
import axios from 'axios'
import router from '../router'

// La URL base de tu API de Laravel (ajusta si es necesario)
// Si usas un archivo .env en tu frontend, asegúrate de que VITE_API_URL esté configurado
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

export const useAuthStore = defineStore('auth', {
  // Estado de la aplicación
  state: () => ({
    token: localStorage.getItem('auth_token') || null,
    user: JSON.parse(localStorage.getItem('user_data')) || null,
    isLoggedIn: !!localStorage.getItem('auth_token'),
  }),

  // Getters para acceder al estado
  getters: {
    // CU-15: Determinar el rol del usuario (Cliente: 1, Tatuador: 2)
    userRole: (state) => (state.user ? state.user.role_id : null),
    isClient: (state) => state.user?.role_id === 1,
    isTattooArtist: (state) => state.user?.role_id === 2,
  },

  // Acciones (funciones que modifican el estado)
  actions: {
    /**
     * RF-2: Proceso de inicio de sesión
     * @param {Object} credentials - Objeto con email y password
     */
    async login(credentials) {
      try {
        const response = await axios.post(`${API_URL}/login`, credentials)

        const token = response.data.token
        const user = response.data.user

        // 1. Actualizar estado local
        this.token = token
        this.user = user
        this.isLoggedIn = true

        // 2. Almacenar en localStorage para persistencia
        localStorage.setItem('auth_token', token)
        localStorage.setItem('user_data', JSON.stringify(user))

        // 3. Configurar el token para todas las peticiones futuras de Axios
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`

        // 4. Redirigir según el rol (Mockup 2)
        if (user.role_id === 2) {
          // Tatuador
          router.push({ name: 'TattooArtistDashboard' })
        } else {
          // Cliente
          router.push({ name: 'ClientDashboard' })
        }

        return true // Éxito
      } catch (error) {
        // En caso de credenciales incorrectas o error de red
        console.error('Error de login:', error.response?.data?.message || error.message)
        throw error
      }
    },

    /**
     * RF-4: Cerrar sesión
     */
    logout() {
      // 1. Limpiar estado
      this.token = null
      this.user = null
      this.isLoggedIn = false

      // 2. Limpiar almacenamiento
      localStorage.removeItem('auth_token')
      localStorage.removeItem('user_data')
      delete axios.defaults.headers.common['Authorization']

      // 3. Redirigir a Login
      router.push({ name: 'Login' })
    },

    /**
     * Inicializar Axios al cargar la aplicación si hay un token
     */
    initialize() {
      if (this.token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`
        this.isLoggedIn = true
      } else {
        this.isLoggedIn = false
      }
    },
  },
})
