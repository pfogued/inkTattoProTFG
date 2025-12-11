<template>
  <div class="container mx-auto p-4 sm:p-6 lg:p-8">
    <div class="bg-white shadow-xl rounded-xl p-6 mb-8">
      <h1 class="text-3xl font-extrabold text-gray-900 mb-2">
        {{ authStore.isTattooArtist ? 'Agenda de Tatuador' : 'Gestión de Citas' }} (RF-7)
      </h1>
      <p class="text-gray-500">
        {{
          authStore.isTattooArtist
            ? 'Revisa, confirma o gestiona las citas.'
            : 'Modifica, cancela o revisa tus reservas.'
        }}
      </p>
    </div>

    <!-- PANTALLA PARA EL CLIENTE (role_id = 1) -->
    <div v-if="authStore.isClient" class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Columna 1: Enlace a Reserva -->
      <div class="lg:col-span-1 bg-white p-6 shadow-xl rounded-xl h-fit">
        <h2 class="text-2xl font-bold text-indigo-700 mb-4 border-b pb-2">Reservar Nueva Cita</h2>
        <p class="text-gray-500">Esta funcionalidad se maneja en la vista de Calendario.</p>
        <button
          @click="router.push('/app/calendar')"
          class="mt-4 w-full py-2 bg-indigo-600 text-white rounded-lg"
        >
          Ir a Calendario
        </button>
      </div>

      <!-- Columna 2/3: Lista de Citas del Cliente (RF-5, RF-7) -->
      <div class="lg:col-span-2 bg-white p-6 shadow-xl rounded-xl">
        <h2 class="text-2xl font-bold text-indigo-700 mb-4 border-b pb-2">Mis Citas Reservadas</h2>

        <div v-if="listLoading" class="text-center py-10 text-gray-500">Cargando citas...</div>
        <div v-else-if="appointments.length === 0" class="text-center py-10 text-gray-500">
          No tienes citas reservadas.
        </div>

        <div v-else class="space-y-4">
          <div
            v-for="app in appointments"
            :key="app.id"
            :class="getStatusBorderClass(app.status)"
            class="p-4 border rounded-lg shadow-sm bg-gray-50 flex justify-between items-center"
          >
            <div>
              <p class="font-semibold text-gray-900">
                Tatuador: {{ app.tattoo_artist?.name || 'N/A' }}
              </p>
              <p class="text-sm text-gray-600">Fecha: {{ formatDateTime(app.scheduled_at) }}</p>
              <p class="text-sm text-gray-600 truncate max-w-sm">Detalle: {{ app.description }}</p>
              <span
                :class="getStatusBadgeClass(app.status)"
                class="text-xs font-medium px-2.5 py-0.5 rounded-full mt-1 inline-block"
              >
                {{ app.status.toUpperCase() }}
              </span>
            </div>

            <!-- Acciones del Cliente (RF-7) -->
            <div class="flex flex-col space-y-2">
              <button
                v-if="app.status === 'pending' || app.status === 'approved'"
                @click="openModificationModal(app)"
                class="py-1 px-3 rounded-lg text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 transition"
              >
                Modificar
              </button>
              <button
                v-if="app.status === 'pending' || app.status === 'approved'"
                @click="cancelAppointment(app.id)"
                class="py-1 px-3 rounded-lg text-sm font-medium text-white bg-red-500 hover:bg-red-600 transition"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- PANTALLA PARA EL TATUADOR (role_id = 2) -->
    <div v-else-if="authStore.isTattooArtist" class="bg-white p-6 shadow-xl rounded-xl">
      <h2 class="text-2xl font-bold text-indigo-700 mb-4 border-b pb-2">Gestión de Agenda</h2>

      <div v-if="listLoading" class="text-center py-10 text-gray-500">Cargando agenda...</div>
      <div v-else-if="appointments.length === 0" class="text-center py-10 text-gray-500">
        No tienes citas programadas.
      </div>

      <div v-else class="space-y-4">
        <div
          v-for="app in appointments"
          :key="app.id"
          :class="getStatusBorderClass(app.status)"
          class="p-4 border rounded-lg shadow-sm bg-gray-50 flex justify-between items-center"
        >
          <div>
            <p class="font-semibold text-gray-900">Cliente: {{ app.client?.name }}</p>
            <p class="text-sm text-gray-600">Fecha: {{ formatDateTime(app.scheduled_at) }}</p>
            <p class="text-sm text-gray-600 truncate max-w-sm">Detalle: {{ app.description }}</p>
            <span
              :class="getStatusBadgeClass(app.status)"
              class="text-xs font-medium px-2.5 py-0.5 rounded-full mt-1 inline-block"
            >
              {{ app.status.toUpperCase() }}
            </span>
          </div>

          <!-- Acciones del Tatuador (RF-6, RF-7) -->
          <div class="flex flex-col space-y-2">
            <button
              v-if="app.status === 'pending'"
              @click="confirmAppointment(app.id)"
              class="py-1 px-3 rounded-lg text-sm font-medium text-white bg-green-600 hover:bg-green-700 transition"
            >
              Confirmar (RF-6)
            </button>
            <button
              v-if="app.status === 'pending' || app.status === 'approved'"
              @click="openModificationModal(app)"
              class="py-1 px-3 rounded-lg text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 transition"
            >
              Modificar
            </button>
            <button
              v-if="app.status === 'pending' || app.status === 'approved'"
              @click="cancelAppointment(app.id)"
              class="py-1 px-3 rounded-lg text-sm font-medium text-white bg-red-500 hover:bg-red-600 transition"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de Modificación de Cita -->
    <ModificationModal
      :is-open="isModificationModalOpen"
      :appointment="selectedAppointment"
      @close="isModificationModalOpen = false"
      @appointment-updated="fetchAppointments"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { useAuthStore } from '../stores/auth'
