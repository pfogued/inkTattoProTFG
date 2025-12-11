<template>
  <div class="p-8">
    <h1 class="text-3xl font-extrabold mb-6 text-gray-900">
      Dashboard de Cliente: {{ authStore.user?.name }}
    </h1>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      <!-- Enlace a Citas (RF-3, RF-5) -->
      <router-link
        to="/app/calendar"
        class="bg-indigo-600 hover:bg-indigo-700 text-white p-6 rounded-xl shadow-lg transition transform hover:scale-105"
      >
        <div class="flex items-center space-x-4">
          <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
            <path
              d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"
            ></path>
          </svg>
          <div>
            <p class="font-bold text-xl">Reservar Cita</p>
            <p class="text-sm">Revisa tu agenda y reserva tu próximo tatuaje.</p>
          </div>
        </div>
      </router-link>

      <!-- Enlace a Mensajería (RF-11) -->
      <router-link
        to="/app/chat"
        class="bg-yellow-500 hover:bg-yellow-600 text-white p-6 rounded-xl shadow-lg transition transform hover:scale-105"
      >
        <div class="flex items-center space-x-4">
          <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
            <path
              d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"
            ></path>
          </svg>
          <div>
            <p class="font-bold text-xl">Mensajería</p>
            <p class="text-sm">Chatea con tu Tatuador sobre diseños (RF-12).</p>
          </div>
        </div>
      </router-link>

      <!-- Enlace a Historial de Pagos (RF-13) -->
      <router-link
        to="/app/payments"
        class="bg-green-600 hover:bg-green-700 text-white p-6 rounded-xl shadow-lg transition transform hover:scale-105"
      >
        <div class="flex items-center space-x-4">
          <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
            <path
              d="M21 4H3c-1.11 0-2 .89-2 2v12c0 1.11.89 2 2 2h18c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H3V6h18v12zm-2-7h-4V8h-2v3h-4V8h-2v3H5v2h4v3h2v-3h4v3h2v-3h2v-2z"
            ></path>
          </svg>
          <div>
            <p class="font-bold text-xl">Historial de Pagos</p>
            <p class="text-sm">Consulta tus depósitos y transacciones (RF-13).</p>
          </div>
        </div>
      </router-link>
    </div>

    <!-- Sección de Últimos Diseños (RF-9) -->
    <div class="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
      <h2 class="text-xl font-semibold mb-4 border-b pb-2">Diseños Recientes y Galería</h2>
      <p class="text-gray-500">
        Aquí se mostraría una vista previa de los diseños que tienes asociados o la galería pública.
      </p>
      <button
        @click="router.push({ name: 'DesignGallery' })"
        class="mt-4 py-2 px-4 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
      >
        Ir a Galería Completa
      </button>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()
</script>
