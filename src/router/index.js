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
import ChatView from '../views/ChatView.vue' // Necesario para el Chat

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
      // Pendiente de implementar Register.vue
    },
    {
      path: '/forgot-password',
      name: 'ForgotPassword',
      component: () => import('../views/ForgotPassword.vue'),
      // Pendiente de implementar ForgotPassword.vue
    },

    // ----------------------------------------------------
    // 2. RUTAS PROTEGIDAS (Usan MainLayout y requieren Auth)
    // ----------------------------------------------------
    {
      path: '/app',
      component: MainLayout, // Componente que contiene la Navbar
      meta: { requiresAuth: true },
      children: [
        // DASHBOARD CLIENTE (Mockup 2)
        {
          path: 'client/dashboard',
          name: 'ClientDashboard',
          component: ClientDashboard,
          meta: { roles: [1] }, // Rol 1: Cliente
        },
        // DASHBOARD TATUADOR (Mockup 8)
        {
          path: 'artist/dashboard',
          name: 'TattooArtistDashboard',
          component: TattooArtistDashboard,
          meta: { roles: [2] }, // Rol 2: Tatuador
        },
        // CALENDARIO/AGENDA (RF-5, RF-8)
        {
          path: 'calendar',
          name: 'Calendar',
          component: CalendarView,
          meta: { roles: [1, 2] }, // Ambos roles
        },
        // CHAT (RF-11)
        {
          path: 'chat',
          name: 'ChatView',
          component: ChatView,
          meta: { roles: [1, 2] }, // Ambos roles
        },
        // GALERÍA DE DISEÑOS (RF-9, RF-10)
        {
          path: 'designs',
          name: 'DesignGallery',
          component: DesignGallery,
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

  // 1. Inicializar el estado de autenticación al cargar la página
  if (!authStore.isLoggedIn) {
    authStore.initialize() // Carga el token de LocalStorage
  }

  const isAuthenticated = authStore.isLoggedIn
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)
  const requiredRoles = to.meta.roles
  const userRole = authStore.user?.role_id // Usamos role_id del store

  if (requiresAuth && !isAuthenticated) {
    // Si requiere auth y no está autenticado -> a Login
    next({ name: 'Login' })
  } else if (isAuthenticated && requiredRoles && !requiredRoles.includes(userRole)) {
    // Si está autenticado pero no tiene el rol correcto -> redirigir a su Dashboard
    const redirectName = userRole === 2 ? 'TattooArtistDashboard' : 'ClientDashboard'
    next({ name: redirectName })
  } else if (isAuthenticated && (to.name === 'Login' || to.name === 'Register')) {
    // Si está autenticado y trata de ir a Login/Register -> redirigir a su Dashboard
    const redirectName = userRole === 2 ? 'TattooArtistDashboard' : 'ClientDashboard'
    next({ name: redirectName })
  } else {
    // En cualquier otro caso, continuar
    next()
  }
})

export default router
