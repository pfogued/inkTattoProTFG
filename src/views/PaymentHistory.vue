<template>
  <div class="p-4 space-y-8 bg-white rounded-xl shadow-lg">
    <h1 class="text-3xl font-extrabold text-gray-900">Historial de Pagos (RF-13)</h1>
    <p class="text-gray-600">Consulta el estado de tus transacciones y recibos.</p>

    <!-- Botón de Resumen de Pagos (Solo para Tatuadores, RF-13) -->
    <div
      v-if="authStore.isTattooArtist"
      class="border p-4 rounded-xl bg-yellow-50 flex justify-between items-center"
    >
      <p class="font-medium text-gray-700">Generar resumen de pagos recibidos y pendientes.</p>
      <button
        @click="generateSummary"
        class="px-4 py-2 bg-yellow-600 text-white rounded-xl hover:bg-yellow-700 transition"
      >
        Generar Reporte
      </button>
    </div>

    <!-- Tabla de Historial -->
    <div class="overflow-hidden border border-gray-200 rounded-xl">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr class="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            <th class="px-6 py-3">ID Cita</th>
            <th class="px-6 py-3">Fecha</th>
            <th class="px-6 py-3">Monto</th>
            <th class="px-6 py-3">Método</th>
            <th class="px-6 py-3">Estado</th>
            <th class="px-6 py-3">Acciones</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="payment in payments" :key="payment.id" class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {{ payment.appointment_id }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{{ payment.date }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">{{ payment.amount }}€</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{{ payment.method }}</td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span :class="getStatusClass(payment.status)">{{ payment.status }}</span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
              <button
                @click="downloadReceipt(payment.id)"
                class="text-indigo-600 hover:text-indigo-900"
              >
                Recibo
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()
const payments = ref([])

// Datos simulados (Reemplazar con la llamada a la API que filtra por rol)
const mockPayments = [
  {
    id: 1,
    appointment_id: 101,
    date: '2025-05-01',
    amount: 50,
    method: 'Stripe',
    status: 'Completado',
  },
  {
    id: 2,
    appointment_id: 102,
    date: '2025-04-15',
    amount: 50,
    method: 'Stripe',
    status: 'Completado',
  },
  {
    id: 3,
    appointment_id: 103,
    date: '2025-06-01',
    amount: 20,
    method: 'Transferencia',
    status: 'Pendiente',
  },
  {
    id: 4,
    appointment_id: 104,
    date: '2025-03-20',
    amount: 100,
    method: 'Efectivo',
    status: 'Completado',
  },
]

const getStatusClass = (status) => {
  switch (status) {
    case 'Completado':
      return 'inline-flex px-2 text-xs font-semibold leading-5 rounded-full bg-green-100 text-green-800'
    case 'Pendiente':
      return 'inline-flex px-2 text-xs font-semibold leading-5 rounded-full bg-yellow-100 text-yellow-800'
    default:
      return 'inline-flex px-2 text-xs font-semibold leading-5 rounded-full bg-red-100 text-red-800'
  }
}

async function fetchPayments() {
  try {
    // En un entorno real, Laravel filtraría los datos basándose en el rol
    // Si eres Tatuador, verías todos los mockPayments
    // Si eres Cliente, verías solo los pagos asociados a tu ID

    // const response = await axios.get(`/payments?role=${authStore.userRole}`);
    // payments.value = response.data;

    payments.value = mockPayments
  } catch (error) {
    console.error('Error al cargar historial de pagos:', error)
  }
}

// RF-13: Generar resumen de pagos (solo para Tatuadores)
function generateSummary() {
  alert('Función de generar reporte de pagos activada. Laravel generaría un PDF/CSV aquí (RF-13).')
}

function downloadReceipt(id) {
  alert(`Función para descargar el recibo #${id} (RF-13).`)
  // Aquí se haría una llamada a la API para obtener el PDF del recibo
}

onMounted(() => {
  fetchPayments()
})
</script>
