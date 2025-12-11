import { defineStore } from 'pinia'
import axios from 'axios'
import router from '../router'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    // Inicializar el estado desde localStorage
    user: JSON.parse(localStorage.getItem('user')) || null,
    token: localStorage.getItem('token') || null,
    isAuthenticated: !!localStorage.getItem('token'),
    loading: false,
    error: null,
  }),

  getters: {
    isTattooArtist: (state) => state.user && state.user.role_id === 2,
    isClient: (state) => state.user && state.user.role_id === 1,
    // Getter para el guardia de navegación
    isLoggedIn: (state) => !!state.token,
  },

  actions: {
    // 🎯 Acción: Intenta iniciar sesión (RF-2)
    async login(credentials) {
      this.loading = true
      this.error = null
      try {
        // La petición POST es exitosa (Status 200)
        const response = await axios.post('/login', credentials)

        this.token = response.data.token
        this.user = response.data.user
        this.isAuthenticated = true

        // 1. Guardar en almacenamiento local (CRÍTICO)
        localStorage.setItem('token', this.token)
        localStorage.setItem('user', JSON.stringify(this.user))

        // 2. Configurar Axios para enviar el token
        axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`

        this.loading = false

        // 3. Redirigir al Dashboard basado en el rol (CRÍTICO)
        const redirectName = this.user.role_id === 2 ? 'TattooArtistDashboard' : 'ClientDashboard'
        router.push({ name: redirectName })
      } catch (err) {
        this.loading = false
        this.error = 'Credenciales incorrectas.'
        if (err.response && err.response.data.message) {
          this.error = err.response.data.message
        }
        // Limpiar token local si hubo error, por si acaso
        this.token = null
        this.user = null
        this.isAuthenticated = false
        localStorage.removeItem('token')
        localStorage.removeItem('user')

        throw err
      }
    },

    // 🎯 Acción: Cerrar sesión (RF-4)
    async logout() {
      try {
        await axios.post('/logout')
      } catch (e) {
        console.error('Logout failed on server, but clearing local state.', e)
      } finally {
        this.token = null
        this.user = null
        this.isAuthenticated = false
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        delete axios.defaults.headers.common['Authorization']
        router.push({ name: 'Login' })
      }
    },

    // 🎯 Acción: Inicializar al cargar la app
    initialize() {
      if (this.token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`
        this.isAuthenticated = true
      } else {
        this.isAuthenticated = false
      }
    },
  },
})
