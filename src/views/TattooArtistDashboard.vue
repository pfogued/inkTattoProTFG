<template>
  <div class="p-8">
    <h1 class="text-3xl font-extrabold mb-6 text-gray-900">
      Dashboard de Tatuador: {{ authStore.user?.name }}
    </h1>

    <!-- Sección de Acciones Rápidas (RF-8, RF-11, RF-13) -->
    <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
      <!-- Enlace al Chat (RF-11) -->
      <router-link
        to="/app/chat"
        class="bg-indigo-600 hover:bg-indigo-700 text-white p-6 rounded-xl shadow-lg transition transform hover:scale-105"
      >
        <div class="flex items-center space-x-4">
          <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
            <path
              d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"
            ></path>
          </svg>
          <div>
            <p class="font-bold text-xl">Mensajería</p>
            <p class="text-sm">Contacta a Clientes y otros Artistas.</p>
          </div>
        </div>
      </router-link>

      <!-- Enlace a la Agenda (Citas Pendientes RF-6) -->
      <router-link
        to="/app/appointments"
        class="bg-yellow-500 hover:bg-yellow-600 text-white p-6 rounded-xl shadow-lg transition transform hover:scale-105"
      >
        <div class="flex items-center space-x-4">
          <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
            <path
              d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"
            ></path>
          </svg>
          <div>
            <p class="font-bold text-xl">Revisar Citas</p>
            <p class="text-sm">Tienes {{ pendingAppointments }} citas pendientes.</p>
          </div>
        </div>
      </router-link>

      <!-- Enlace a Diseños (RF-8) -->
      <router-link
        to="/app/designs"
        class="bg-green-600 hover:bg-green-700 text-white p-6 rounded-xl shadow-lg transition transform hover:scale-105"
      >
        <div class="flex items-center space-x-4">
          <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
            <path
              d="M16 10c0 1.1-.9 2-2 2h-4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2h4c1.1 0 2 .9 2 2v4zm-2-2h-4v2h4V8zm4-4h-2V2h-2v2H8V2H6v2H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.89 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4V6h16v12z"
            ></path>
          </svg>
          <div>
            <p class="font-bold text-xl">Diseños / Portafolio</p>
            <p class="text-sm">Sube y gestiona tus trabajos.</p>
          </div>
        </div>
      </router-link>

      <!-- Enlace a Historial de Pagos (RF-13) -->
      <router-link
        to="/app/payments"
        class="bg-blue-600 hover:bg-blue-700 text-white p-6 rounded-xl shadow-lg transition transform hover:scale-105"
      >
        <div class="flex items-center space-x-4">
          <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
            <path
              d="M21 4H3c-1.11 0-2 .89-2 2v12c0 1.11.89 2 2 2h18c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H3V6h18v12zm-2-7h-4V8h-2v3h-4V8h-2v3H5v2h4v3h2v-3h4v3h2v-3h2v-2z"
            ></path>
          </svg>
          <div>
            <p class="font-bold text-xl">Ingresos (Pagos)</p>
            <p class="text-sm">Historial de depósitos recibidos (RF-13).</p>
          </div>
        </div>
      </router-link>
    </div>

    <!-- Sección de Detalle de Agenda -->
    <div class="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
      <h2 class="text-xl font-semibold mb-4 border-b pb-2">Próximas Citas Confirmadas</h2>

      <div v-if="loading" class="text-center py-6 text-gray-500">Cargando datos...</div>
      <div v-else-if="confirmedAppointments.length === 0" class="text-center py-6 text-gray-500">
        No tienes citas próximas confirmadas.
      </div>

      <ul v-else class="divide-y divide-gray-200">
        <li
          v-for="app in confirmedAppointments"
          :key="app.id"
          class="py-3 flex justify-between items-center"
        >
          <div>
            <p class="font-medium text-gray-900">{{ app.client.name }}</p>
            <p class="text-sm text-gray-500">{{ formatDateTime(app.scheduled_at) }}</p>
          </div>
          <span class="text-xs text-indigo-600 font-semibold">
            {{ app.description.substring(0, 30) }}...
          </span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'
import axios from 'axios'

const authStore = useAuthStore()
const loading = ref(true)
const pendingAppointments = ref(0)
const confirmedAppointments = ref([])

// Carga las citas pendientes y confirmadas del tatuador
const fetchAppointments = async () => {
  loading.value = true
  try {
    // Llama a /appointments que filtra por el usuario logueado
    const response = await axios.get('/appointments')
    const allAppointments = response.data.appointments

    pendingAppointments.value = allAppointments.filter((app) => app.status === 'pending').length
    confirmedAppointments.value = allAppointments.filter((app) => app.status === 'approved')
  } catch (error) {
    console.error('Error fetching appointments:', error)
  } finally {
    loading.value = false
  }
}

const formatDateTime = (datetime) => {
  return new Date(datetime).toLocaleString()
}

onMounted(() => {
  fetchAppointments()
})
</script>
