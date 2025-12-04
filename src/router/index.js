import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth' // Importamos el Store de Pinia
import MainLayout from '../layouts/MainLayout.vue' // Importamos el Layout Principal

// Vistas principales (Usando rutas relativas para evitar problemas de alias)
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import ClientDashboard from '../views/ClientDashboard.vue'
import TattooArtistDashboard from '../views/TattooArtistDashboard.vue'
import CalendarView from '../views/CalendarView.vue'
import DesignGallery from '../views/DesignGallery.vue'
import ChatView from '../views/ChatView.vue'
// AÑADIR LA VISTA QUE FALTABA
import PaymentHistory from '../views/PaymentHistory.vue' // <--- AGREGADO

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // ----------------------------------------------------
    // 1. RUTAS PÚBLICAS (Sin Layout, sin autenticación)
    // ----------------------------------------------------
    {
      path: '/',
      redirect: '/login', // Redirigir al Login por defecto
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
    // 2. RUTAS PROTEGIDAS (Usan MainLayout y requieren Auth)
    // ----------------------------------------------------
    {
      path: '/app',
      component: MainLayout, // Componente que contiene la Navbar
      meta: { requiresAuth: true },
      children: [
        // DASHBOARDS
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

        // AGENDA
        { path: 'calendar', name: 'Calendar', component: CalendarView, meta: { roles: [1, 2] } },

        // CHAT Y DISEÑOS
        { path: 'chat', name: 'ChatView', component: ChatView, meta: { roles: [1, 2] } },
        {
          path: 'designs',
          name: 'DesignGallery',
          component: DesignGallery,
          meta: { roles: [1, 2] },
        },

        // PAGOS (RF-13) <--- AGREGADO EN CHILDREN
        {
          path: 'payments',
          name: 'PaymentHistory',
          component: PaymentHistory,
          meta: { roles: [1, 2] },
        },
      ],
    },

    // ----------------------------------------------------
    // 3. RUTA 404 (Debe ser la última)
    // ----------------------------------------------------
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

  if (!authStore.isLoggedIn) {
    authStore.initialize()
  }

  const isAuthenticated = authStore.isLoggedIn
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
