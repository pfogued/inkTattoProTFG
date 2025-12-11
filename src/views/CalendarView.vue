<template>
  <div class="p-8">
    <h1 class="text-3xl font-extrabold mb-6">Agenda y Gestión de Citas</h1>

    <!-- LÓGICA DE CONTROL POR ROL -->

    <!-- 1. INTERFAZ PARA EL CLIENTE (RF-5: Reservar Cita) -->
    <div
      v-if="authStore.isClient"
      class="text-center p-10 border-2 border-dashed border-indigo-400 bg-indigo-50 rounded-xl"
    >
      <p class="text-lg font-semibold text-gray-700">¿Listo para tu próximo tatuaje?</p>
      <button
        @click="isModalOpen = true"
        :disabled="artistsLoading"
        class="mt-6 bg-indigo-600 text-white py-3 px-6 rounded-xl hover:bg-indigo-700 transition font-bold disabled:opacity-50"
      >
        <span v-if="artistsLoading">Cargando Tatuadores...</span>
        <span v-else>Reservar Nueva Cita (RF-5)</span>
      </button>
    </div>

    <!-- 2. INTERFAZ PARA EL TATUADOR (RF-8: Gestión de Agenda) -->
    <div v-else-if="authStore.isTattooArtist" class="text-right pb-4">
      <button
        @click="openAvailabilityModal"
        class="bg-yellow-500 text-white py-2 px-4 rounded-xl hover:bg-yellow-600 transition"
      >
        Establecer Disponibilidad (RF-8)
      </button>
    </div>

    <!-- 3. Contenido Principal: Lista de Citas (Agenda) -->
    <div class="mt-8 bg-white p-6 rounded-xl shadow-lg">
      <h2 class="text-xl font-semibold mb-4 border-b pb-2">
        Agenda de Citas {{ authStore.isClient ? 'Confirmadas' : 'Completas' }}
      </h2>

      <!-- Bloques condicionales para la lista de citas -->
      <div v-if="loadingAppointments" class="py-4 text-center text-gray-500">
        Cargando agenda real...
      </div>
      <div v-else-if="appointments.length === 0" class="py-4 text-gray-500">
        No hay citas registradas.
      </div>
      <ul v-else class="divide-y divide-gray-200">
        <li
          v-for="appointment in appointments"
          :key="appointment.id"
          class="py-4 flex justify-between items-center"
        >
          <div>
            <!-- Muestra info real de la API -->
            <p class="text-lg font-medium text-gray-900">{{ appointment.description }}</p>
            <p class="text-sm text-gray-500">
              Fecha: {{ formatDateTime(appointment.scheduled_at) }} |
              <!-- Muestra el artista si eres cliente, o el cliente si eres artista -->
              <span v-if="authStore.isClient">Tatuador: {{ appointment.tattoo_artist?.name }}</span>
              <span v-else>Cliente: {{ appointment.client?.name }}</span>
            </p>
            <span
              :class="getStatusBadgeClass(appointment.status)"
              class="text-xs font-medium px-2.5 py-0.5 rounded-full mt-1 inline-block"
            >
              {{ appointment.status.toUpperCase() }}
            </span>
          </div>
          <!-- RF-7: Redirigir a la vista de gestión donde sí están los botones de Modificar/Cancelar -->
          <button
            @click="redirectToAppointments()"
            class="text-indigo-600 hover:text-indigo-800 text-sm"
          >
            Ver/Gestionar (RF-7)
          </button>
        </li>
      </ul>
    </div>

    <!-- Modal de Reserva de Citas (RF-5) -->
    <AppointmentModal
      :is-open="isModalOpen"
      :artists="availableTattooArtists"
      :artists-loading="artistsLoading"
      @close="closeReservationModal"
      @appointment-booked="handleAppointmentBooked"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useAuthStore } from '../stores/auth'
import AppointmentModal from '../components/AppointmentModal.vue'
import { useRouter } from 'vue-router' // Importamos el router

const authStore = useAuthStore()
const router = useRouter() // Inicializamos el router

// --- ESTADO DE DATOS ---
const isModalOpen = ref(false)
const appointments = ref([])
const loadingAppointments = ref(true)

// --- ESTADO DE ARTISTAS ---
const artistsLoading = ref(true)
const availableTattooArtists = ref([])

// --- FUNCIONES DE CARGA DE DATOS ---
async function fetchTattooArtists() {
  artistsLoading.value = true
  try {
    const response = await axios.get('/tattoo-artists')
    availableTattooArtists.value = response.data.artists
  } catch (error) {
    console.error('Error al cargar artistas:', error)
  } finally {
    artistsLoading.value = false
  }
}

async function fetchAppointments() {
  loadingAppointments.value = true
  try {
    const response = await axios.get('/appointments')
    appointments.value = response.data.appointments
  } catch (error) {
    console.error('Error al cargar citas:', error)
  } finally {
    loadingAppointments.value = false
  }
}

// Función para redirigir al cliente a la vista de gestión de citas
function redirectToAppointments() {
  // Redirige a la vista donde sí están los botones Modificar/Cancelar implementados
  router.push({ path: '/app/appointments' })
}

function closeReservationModal() {
  isModalOpen.value = false
  fetchAppointments()
}

function handleAppointmentBooked() {
  isModalOpen.value = false
  fetchAppointments()
}

function openAvailabilityModal() {
  alert('Funcionalidad de establecer disponibilidad del Tatuador (RF-8).')
}

// --- UTILITIES ---
const formatDateTime = (datetime) => {
  // Si el datetime es válido, usa toLocaleString, sino devuelve cadena vacía
  if (!datetime) return ''
  return new Date(datetime).toLocaleString()
}

const getStatusBadgeClass = (status) => {
  switch (status) {
    case 'approved':
      return 'bg-green-100 text-green-800'
    case 'pending':
      return 'bg-yellow-100 text-yellow-800'
    case 'canceled':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

onMounted(() => {
  if (authStore.isAuthenticated) {
    fetchAppointments()
    if (authStore.isClient) {
      fetchTattooArtists()
    }
  }
})
</script>
