<script setup>
import { ref, onMounted } from 'vue'
import { loadStripe } from '@stripe/stripe-js'
import { useRouter, useRoute } from 'vue-router'
import axios from 'axios'
// IMPORTAMOS TU COMPONENTE
import ConfirmModal from '../components/ConfirmModal.vue'

const router = useRouter()
const route = useRoute()

// Estado del Modal
const isModalOpen = ref(false)
const modalTitle = ref('')
const modalMessage = ref('')

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
    style: { base: { fontSize: '16px', color: '#32325d' } },
  })
  cardElement.value.mount('#card-element')
})

// Esta función ahora solo abre tu modal
const triggerPayment = () => {
  modalTitle.value = 'Confirmar Pago'
  modalMessage.value = `¿Estás seguro de realizar el pago del depósito de ${amount.value}€?`
  isModalOpen.value = true
}

// Esta es la función que realmente paga cuando pulsas "Confirmar" en el modal
const handlePayment = async () => {
  isModalOpen.value = false // Cerramos el modal para empezar a procesar
  processing.value = true
  errorMessage.value = ''

  try {
    const {
      data: { clientSecret },
    } = await axios.post('/payments/create-intent', {
      amount: amount.value,
      appointment_id: appointmentId,
    })

    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement.value,
        billing_details: { name: 'Cliente InkTattoPro' },
      },
    })

    if (result.error) {
      errorMessage.value = result.error.message
    } else if (result.paymentIntent.status === 'succeeded') {
      await axios.post('/payments', {
        appointment_id: appointmentId,
        amount: amount.value,
        stripe_id: result.paymentIntent.id,
        status: 'completed',
      })

      // En lugar de alert, redirigimos directamente o podrías abrir otro modal de éxito
      router.push('/app/payments')
    }
  } catch (error) {
    errorMessage.value = 'Error al conectar con el servidor.'
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
      @click="triggerPayment"
      :disabled="processing"
      class="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50 transition-all shadow-lg active:scale-95 transform"
    >
      <span v-if="processing">Procesando...</span>
      <span v-else>Confirmar y Pagar {{ amount }}€</span>
    </button>

    <ConfirmModal
      :isOpen="isModalOpen"
      :title="modalTitle"
      :message="modalMessage"
      @close="isModalOpen = false"
      @confirm="handlePayment"
    />
  </div>
</template>
