<template>
  <div class="p-4 space-y-8">
    <!-- Encabezado de Bienvenida -->
    <header class="pb-4 border-b">
      <h1 class="text-3xl font-extrabold text-gray-900">
        Bienvenido, {{ authStore.user?.name || 'Tatuador' }}!
      </h1>
      <p class="mt-1 text-base text-gray-600">
        Aquí tienes un resumen de tu actividad y agenda (Mockup 8).
      </p>
    </header>

    <!-- Indicadores Clave -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <!-- Citas Hoy -->
      <div class="bg-white p-6 rounded-xl shadow-lg border-l-4 border-indigo-500">
        <p class="text-sm font-medium text-gray-500">Citas Hoy</p>
        <p class="text-3xl font-bold text-gray-900 mt-1">{{ summary.citasHoy }}</p>
      </div>

      <!-- Solicitudes Pendientes (RF-8: Notificaciones) -->
      <div class="bg-white p-6 rounded-xl shadow-lg border-l-4 border-yellow-500">
        <p class="text-sm font-medium text-gray-500">Solicitudes Pendientes</p>
        <p class="text-3xl font-bold text-gray-900 mt-1">{{ summary.pendientes }}</p>
      </div>

      <!-- Ingresos del Mes (RF-13: Resumen de pagos) -->
      <div class="bg-white p-6 rounded-xl shadow-lg border-l-4 border-green-500">
        <p class="text-sm font-medium text-gray-500">Ingresos del Mes</p>
        <p class="text-3xl font-bold text-gray-900 mt-1">{{ summary.ingresosMes }}€</p>
      </div>
    </div>

    <!-- Detalle de Citas y Acciones Rápidas -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Panel de Citas del Día (RF-8) -->
      <div class="lg:col-span-2 bg-white p-6 rounded-xl shadow-lg">
        <h3 class="text-xl font-semibold mb-4 border-b pb-2">Citas del Día</h3>

        <div v-if="appointmentsToday.length" class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead>
              <tr class="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <th class="px-6 py-3">Hora</th>
                <th class="px-6 py-3">Cliente</th>
                <th class="px-6 py-3">Tipo</th>
                <th class="px-6 py-3">Estado</th>
                <th class="px-6 py-3">Acciones</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="app in appointmentsToday" :key="app.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {{ app.time }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {{ app.clientName }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{{ app.type }}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="getStatusClass(app.status)">{{ app.status }}</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <button
                    @click="confirmAppointment(app.id)"
                    v-if="app.status === 'Pendiente'"
                    class="text-green-600 hover:text-green-900"
                  >
                    Confirmar
                  </button>
                  <button
                    @click="viewDetails(app.id)"
                    class="text-indigo-600 hover:text-indigo-900"
                  >
                    Ver
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p v-else class="text-gray-500">No hay citas programadas para hoy.</p>
      </div>

      <!-- Acciones Rápidas (Mockup 8) -->
      <div class="lg:col-span-1 bg-white p-6 rounded-xl shadow-lg h-full border border-gray-200">
        <h3 class="text-xl font-semibold mb-4 border-b pb-2">Acciones Rápidas</h3>
        <div class="space-y-4">
          <button
            @click="router.push({ name: 'Calendar' })"
            class="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          >
            + Ver Agenda Completa
          </button>
          <button
            @click="openAvailabilityModal"
            class="w-full py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition"
          >
            Establecer Disponibilidad (RF-8)
          </button>
          <button
            @click="router.push({ name: 'DesignGallery' })"
            class="w-full py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
          >
            + Subir Nuevo Diseño (RF-9)
          </button>
        </div>
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

// Resumen de indicadores (Mockup 8)
const summary = reactive({
  citasHoy: 0,
  pendientes: 0,
  ingresosMes: 0,
})

// Detalle de citas del día
const appointmentsToday = ref([])

// Datos simulados (Reemplazar con API de Laravel)
const mockAppointments = [
  { id: 1, time: '10:00', clientName: 'Marta López', type: 'Rosa', status: 'Confirmada' },
  { id: 2, time: '13:00', clientName: 'Carlos Ruiz', type: 'Frase', status: 'Pendiente' },
  { id: 3, time: '16:00', clientName: 'Pedro Sánchez', type: 'Tribales', status: 'Confirmada' },
]

const getStatusClass = (status) => {
  switch (status) {
    case 'Confirmada':
      return 'inline-flex px-2 text-xs font-semibold leading-5 rounded-full bg-green-100 text-green-800'
    case 'Pendiente':
      return 'inline-flex px-2 text-xs font-semibold leading-5 rounded-full bg-yellow-100 text-yellow-800'
    default:
      return 'inline-flex px-2 text-xs font-semibold leading-5 rounded-full bg-gray-100 text-gray-800'
  }
}

async function fetchDashboardData() {
  try {
    // En un entorno real, Laravel devolvería todos estos datos en una sola llamada optimizada
    // const response = await axios.get('/artist/dashboard/summary');

    // Simulación de datos
    appointmentsToday.value = mockAppointments

    summary.citasHoy = appointmentsToday.value.length
    summary.pendientes = appointmentsToday.value.filter((a) => a.status === 'Pendiente').length
    summary.ingresosMes = 3500 // Simulación del Mockup 8
  } catch (error) {
    console.error('Error al cargar datos del dashboard del tatuador:', error)
  }
}

// Lógica de confirmación de cita (CU-12)
async function confirmAppointment(id) {
  if (confirm('¿Estás seguro de confirmar esta cita?')) {
    try {
      await axios.post(`/appointments/${id}/confirm`)
      alert('Cita confirmada!')
      fetchDashboardData() // Recargar datos
    } catch (error) {
      alert('Error al confirmar la cita.')
    }
  }
}

// Lógica para establecer disponibilidad (RF-8)
function openAvailabilityModal() {
  alert('Funcionalidad pendiente: Abrir modal/vista de gestión de disponibilidad (RF-8)')
  // Aquí se redirigiría a una vista o se abriría un modal de gestión de horarios
}

function viewDetails(id) {
  alert(`Ver detalles de la cita #${id}`)
  // Aquí se abriría un modal para ver el diseño adjunto (RF-10) o los detalles completos.
}

onMounted(() => {
  fetchDashboardData()
})
</script>
