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
        :class="[
          getStatusBorderClass(app.status),
          isPast(app.scheduled_at) || app.status.toLowerCase() === 'canceled'
            ? 'opacity-60 bg-gray-100 grayscale-[0.5]'
            : 'bg-gray-50',
        ]"
        class="p-4 border rounded-lg shadow-sm flex justify-between items-center transition hover:shadow-md"
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
            class="text-xs font-bold px-2.5 py-0.5 rounded-full mt-1 inline-block uppercase tracking-wider"
          >
            {{ translateStatus(app.status) }}
          </span>
          <p
            v-if="isPast(app.scheduled_at) && app.status.toLowerCase() !== 'canceled'"
            class="text-[10px] text-gray-400 font-bold mt-1 uppercase"
          >
            ✓ Historial / Pasada
          </p>
        </div>

        <div class="flex flex-col space-y-2">
          <template v-if="!isPast(app.scheduled_at) && app.status.toLowerCase() !== 'canceled'">
            <router-link
              v-if="authStore.isClient && app.status.toLowerCase() === 'pending'"
              :to="{ name: 'PayAppointment', params: { id: app.id } }"
              class="py-1 px-3 rounded-lg text-sm font-bold text-white bg-green-600 hover:bg-green-700 text-center shadow-sm"
            >
              Pagar Depósito
            </router-link>

            <button
              v-if="authStore.isTattooArtist && app.status.toLowerCase() === 'pending'"
              @click="triggerAction(app.id, 'confirm')"
              class="py-1 px-3 rounded-lg text-sm bg-green-500 hover:bg-green-600 text-white font-semibold transition"
            >
              Confirmar
            </button>

            <button
              v-if="
                app.status.toLowerCase() === 'pending' || app.status.toLowerCase() === 'approved'
              "
              @click="openModificationModal(app)"
              class="py-1 px-3 rounded-lg text-sm bg-blue-500 hover:bg-blue-600 text-white font-semibold transition"
            >
              Modificar
            </button>

            <button
              @click="triggerAction(app.id, 'cancel')"
              class="py-1 px-3 rounded-lg text-sm bg-red-500 hover:bg-red-600 text-white font-semibold transition"
            >
              Cancelar
            </button>
          </template>

          <div v-else class="text-xs text-gray-400 italic text-right">Sin acciones</div>
        </div>
      </div>
    </div>

    <ModificationModal
      :is-open="isModificationModalOpen"
      :appointment="selectedAppointment"
      @close="isModificationModalOpen = false"
      @appointment-updated="fetchAppointments"
    />

    <ConfirmModal
      :is-open="isConfirmModalOpen"
      :title="modalContent.title"
      :message="modalContent.message"
      @close="isConfirmModalOpen = false"
      @confirm="executeAction"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { useAuthStore } from '../stores/auth'
import ModificationModal from '../components/ModificationModal.vue'
import ConfirmModal from '../components/ConfirmModal.vue'

const authStore = useAuthStore()
const router = useRouter()

const appointments = ref([])
const listLoading = ref(true)
const isModificationModalOpen = ref(false)
const selectedAppointment = ref(null)
const isConfirmModalOpen = ref(false)
const activeAppointmentId = ref(null)
const activeAction = ref('')
const modalContent = reactive({ title: '', message: '' })

// NUEVA FUNCIÓN DE APOYO
const isPast = (date) => {
  if (!date) return false
  return new Date(date) < new Date()
}

const translateStatus = (status) => {
  if (!status) return 'Desconocido'
  const s = status.toLowerCase().trim()
  const translations = { pending: 'Pendiente', approved: 'Confirmada', canceled: 'Cancelada' }
  return translations[s] || status
}

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

const triggerAction = (id, type) => {
  activeAppointmentId.value = id
  activeAction.value = type
  if (type === 'confirm') {
    modalContent.title = '¿Confirmar Cita?'
    modalContent.message = 'Al confirmar, el cliente recibirá el aviso para realizar el pago.'
  } else {
    modalContent.title = '¿Cancelar Cita?'
    modalContent.message = 'Esta acción no se puede deshacer.'
  }
  isConfirmModalOpen.value = true
}

const executeAction = async () => {
  isConfirmModalOpen.value = false
  if (activeAction.value === 'confirm') {
    try {
      await axios.post(`/appointments/${activeAppointmentId.value}/confirm`)
      fetchAppointments()
    } catch (e) {
      console.error('Error al confirmar')
    }
  } else if (activeAction.value === 'cancel') {
    try {
      await axios.patch(`/appointments/${activeAppointmentId.value}/cancel`)
      fetchAppointments()
    } catch (e) {
      console.error('Error al cancelar')
    }
  }
}

const openModificationModal = (app) => {
  selectedAppointment.value = app
  isModificationModalOpen.value = true
}

const formatDateTime = (d) => new Date(d).toLocaleString('es-ES')

const getStatusBadgeClass = (s) => {
  if (!s) return 'bg-gray-100 text-gray-800'
  const status = s.toLowerCase().trim()
  if (status === 'approved') return 'bg-green-100 text-green-800'
  if (status === 'canceled') return 'bg-red-100 text-red-800'
  return 'bg-yellow-100 text-yellow-800'
}

const getStatusBorderClass = (s) => {
  if (!s) return 'border-l-4 border-gray-500'
  const status = s.toLowerCase().trim()
  if (status === 'approved') return 'border-l-4 border-green-500'
  if (status === 'canceled') return 'border-l-4 border-red-500'
  return 'border-l-4 border-yellow-500'
}

onMounted(() => fetchAppointments())
</script>
