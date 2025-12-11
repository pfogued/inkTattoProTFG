<template>
  <div class="p-8">
    <h1 class="text-3xl font-extrabold mb-6 text-gray-900">
      Dashboard de Cliente: {{ authStore.user?.name }}
    </h1>

    <!-- CUADRÍCULA PRINCIPAL (Ahora con 4 columnas en pantallas grandes: lg:grid-cols-4) -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <!-- Enlace 1: Citas (RF-3, RF-5) -->
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

      <!-- Enlace 2: Mensajería (RF-11) -->
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

      <!-- Enlace 3: Historial de Pagos (RF-13) -->
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

      <!-- Enlace 4: Galería de Diseños (RF-9) -->
      <router-link
        to="/app/designs"
        class="bg-blue-600 hover:bg-blue-700 text-white p-6 rounded-xl shadow-lg transition transform hover:scale-105"
      >
        <div class="flex items-center space-x-4">
          <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
            <path
              d="M16 10c0 1.1-.9 2-2 2h-4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2h4c1.1 0 2 .9 2 2v4zm-2-2h-4v2h4V8zm4-4h-2V2h-2v2H8V2H6v2H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.89 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4V6h16v12z"
            ></path>
          </svg>
          <div>
            <p class="font-bold text-xl">Galería de Diseños</p>
            <p class="text-sm">Explora trabajos recientes de tatuadores (RF-9).</p>
          </div>
        </div>
      </router-link>
    </div>

    <!-- ELIMINAMOS LA SECCIÓN DE DISEÑOS DEBAJO DEL GRID, YA QUE ESTÁ EN LA TARJETA -->
  </div>
</template>

<script setup>
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()
</script>