import ModificationModal from '../components/ModificationModal.vue'

const authStore = useAuthStore()
const router = useRouter()

const appointments = ref([])
const listLoading = ref(true)
const isModificationModalOpen = ref(false)
const selectedAppointment = ref(null)

const fetchAppointments = async () => {
  listLoading.value = true
  try {
    const response = await axios.get('/appointments')
    appointments.value = response.data.appointments
  } catch (error) {
    console.error('Error al cargar citas:', error)
  } finally {
    listLoading.value = false
  }
}

const confirmAppointment = async (appointmentId) => {
  if (!confirm('¿Estás seguro de CONFIRMAR esta cita?')) return

  try {
    await axios.post(`/appointments/${appointmentId}/confirm`)
    alert('Cita confirmada con éxito.')
    fetchAppointments()
  } catch (error) {
    alert('Error al confirmar la cita: ' + (error.response?.data?.message || 'Error de red.'))
  }
}

const cancelAppointment = async (appointmentId) => {
  if (!confirm('¿Estás seguro de CANCELAR esta cita? Esta acción la cambiará a estado "canceled".'))
    return

  try {
    // Llama al endpoint PATCH /appointments/{id}/cancel
    await axios.patch(`/appointments/${appointmentId}/cancel`)
    alert('Cita cancelada con éxito.')
    fetchAppointments()
  } catch (error) {
    alert('Error al cancelar la cita: ' + (error.response?.data?.message || 'Error de permisos.'))
  }
}

const openModificationModal = (appointment) => {
  selectedAppointment.value = appointment
  isModificationModalOpen.value = true
}

// --- UTILITIES ---
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

const getStatusBorderClass = (status) => {
  switch (status) {
    case 'approved':
      return 'border-l-4 border-green-500'
    case 'pending':
      return 'border-l-4 border-yellow-500'
    case 'canceled':
      return 'border-l-4 border-red-500'
    default:
      return 'border-l-4 border-gray-300'
  }
}

onMounted(() => {
  if (authStore.isAuthenticated) {
    fetchAppointments()
  }
})
</script>
