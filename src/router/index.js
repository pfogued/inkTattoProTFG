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
import AppointmentManagement from '../views/AppointmentManagement.vue' // <-- NUEVA IMPORTACIÓN
import PaymentHistory from '../views/PaymentHistory.vue'

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
    }, // ----------------------------------------------------
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

        // GESTIÓN DE CITAS (RF-3, RF-5, RF-6) <-- NUEVA RUTA
        {
          path: 'appointments',
          name: 'AppointmentManagement',
          component: AppointmentManagement,
          meta: { roles: [1, 2] },
        }, // AGENDA

        { path: 'calendar', name: 'Calendar', component: CalendarView, meta: { roles: [1, 2] } }, // CHAT Y DISEÑOS

        { path: 'chat', name: 'ChatView', component: ChatView, meta: { roles: [1, 2] } },
        {
          path: 'designs',
          name: 'DesignGallery',
          component: DesignGallery,
          meta: { roles: [1, 2] },
        }, // PAGOS (RF-13)

        {
          path: 'payments',
          name: 'PaymentHistory',
          component: PaymentHistory,
          meta: { roles: [1, 2] },
        },
      ],
    }, // ----------------------------------------------------
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
  const authStore = useAuthStore() // Inicializar el store si la sesión ya existe

  if (!authStore.isAuthenticated) {
    authStore.initialize()
  }

  const isAuthenticated = authStore.isAuthenticated
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)
  const requiredRoles = to.meta.roles
  const userRole = authStore.user?.role_id

  if (requiresAuth && !isAuthenticated) {
    // Si requiere autenticación y no está logueado, redirigir a Login
    next({ name: 'Login' })
  } else if (isAuthenticated && requiredRoles && !requiredRoles.includes(userRole)) {
    // Si está logueado pero no tiene el rol, redirigir al Dashboard correcto
    const redirectName = userRole === 2 ? 'TattooArtistDashboard' : 'ClientDashboard'
    next({ name: redirectName })
  } else if (isAuthenticated && (to.name === 'Login' || to.name === 'Register')) {
    // Si está logueado e intenta ir a Login/Register, redirigir al Dashboard
    const redirectName = userRole === 2 ? 'TattooArtistDashboard' : 'ClientDashboard'
    next({ name: redirectName })
  } else {
    next()
  }
})

export default router
