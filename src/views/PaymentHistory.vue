<template>
  <div class="container mx-auto p-4 sm:p-6 lg:p-8">
    <div class="bg-white shadow-xl rounded-xl p-6 mb-8">
      <h1 class="text-3xl font-extrabold text-gray-900 mb-2">
        Historial de Pagos y Depósitos (RF-13)
      </h1>
      <p class="text-gray-500">
        {{
          authStore.isClient
            ? 'Aquí puedes ver el detalle de los depósitos realizados para tus citas.'
            : 'Resumen de ingresos por depósitos recibidos de tus clientes.'
        }}
      </p>
    </div>

    <div class="bg-white p-6 shadow-lg rounded-xl">
      <div v-if="loading" class="text-center py-10 text-gray-500">
        Cargando historial de pagos...
      </div>
      <div v-else-if="payments.length === 0" class="text-center py-10 text-gray-500">
        No se encontraron transacciones en tu historial.
      </div>
      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th
                class="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Fecha
              </th>
              <th
                class="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Monto
              </th>
              <th
                v-if="authStore.isTattooArtist"
                class="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Cliente
              </th>
              <th
                class="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Tipo
              </th>
              <th
                class="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Estado
              </th>
              <th
                class="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Detalle Cita
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="payment in payments" :key="payment.id">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ formatDateTime(payment.created_at) }}
              </td>
              <td
                class="px-6 py-4 whitespace-nowrap text-sm font-bold"
                :class="getAmountClass(payment.amount)"
              >
                {{ formatCurrency(payment.amount) }}
              </td>
              <td
                v-if="authStore.isTattooArtist"
                class="px-6 py-4 whitespace-nowrap text-sm text-gray-700"
              >
                {{ payment.client?.name || 'N/A' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700 capitalize">
                {{ payment.type }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  :class="getStatusBadgeClass(payment.status)"
                  class="text-xs font-medium px-2.5 py-0.5 rounded-full capitalize"
                >
                  {{ payment.status }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ payment.appointment ? `Cita ID: ${payment.appointment.id}` : 'Sin Cita' }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()
const payments = ref([])
const loading = ref(true)

const fetchPayments = async () => {
  loading.value = true
  try {
    // Llama al nuevo endpoint /payments (RF-13)
    const response = await axios.get('/payments')
    payments.value = response.data.payments
  } catch (error) {
    console.error('Error al cargar historial de pagos:', error)
    payments.value = []
  } finally {
    loading.value = false
  }
}

const formatDateTime = (datetime) => {
  return new Date(datetime).toLocaleString()
}

const formatCurrency = (amount) => {
  // Formato de moneda en Euros
  return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(amount)
}

const getStatusBadgeClass = (status) => {
  switch (status) {
    case 'completed':
      return 'bg-green-100 text-green-800'
    case 'pending':
      return 'bg-yellow-100 text-yellow-800'
    case 'failed':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const getAmountClass = (amount) => {
  // Para destacar si es un ingreso (positivo)
  return amount > 0 ? 'text-green-600 font-bold' : 'text-gray-600'
}

onMounted(() => {
  fetchPayments()
})
</script>
