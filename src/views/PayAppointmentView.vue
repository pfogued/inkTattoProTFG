<script setup>
import { ref, onMounted } from 'vue'
import { loadStripe } from '@stripe/stripe-js'
import { useRouter, useRoute } from 'vue-router'
import axios from 'axios'

const router = useRouter()
const route = useRoute()

// Variables de estado
const appointmentId = route.params.id
const amount = ref(50)
const processing = ref(false)
const errorMessage = ref('')
const cardElement = ref(null)

let stripe = null
let elements = null

const stripePromise = loadStripe(
  'pk_test_51SjM6dFEByp3k6AXVE6FYv7JTBVTdEySiVykzQ3HILh7XpyPmAUKBvH1VAEipQhtmUfpLg3vCwcTiC3LFGDRLqTQ00G8EJ2DTj',
)

onMounted(async () => {
  stripe = await stripePromise
  elements = stripe.elements()

  cardElement.value = elements.create('card', {
    style: {
      base: {
        fontSize: '16px',
        color: '#32325d',
      },
    },
  })

  cardElement.value.mount('#card-element')
})

const handlePayment = async () => {
  processing.value = true
  errorMessage.value = ''

  try {
    // 1. Obtener el clientSecret desde Laravel
    // ELIMINADO EL '/api' inicial porque ya está en la baseURL del main.js
    const {
      data: { clientSecret },
    } = await axios.post('/payments/create-intent', {
      amount: amount.value,
      appointment_id: appointmentId,
    })

    // 2. Confirmar el pago con Stripe
    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement.value,
        billing_details: { name: 'Cliente InkTattoPro' },
      },
    })

    if (result.error) {
      errorMessage.value = result.error.message
    } else if (result.paymentIntent.status === 'succeeded') {
      // 3. Guardar en la DB local
      // ELIMINADO EL '/api' inicial también aquí
      await axios.post('/payments', {
        appointment_id: appointmentId,
        amount: amount.value,
        stripe_id: result.paymentIntent.id,
        status: 'completed',
      })

      alert('¡Pago de prueba realizado con éxito!')
      router.push('/app/payments')
    }
  } catch (error) {
    errorMessage.value = 'Error al conectar con el servidor.'
    console.error('Detalle del error:', error.response || error)
  } finally {
    processing.value = false
  }
}
</script>

<template>
  <div class="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md border border-gray-200 mt-10">
    <button @click="router.back()" class="text-sm text-indigo-600 mb-4 hover:underline">
      ← Volver
    </button>

    <h2 class="text-xl font-bold mb-4 text-gray-800">Finalizar Pago</h2>

    <div class="mb-6 p-4 bg-indigo-50 rounded-lg">
      <p class="text-sm text-indigo-700">Resumen del servicio (Cita #{{ appointmentId }})</p>
      <p class="text-2xl font-bold text-indigo-900">{{ amount }}€</p>
    </div>

    <div class="mb-4">
      <label class="block text-sm font-medium text-gray-700 mb-2">Datos de tarjeta</label>
      <div
        class="p-3 border rounded-md bg-white shadow-sm focus-within:ring-2 focus-within:ring-indigo-500"
      >
        <div id="card-element"></div>
      </div>
    </div>

    <p v-if="errorMessage" class="text-red-500 text-sm mb-4 bg-red-50 p-2 rounded">
      ⚠️ {{ errorMessage }}
    </p>

    <button
      @click="handlePayment"
      :disabled="processing"
      class="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50 transition-all shadow-lg active:scale-95 transform"
    >
      <span v-if="processing" class="flex items-center justify-center">
        <svg class="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24">
          <circle
            class="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="4"
          ></circle>
          <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        Procesando...
      </span>
      <span v-else>Confirmar y Pagar {{ amount }}€</span>
    </button>

    <div class="mt-6 border-t pt-4 text-center">
      <p class="text-xs text-gray-400">
        Usa la tarjeta <span class="font-bold">4242 4242 4242 4242</span> para pruebas.
      </p>
    </div>
  </div>
</template>
