// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
// src/router/index.js

// Usamos rutas relativas para evitar problemas con el alias @
import Login from '../views/Login.vue'
import Dashboard from '../views/ClientDashboard.vue'
import CalendarView from '../views/CalendarView.vue'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      // Redirigir la ruta raíz al login si no está autenticado
      redirect: '/login',
    },
    {
      path: '/login',
      name: 'login',
      component: Login, // CU-02: Iniciar sesión
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: Dashboard, // Mockup 2: Dashboard Cliente
      meta: { requiresAuth: true },
    },
    {
      path: '/reserve',
      name: 'reserve',
      component: CalendarView, // CU-03: Reservar cita
      meta: { requiresAuth: true },
    },
    // Añadir rutas para el chat, diseños, etc. después
  ],
})

// Ejemplo de navegación de seguridad: forzar login si no hay token
router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('auth_token') // Verifica el token guardado

  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login')
  } else {
    next()
  }
})

export default router
