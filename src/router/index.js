import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import MainLayout from '../layouts/MainLayout.vue'

// Importaciones de Vistas
import LandingView from '../views/LandingView.vue'
import ArtistasView from '../views/ArtistasView.vue' // <-- AÑADIDA ESTA LÍNEA
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import ClientDashboard from '../views/ClientDashboard.vue'
import TattooArtistDashboard from '../views/TattooArtistDashboard.vue'
import CalendarView from '../views/CalendarView.vue'
import DesignGallery from '../views/DesignGallery.vue'
import ChatView from '../views/ChatView.vue'
import AppointmentManagement from '../views/AppointmentManagement.vue'
import PaymentHistory from '../views/PaymentHistory.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // ----------------------------------------------------
    // 1. RUTAS PÚBLICAS
    // ----------------------------------------------------
    {
      path: '/',
      name: 'home',
      component: LandingView,
    },
    {
      path: '/artistas', // <-- RUTA AÑADIDA PARA QUE FUNCIONE EL BOTÓN
      name: 'Artistas',
      component: ArtistasView,
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
    },
    {
      path: '/forgot-password',
      name: 'ForgotPassword',
      component: () => import('../views/ForgotPassword.vue'),
    },

    // ----------------------------------------------------
    // 2. RUTAS PROTEGIDAS
    // ----------------------------------------------------
    {
      path: '/app',
      component: MainLayout,
      meta: { requiresAuth: true },
      children: [
        {
          path: 'client/dashboard',
          name: 'ClientDashboard',
          component: ClientDashboard,
          meta: { roles: [1] },
        },
        {
          path: 'artist/dashboard',
          name: 'TattooArtistDashboard',
          component: TattooArtistDashboard,
          meta: { roles: [2] },
        },
        {
          path: 'appointments',
          name: 'AppointmentManagement',
          component: AppointmentManagement,
          meta: { roles: [1, 2] },
        },
        {
          path: 'calendar',
          name: 'Calendar',
          component: CalendarView,
          meta: { roles: [1, 2] },
        },
        {
          path: 'chat',
          name: 'ChatView',
          component: ChatView,
          meta: { roles: [1, 2] },
        },
        {
          path: 'designs',
          name: 'DesignGallery',
          component: DesignGallery,
          meta: { roles: [1, 2] },
        },
        {
          path: 'payments',
          name: 'PaymentHistory',
          component: PaymentHistory,
          meta: { roles: [1, 2] },
        },
      ],
    },

    // ----------------------------------------------------
    // 3. RUTA 404
    // ----------------------------------------------------
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () => import('../views/NotFound.vue'),
    },
  ],
})

// Guardia Global de Autenticación (Mantengo tu lógica intacta)
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  if (!authStore.isAuthenticated) {
    authStore.initialize()
  }

  const isAuthenticated = authStore.isAuthenticated
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)
  const requiredRoles = to.meta.roles
  const userRole = authStore.user?.role_id

  if (requiresAuth && !isAuthenticated) {
    next({ name: 'Login' })
  } else if (isAuthenticated && requiredRoles && !requiredRoles.includes(userRole)) {
    const redirectName = userRole === 2 ? 'TattooArtistDashboard' : 'ClientDashboard'
    next({ name: redirectName })
  } else if (isAuthenticated && (to.name === 'Login' || to.name === 'Register')) {
    const redirectName = userRole === 2 ? 'TattooArtistDashboard' : 'ClientDashboard'
    next({ name: redirectName })
  } else {
    next()
  }
})

export default router
