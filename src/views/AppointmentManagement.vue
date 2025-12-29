<template>
  <div class="container mx-auto p-4 sm:p-6 lg:p-8">
    <div class="mb-6">
      <button
        @click="router.back()"
        class="flex items-center text-indigo-600 hover:text-indigo-800 transition-colors font-bold group"
      >
        <div class="bg-indigo-100 group-hover:bg-indigo-200 p-2 rounded-lg mr-3 transition-colors">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
        </div>
        Volver al Panel Principal
      </button>
    </div>
    <div class="bg-white shadow-xl rounded-xl p-6 mb-8 border border-gray-100">
      <h1 class="text-3xl font-extrabold text-gray-900 mb-2">
        {{ authStore.isTattooArtist ? 'Agenda de Tatuador' : 'Gestión de Citas' }}
      </h1>
      <p class="text-gray-500">
        {{
          authStore.isTattooArtist
            ? 'Revisa y gestiona las citas confirmadas y solicitudes.'
            : 'Modifica, revisa o finaliza el pago de tus reservas.'
        }}
      </p>
    </div>

    <div v-if="listLoading" class="text-center py-10 text-gray-500">
      <div
        class="animate-spin inline-block w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full mb-2"
      ></div>
      <p>Cargando citas...</p>
    </div>

    <div v-else class="space-y-4">
      <div
        v-for="app in appointments"
        :key="app.id"
        :class="getStatusBorderClass(app.status)"
        class="p-4 border rounded-lg shadow-sm bg-gray-50 flex justify-between items-center transition hover:shadow-md"
      >
        <div>
          <p class="font-semibold text-gray-900">
            {{
              authStore.isClient
                ? 'Tatuador: ' + (app.tattoo_artist?.name || 'N/A')
                : 'Cliente: ' + (app.client?.name || 'N/A')
            }}
          </p>
          <p class="text-sm text-gray-600">Fecha: {{ formatDateTime(app.scheduled_at) }}</p>
          <span
            :class="getStatusBadgeClass(app.status)"
            class="text-xs font-medium px-2.5 py-0.5 rounded-full mt-1 inline-block"
          >
            {{ app.status.toUpperCase() }}
          </span>
        </div>

        <div class="flex flex-col space-y-2">
          <router-link
            v-if="authStore.isClient && app.status === 'pending'"
            :to="{ name: 'PayAppointment', params: { id: app.id } }"
            class="py-1 px-3 rounded-lg text-sm font-bold text-white bg-green-600 hover:bg-green-700 text-center shadow-sm"
          >
            Pagar Depósito
          </router-link>

          <button
            v-if="authStore.isTattooArtist && app.status === 'pending'"
            @click="confirmAppointment(app.id)"
            class="py-1 px-3 rounded-lg text-sm bg-green-500 hover:bg-green-600 text-white font-semibold transition"
          >
            Confirmar
          </button>

          <button
            v-if="app.status === 'pending' || app.status === 'approved'"
            @click="openModificationModal(app)"
            class="py-1 px-3 rounded-lg text-sm bg-blue-500 hover:bg-blue-600 text-white font-semibold transition"
          >
            Modificar
          </button>

          <button
            v-if="app.status !== 'canceled'"
            @click="cancelAppointment(app.id)"
            class="py-1 px-3 rounded-lg text-sm bg-red-500 hover:bg-red-600 text-white font-semibold transition"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>

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
const router = useRouter() // Inicializado para el botón volver
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
    console.error('Error:', error)
  } finally {
    listLoading.value = false
  }
}

const confirmAppointment = async (id) => {
  try {
    await axios.post(`/appointments/${id}/confirm`)
    fetchAppointments()
  } catch (e) {
    alert('Error al confirmar')
  }
}

const cancelAppointment = async (id) => {
  if (!confirm('¿Cancelar cita?')) return
  try {
    await axios.patch(`/appointments/${id}/cancel`)
    fetchAppointments()
  } catch (e) {
    alert('Error al cancelar')
  }
}

const openModificationModal = (app) => {
  selectedAppointment.value = app
  isModificationModalOpen.value = true
}

const formatDateTime = (d) => new Date(d).toLocaleString()

const getStatusBadgeClass = (s) => {
  if (s === 'approved') return 'bg-green-100 text-green-800'
  if (s === 'canceled') return 'bg-red-100 text-red-800'
  return 'bg-yellow-100 text-yellow-800'
}

const getStatusBorderClass = (s) => {
  if (s === 'approved') return 'border-l-4 border-green-500'
  if (s === 'canceled') return 'border-l-4 border-red-500'
  return 'border-l-4 border-yellow-500'
}

onMounted(() => fetchAppointments())
</script>
