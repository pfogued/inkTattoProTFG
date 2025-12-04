<template>
  <div class="space-y-8 p-4 bg-white rounded-xl shadow-2xl">
    <!-- Encabezado de Bienvenida -->
    <header class="pb-4 border-b">
      <!-- Muestra el nombre del usuario logeado, cargado desde Pinia -->
      <h1 class="text-3xl font-extrabold text-gray-900">
        Hola, {{ authStore.user?.name || 'Cliente' }}!
      </h1>
      <p class="mt-1 text-base text-gray-600">
        Aquí tienes un resumen de tu actividad y próximos pasos.
      </p>
    </header>

    <!-- RF-5: Acciones Destacadas (Reserva, Chat, Diseños) -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <!-- Card 1: Reservar Nueva Cita (RF-5) -->
      <div
        @click="router.push({ name: 'Calendar' })"
        class="bg-gray-50 p-6 rounded-xl shadow-lg hover:shadow-xl transition duration-300 cursor-pointer border-t-4 border-indigo-500"
      >
        <div class="flex items-center space-x-4">
          <div class="flex-shrink-0 p-3 bg-indigo-100 text-indigo-600 rounded-full">
            <!-- Icono de calendario -->
            <svg
              class="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              ></path>
            </svg>
          </div>
          <div>
            <h3 class="text-lg font-semibold text-gray-800">Reservar Nueva Cita</h3>
            <p class="text-sm text-gray-500">Agenda tu próximo tatuaje</p>
          </div>
        </div>
      </div>

      <!-- Card 2: Mensajes No Leídos (RF-11) -->
      <div
        @click="router.push({ name: 'ChatView' })"
        class="bg-gray-50 p-6 rounded-xl shadow-lg hover:shadow-xl transition duration-300 cursor-pointer border-t-4 border-blue-500"
      >
        <div class="flex items-center space-x-4">
          <div class="flex-shrink-0 p-3 bg-blue-100 text-blue-600 rounded-full">
            <!-- Icono de mensaje -->
            <svg
              class="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
              ></path>
            </svg>
          </div>
          <div>
            <h3 class="text-lg font-semibold text-gray-800">Mensajes</h3>
            <p class="text-sm text-gray-500">{{ activeConversations }} conversaciones activas</p>
          </div>
        </div>
      </div>

      <!-- Card 3: Mis Diseños (RF-10) -->
      <div
        @click="router.push({ name: 'DesignGallery' })"
        class="bg-gray-50 p-6 rounded-xl shadow-lg hover:shadow-xl transition duration-300 cursor-pointer border-t-4 border-green-500"
      >
        <div class="flex items-center space-x-4">
          <div class="flex-shrink-0 p-3 bg-green-100 text-green-600 rounded-full">
            <!-- Icono de diseño -->
            <svg
              class="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8h12a2 2 0 002-2v-4a2 2 0 00-2-2H6a2 2 0 00-2 2v4a2 2 0 002 2z"
              ></path>
            </svg>
          </div>
          <div>
            <h3 class="text-lg font-semibold text-gray-800">Mis Diseños</h3>
            <p class="text-sm text-gray-500">Ver galería de diseños adjuntos</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Próxima Cita / Historial de Pagos (Mockup 2) -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Panel de Próxima Cita -->
      <div class="bg-white p-6 rounded-xl shadow-md border border-gray-200">
        <h3 class="text-xl font-semibold mb-4 border-b pb-2">Próxima Cita</h3>
        <div v-if="nextAppointment" class="space-y-3">
          <p><strong>Tatuador:</strong> {{ nextAppointment.artistName }}</p>
          <p><strong>Fecha:</strong> {{ nextAppointment.date }} a las {{ nextAppointment.time }}</p>
          <p>
            <strong>Estado:</strong>
            <span :class="getStatusClass(nextAppointment.status)">{{
              nextAppointment.status
            }}</span>
          </p>
          <button
            class="text-indigo-500 hover:underline text-sm mt-2"
            @click="router.push({ name: 'Calendar' })"
          >
            Modificar o Cancelar (RF-7)
          </button>
        </div>
        <div v-else class="text-gray-500">Aún no tienes citas reservadas.</div>
      </div>

      <!-- Panel de Historial de Pagos (RF-13) -->
      <div class="bg-white p-6 rounded-xl shadow-md border border-gray-200">
        <h3 class="text-xl font-semibold mb-4 border-b pb-2">Historial de Pagos</h3>
        <div v-if="lastPayment" class="space-y-3">
          <p><strong>Último Pago:</strong> {{ lastPayment.date }}</p>
          <p><strong>Monto:</strong> {{ lastPayment.amount }}€</p>
          <p>
            <strong>Estado:</strong>
            <span class="text-green-600 font-medium">{{ lastPayment.status }}</span>
          </p>
          <button
            class="text-indigo-500 hover:underline text-sm mt-2"
            @click="router.push({ name: 'PaymentHistory' })"
          >
            Consultar recibos (RF-13)
          </button>
        </div>
        <div v-else class="text-gray-500">No hay pagos registrados.</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'
import axios from 'axios'

const authStore = useAuthStore()
const router = useRouter()

const activeConversations = ref(0)
const nextAppointment = ref(null)
const lastPayment = ref(null)

const getStatusClass = (status) => {
  switch (status) {
    case 'Confirmada':
      return 'text-green-600 font-medium'
    case 'Pendiente':
      return 'text-yellow-600 font-medium'
    case 'Cancelada':
      return 'text-red-600 font-medium'
    default:
      return 'text-gray-600'
  }
}

async function fetchDashboardData() {
  // Solo cargamos si el usuario está autenticado
  if (!authStore.isLoggedIn) return

  try {
    // En un entorno real, harías llamadas a la API para obtener estos datos:
    // const response = await axios.get('/api/client/dashboard');

    // Simulación de datos para visualización (Mockup 2)
    nextAppointment.value = {
      artistName: 'Ana García',
      date: '2026-05-15',
      time: '14:00',
      status: 'Confirmada',
    }

    lastPayment.value = {
      date: '2026-04-01',
      amount: 50,
      status: 'Completado',
    }

    activeConversations.value = 2 // Simulación (RF-11)
  } catch (error) {
    console.error('Error al cargar datos del dashboard:', error)
  }
}

onMounted(() => {
  fetchDashboardData()
})
</script>
