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
    isLoggedIn: (state) => !!state.token,
  },

  actions: {
    // 🎯 Acción: Intenta iniciar sesión manual (RF-2) - SIN CAMBIOS
    async login(credentials) {
      this.loading = true
      this.error = null
      try {
        const response = await axios.post('/login', credentials)
        this.token = response.data.token
        this.user = response.data.user
        this.isAuthenticated = true

        localStorage.setItem('token', this.token)
        localStorage.setItem('user', JSON.stringify(this.user))
        axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`

        this.loading = false
        const redirectName = this.user.role_id === 2 ? 'TattooArtistDashboard' : 'ClientDashboard'
        router.push({ name: redirectName })
      } catch (err) {
        this.loading = false
        this.error = err.response?.data?.message || 'Credenciales incorrectas.'
        this.logout()
        throw err
      }
    },

    // 🎯 Acción: Cerrar sesión (RF-4) - SIN CAMBIOS
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

    // 🎯 Acción: Inicializar al cargar la app (MEJORADA PARA GOOGLE)
    async initialize() {
      if (this.token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`

        // Si tenemos token pero NO tenemos los datos del usuario (caso de Google)
        // los pedimos al servidor para que el router sepa el rol
        if (!this.user) {
          try {
            const response = await axios.get('http://localhost:8000/api/user')
            this.user = response.data
            localStorage.setItem('user', JSON.stringify(this.user))
            this.isAuthenticated = true
          } catch (e) {
            this.logout()
          }
        } else {
          this.isAuthenticated = true
        }
      } else {
        this.isAuthenticated = false
      }
    },
  },
})
