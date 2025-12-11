<template>
  <div class="container mx-auto p-4 sm:p-6 lg:p-8">
    <div class="bg-white shadow-xl rounded-xl p-6 mb-8">
      <h1 class="text-3xl font-extrabold text-gray-900 mb-2">
        {{ authStore.isTattooArtist ? 'Agenda de Tatuador' : 'Gestión de Citas' }}
      </h1>
      <p class="text-gray-500">
        {{
          authStore.isTattooArtist
            ? 'Revisa y confirma las citas pendientes.'
            : 'Reserva una nueva cita o gestiona tus reservas.'
        }}
      </p>
    </div>

    <!-- PANTALLA PARA EL CLIENTE (role_id = 1) -->
    <div v-if="authStore.isClient" class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Columna 1: Formulario de Reserva (RF-3) -->
      <div class="lg:col-span-1 bg-white p-6 shadow-xl rounded-xl h-fit">
        <h2 class="text-2xl font-bold text-indigo-700 mb-4 border-b pb-2">Reservar Nueva Cita</h2>
        <form @submit.prevent="submitAppointment">
          <!-- Tatuador (SELECTOR DINÁMICO) -->
          <div class="mb-4">
            <label for="artistId" class="block text-sm font-medium text-gray-700"
              >Seleccionar Tatuador</label
            >
            <select
              id="artistId"
              v-model="form.tattoo_artist_id"
              required
              :disabled="artistsLoading || availableTattooArtists.length === 0"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            >
              <!-- Opción inicial que fuerza la selección -->
              <option :value="null" disabled>-- Seleccione un artista --</option>
              <option v-if="artistsLoading" :value="null" disabled>Cargando artistas...</option>

              <option v-for="artist in availableTattooArtists" :key="artist.id" :value="artist.id">
                {{ artist.name }} (ID: {{ artist.id }})
              </option>
            </select>
            <p
              v-if="!artistsLoading && availableTattooArtists.length === 0"
              class="text-xs text-red-500 mt-1"
            >
              No hay tatuadores disponibles. Por favor, crea uno.
            </p>
          </div>

          <!-- Fecha y Hora -->
          <div class="mb-4">
            <label for="scheduledAt" class="block text-sm font-medium text-gray-700"
              >Fecha y Hora</label
            >
            <input
              type="datetime-local"
              id="scheduledAt"
              v-model="form.scheduled_at"
              required
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <!-- Descripción -->
          <div class="mb-4">
            <label for="description" class="block text-sm font-medium text-gray-700"
              >Descripción del Tatuaje</label
            >
            <textarea
              id="description"
              v-model="form.description"
              required
              rows="3"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            ></textarea>
          </div>

          <!-- Mensaje de Cita -->
          <p
            v-if="appointmentMessage"
            :class="messageClass"
            class="text-center p-3 rounded-lg mb-4"
          >
            {{ appointmentMessage }}
          </p>

          <!-- Botón de Reserva (Simula Pago de 50€) -->
          <button
            type="submit"
            :disabled="isLoading || artistsLoading || form.tattoo_artist_id === null"
            class="w-full py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 disabled:opacity-50 transition duration-150"
          >
            <span v-if="isLoading">Procesando depósito...</span>
            <span v-else>Reservar y pagar depósito (50€)</span>
          </button>
        </form>
      </div>

      <!-- Columna 2/3: Lista de Citas del Cliente (RF-5) -->
      <div class="lg:col-span-2 bg-white p-6 shadow-xl rounded-xl">
        <h2 class="text-2xl font-bold text-indigo-700 mb-4 border-b pb-2">Mis Citas Reservadas</h2>
        <AppointmentList :appointments="appointments" :loading="listLoading" />
      </div>
    </div>

    <!-- PANTALLA PARA EL TATUADOR (role_id = 2) -->
    <div v-else-if="authStore.isTattooArtist" class="bg-white p-6 shadow-xl rounded-xl">
      <h2 class="text-2xl font-bold text-indigo-700 mb-4 border-b pb-2">
        Citas Pendientes de Confirmar
      </h2>
      <div v-if="listLoading" class="text-center py-10 text-gray-500">Cargando agenda...</div>
      <div v-else-if="appointments.length === 0" class="text-center py-10 text-gray-500">
        No tienes citas programadas.
      </div>

      <div v-else class="space-y-4">
        <div
          v-for="app in appointments"
          :key="app.id"
          :class="
            app.status === 'approved'
              ? 'border-l-4 border-green-500'
              : 'border-l-4 border-yellow-500'
          "
          class="p-4 border rounded-lg shadow-sm bg-gray-50 flex justify-between items-center"
        >
          <div>
            <p class="font-semibold text-gray-900">Cliente: {{ app.client.name }}</p>
            <p class="text-sm text-gray-600">Fecha: {{ formatDateTime(app.scheduled_at) }}</p>
            <p class="text-sm text-gray-600 truncate max-w-sm">Detalle: {{ app.description }}</p>
            <span
              :class="getStatusBadgeClass(app.status)"
              class="text-xs font-medium px-2.5 py-0.5 rounded-full mt-1 inline-block"
            >
              {{ app.status.toUpperCase() }}
            </span>
          </div>

          <!-- Botón de Confirmación (RF-6) -->
          <button
            v-if="app.status === 'pending'"
            @click="confirmAppointment(app.id)"
            :disabled="app.isConfirming"
            class="py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 transition duration-150"
          >
            {{ app.isConfirming ? 'Confirmando...' : 'Confirmar Cita (RF-6)' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import axios from 'axios'
import { useAuthStore } from '../stores/auth'
import AppointmentList from '../components/AppointmentList.vue'

const authStore = useAuthStore()
const isLoading = ref(false)
const listLoading = ref(true)
const artistsLoading = ref(true)
const appointments = ref([])
const availableTattooArtists = ref([])
const appointmentMessage = ref('')
const messageClass = ref('')

// Formulario de Reserva (Cliente)
const form = reactive({
  tattoo_artist_id: null, // <-- Inicializado a null
  scheduled_at: '',
  description: '',
})

// Función para obtener la lista de Tatuadores
const fetchTattooArtists = async () => {
  artistsLoading.value = true
  try {
    const response = await axios.get('/tattoo-artists')
    availableTattooArtists.value = response.data.artists

    // Si hay artistas, pre-selecciona el primero.
    if (availableTattooArtists.value.length > 0) {
      form.tattoo_artist_id = availableTattooArtists.value[0].id
    } else {
      form.tattoo_artist_id = null // Asegura que se mantenga en null si no hay artistas
    }
  } catch (error) {
    console.error('Error al cargar artistas:', error)
  } finally {
    artistsLoading.value = false
  }
}

// Función para obtener citas (RF-5)
const fetchAppointments = async () => {
  listLoading.value = true
  try {
    const response = await axios.get('/appointments')
    if (authStore.isTattooArtist) {
      appointments.value = response.data.appointments.map((app) => ({
        ...app,
        isConfirming: false,
      }))
    } else {
      appointments.value = response.data.appointments
    }
  } catch (error) {
    console.error('Error al cargar citas:', error)
  } finally {
    listLoading.value = false
  }
}

// Función para reservar una cita (RF-3)
const submitAppointment = async () => {
  isLoading.value = true
  appointmentMessage.value = ''
  messageClass.value = ''

  if (form.tattoo_artist_id === null) {
    appointmentMessage.value = 'Por favor, selecciona un tatuador.'
    messageClass.value = 'bg-red-100 text-red-700'
    isLoading.value = false
    return
  }

  try {
    const response = await axios.post('/appointments', form)

    appointmentMessage.value = response.data.message
    messageClass.value = 'bg-green-100 text-green-700'

    // Limpiar formulario (excepto el artista seleccionado)
    form.scheduled_at = ''
    form.description = ''

    fetchAppointments() // Recargar la lista de citas
  } catch (error) {
    let msg = 'Error desconocido al reservar.'
    if (error.response && error.response.data.message) {
      msg = error.response.data.message
    } else if (error.response && error.response.data.errors) {
      msg = Object.values(error.response.data.errors).flat().join(' ')
    }
    appointmentMessage.value = msg
    messageClass.value = 'bg-red-100 text-red-700'
  } finally {
    isLoading.value = false
  }
}

// Función para confirmar una cita (RF-6)
const confirmAppointment = async (appointmentId) => {
  const appointmentIndex = appointments.value.findIndex((app) => app.id === appointmentId)
  if (appointmentIndex === -1) return

  const appointment = appointments.value[appointmentIndex]
  appointment.isConfirming = true

  try {
    await axios.post(`/appointments/${appointmentId}/confirm`)

    appointments.value[appointmentIndex].status = 'approved'
  } catch (error) {
    console.error('Error al confirmar la cita:', error)
    alert('No se pudo confirmar la cita: ' + (error.response?.data?.message || 'Error de red.'))
  } finally {
    appointment.isConfirming = false
  }
}

// Utilitarios
const formatDateTime = (datetime) => {
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

// Ciclo de vida
onMounted(() => {
  if (authStore.isAuthenticated) {
    fetchAppointments()
    if (authStore.isClient) {
      fetchTattooArtists() // Solo cargamos la lista si es cliente
    }
  }
})
</script>
