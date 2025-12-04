<template>
  <div class="p-6 border border-indigo-200 bg-indigo-50 rounded-xl text-center space-y-4">
    <h3 class="text-xl font-semibold text-indigo-800">Confirmación de Reserva</h3>
    <p class="text-gray-700">
      Se requiere un depósito de **{{ amount }}€** para confirmar tu cita.
    </p>

    <button
      @click="startCheckout"
      :disabled="isLoading"
      class="w-full py-3 px-4 bg-green-600 text-white rounded-xl hover:bg-green-700 disabled:opacity-50 transition duration-150"
    >
      <span v-if="isLoading">Procesando pago...</span>
      <span v-else>Pagar {{ amount }}€ con Tarjeta (Stripe)</span>
    </button>

    <p v-if="error" class="text-red-600 text-sm">{{ error }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'

const props = defineProps({
  appointmentId: { type: [Number, String], required: true },
  amount: { type: Number, default: 50 },
})

const isLoading = ref(false)
const error = ref(null)

// RF-12: Iniciar el proceso de pago con Stripe
async function startCheckout() {
  isLoading.value = true
  error.value = null

  try {
    // 1. Llamada a la API de Laravel para crear la sesión de Stripe (RF-12)
    // Laravel debe devolver una URL de Stripe Checkout
    const response = await axios.post('/payments/create-checkout-session', {
      appointment_id: props.appointmentId,
      amount: props.amount,
    })

    const { stripe_url } = response.data

    // 2. Redirección a la pasarela segura (RF-12)
    if (stripe_url) {
      // Esto redirigirá al usuario fuera de la aplicación para pagar
      window.location.href = stripe_url
    } else {
      error.value = 'Error interno: No se recibió la URL de Stripe.'
    }
  } catch (err) {
    // Manejo de error si la conexión falla o el servidor de Laravel rechaza la petición
    error.value = err.response?.data?.message || 'Error al conectar con el servidor de pagos.'
  } finally {
    isLoading.value = false
  }
}
</script>
