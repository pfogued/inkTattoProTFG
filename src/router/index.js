import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

// Vistas principales
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import ClientDashboard from '../views/ClientDashboard.vue' // Mockup 2: Cliente
import TattooArtistDashboard from '../views/TattooArtistDashboard.vue' // Mockup 2: Tatuador
import CalendarView from '../views/CalendarView.vue' // RF-5, RF-8
import DesignGallery from '../views/DesignGallery.vue' // RF-9, RF-10

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // Rutas públicas
    {
      path: '/',
      redirect: '/login',
    },
    {
      path: '/login',
      name: 'Login',
      component: Login,
    },
    {
      path: '/register',
      name: 'Register',
      component: Register,
      // Pendiente de implementar el componente Register.vue
    },
    {
      path: '/forgot-password',
      name: 'ForgotPassword',
      component: () => import('../views/ForgotPassword.vue'), // Carga diferida
      // Pendiente de implementar el componente ForgotPassword.vue
    },

    // Rutas protegidas (Requieren autenticación)
    {
      path: '/client/dashboard',
      name: 'ClientDashboard',
      component: ClientDashboard,
      meta: { requiresAuth: true, roles: [1] }, // Solo Clientes
    },
    {
      path: '/artist/dashboard',
      name: 'TattooArtistDashboard',
      component: TattooArtistDashboard,
      meta: { requiresAuth: true, roles: [2] }, // Solo Tatuadores
    },
    {
      path: '/calendar',
      name: 'Calendar',
      component: CalendarView,
      meta: { requiresAuth: true }, // Clientes y Tatuadores
    },
    {
      path: '/designs',
      name: 'DesignGallery',
      component: DesignGallery,
      meta: { requiresAuth: true }, // Clientes y Tatuadores
    },

    // Rutas de error
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () => import('../views/NotFound.vue'),
    },
  ],
})

// **Guardia Global de Autenticación (RF-2, RF-4)**
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  // 1. Inicializar el estado de autenticación al cargar la página
  if (!authStore.isLoggedIn) {
    authStore.initialize()
  }

  const isAuthenticated = authStore.isLoggedIn
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)
  const requiredRoles = to.meta.roles
  const userRole = authStore.userRole

  if (requiresAuth && !isAuthenticated) {
    // Si requiere auth y no está autenticado -> a Login
    next({ name: 'Login' })
  } else if (isAuthenticated && requiredRoles && !requiredRoles.includes(userRole)) {
    // Si está autenticado pero no tiene el rol correcto -> a su dashboard
    if (userRole === 2) {
      next({ name: 'TattooArtistDashboard' })
    } else {
      next({ name: 'ClientDashboard' })
    }
  } else if (isAuthenticated && (to.name === 'Login' || to.name === 'Register')) {
    // Si está autenticado y trata de ir a Login/Register -> a su Dashboard
    if (userRole === 2) {
      next({ name: 'TattooArtistDashboard' })
    } else {
      next({ name: 'ClientDashboard' })
    }
  } else {
    // En cualquier otro caso, continuar
    next()
  }
})

export default router
