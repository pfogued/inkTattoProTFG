<template>
  <nav class="bg-white shadow-lg">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <div class="flex-shrink-0 flex items-center">
          <span class="text-2xl font-bold text-indigo-600">InkTattooPro</span>
        </div>

        <div class="flex items-center space-x-4">
          <router-link
            v-for="link in filteredLinks"
            :key="link.name"
            :to="link.to"
            class="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-indigo-600 transition"
            :class="{ 'bg-indigo-50 text-indigo-600': $route.name === link.routeName }"
          >
            {{ link.name }}
          </router-link>
        </div>

        <div class="flex items-center">
          <button
            @click="triggerLogout"
            class="ml-3 p-2 rounded-full text-sm font-medium text-white bg-red-500 hover:bg-red-600 transition duration-150"
            title="Cerrar Sesión"
          >
            <svg
              class="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              ></path>
            </svg>
          </button>
        </div>
      </div>
    </div>

    <ConfirmModal
      :is-open="isLogoutModalOpen"
      title="¿Cerrar Sesión?"
      message="¿Estás seguro de que deseas salir de InkTattooPro? Se perderá el acceso hasta que vuelvas a iniciar sesión."
      @close="isLogoutModalOpen = false"
      @confirm="executeLogout"
    />
  </nav>
</template>

<script setup>
import { ref, computed } from 'vue' // Añadido ref
import { useAuthStore } from '../stores/auth'
import ConfirmModal from '../components/ConfirmModal.vue' // Importación del componente

const authStore = useAuthStore()

// Estado para controlar el modal
const isLogoutModalOpen = ref(false)

// Definición de enlaces para ambos roles
const navigationLinks = [
  { name: 'Dashboard', to: '/app/client/dashboard', routeName: 'ClientDashboard', roles: [1] },
  {
    name: 'Dashboard',
    to: '/app/artist/dashboard',
    routeName: 'TattooArtistDashboard',
    roles: [2],
  },
  { name: 'Reservar Cita', to: '/app/calendar', routeName: 'Calendar', roles: [1] },
  { name: 'Agenda', to: '/app/calendar', routeName: 'Calendar', roles: [2] },
  { name: 'Chat', to: '/app/chat', routeName: 'ChatView', roles: [1, 2] },
  { name: 'Diseños', to: '/app/designs', routeName: 'DesignGallery', roles: [1, 2] },
  { name: 'Pagos', to: '/app/payments', routeName: 'PaymentHistory', roles: [1, 2] },
]

const filteredLinks = computed(() => {
  const userRole = authStore.userRole
  if (!userRole) return []
  return navigationLinks.filter((link) => link.roles.includes(userRole))
})

// 1. Preparamos el cierre (Abre el modal)
const triggerLogout = () => {
  isLogoutModalOpen.value = true
}

// 2. Ejecutamos el cierre real (Llamado desde el modal)
const executeLogout = () => {
  isLogoutModalOpen.value = false
  authStore.logout()
}
</script>
