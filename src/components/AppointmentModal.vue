<template>
  <!-- Este es el modal principal que se controla con la prop 'isOpen' -->
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 overflow-y-auto bg-gray-600 bg-opacity-75 flex items-center justify-center p-4"
  >
    <div class="bg-white rounded-lg shadow-2xl w-full max-w-2xl p-6">
      <div class="flex justify-between items-center border-b pb-3 mb-4">
        <h3 class="text-2xl font-semibold text-gray-800">
          Reserva tu Cita (Paso {{ currentStep }}/4)
        </h3>
        <button @click="$emit('close')" class="text-gray-400 text-3xl hover:text-gray-600">
          &times;
        </button>
      </div>

      <!-- Barra de Progreso (Mockup 4) -->
      <div class="mb-6">
        <div class="w-full bg-gray-200 rounded-full h-2.5">
          <div
            class="bg-indigo-600 h-2.5 rounded-full transition-all duration-500"
            :style="{ width: progressPercentage }"
          ></div>
        </div>
        <div class="flex justify-between text-xs mt-2 text-gray-500 font-medium">
          <span :class="{ 'text-indigo-600': currentStep >= 1 }">1. Tatuador</span>
          <span :class="{ 'text-indigo-600': currentStep >= 2 }">2. Fecha y hora</span>
          <span :class="{ 'text-indigo-600': currentStep >= 3 }">3. Detalles</span>
          <span :class="{ 'text-indigo-600': currentStep >= 4 }">4. Confirmación</span>
        </div>
      </div>

      <!-- Contenido de los Pasos -->
      <form @submit.prevent="nextStep">
        <!-- PASO 1: Selección de Tatuador (Mockup 4) -->
        <div v-if="currentStep === 1" class="space-y-4">
          <h4 class="text-lg font-medium mb-4">Selecciona un Tatuador</h4>
          <div class="grid grid-cols-2 gap-4">
            <label
              v-for="artist in artists"
              :key="artist.id"
              :class="{
                'border-indigo-500 ring-2 ring-indigo-500 bg-indigo-50':
                  form.tattooArtistId === artist.id,
              }"
              class="p-4 border border-gray-300 rounded-xl cursor-pointer transition hover:shadow-md"
            >
              <input type="radio" :value="artist.id" v-model="form.tattooArtistId" class="hidden" />
              <p class="font-bold text-gray-800">{{ artist.name }}</p>
              <p class="text-sm text-gray-600">{{ artist.specialty }}</p>
            </label>
          </div>
          <p class="text-sm text-gray-500 mt-4">Solo puedes reservar con tatuadores disponibles.</p>
        </div>

        <!-- PASO 2: Fecha y Hora (RF-5, RF-6) -->
        <div v-else-if="currentStep === 2" class="space-y-4">
          <h4 class="text-lg font-medium mb-4">Selecciona Fecha y Hora</h4>
          <input
            type="date"
            v-model="form.date"
            required
            @change="checkAvailability"
            class="w-full p-3 border border-gray-300 rounded-xl focus:ring-indigo-500 focus:border-indigo-500"
          />
          <input
            type="time"
            v-model="form.time"
            required
            @change="checkAvailability"
            class="w-full p-3 border border-gray-300 rounded-xl focus:ring-indigo-500 focus:border-indigo-500"
          />

          <!-- Mensaje de Disponibilidad (RF-6) -->
          <div
            v-if="availabilityMessage"
            :class="
              availabilityMessage.type === 'error'
                ? 'text-red-600 bg-red-100 border-red-300'
                : 'text-green-600 bg-green-100 border-green-300'
            "
            class="p-3 border rounded-lg text-sm"
          >
            {{ availabilityMessage.text }}
          </div>
        </div>

        <!-- PASO 3: Detalles (RF-14) -->
        <div v-else-if="currentStep === 3" class="space-y-4">
          <h4 class="text-lg font-medium mb-4">Detalles y Comentarios</h4>
          <textarea
            v-model="form.details"
            placeholder="Descripción del tatuaje, tamaño aproximado, ubicación..."
            rows="4"
            class="w-full p-3 border border-gray-300 rounded-xl focus:ring-indigo-500 focus:border-indigo-500"
            minlength="20"
            required
          ></textarea>
          <p class="text-sm text-gray-500">Mínimo 20 caracteres.</p>
        </div>

        <!-- PASO 4: Confirmación y Pago (RF-12) -->
        <div v-else-if="currentStep === 4" class="space-y-6">
          <h4 class="text-lg font-medium mb-4">Resumen y Pago</h4>
          <div class="p-4 bg-gray-50 rounded-lg border border-gray-300 space-y-2">
            <p><strong>Tatuador:</strong> {{ selectedArtistName }}</p>
            <p><strong>Fecha/Hora:</strong> {{ form.date }} a las {{ form.time }}</p>
            <p><strong>Detalles:</strong> {{ form.details.substring(0, 100) }}...</p>
            <p class="mt-4 text-xl font-bold text-red-600">Depósito Requerido: 50€</p>
          </div>

          <!-- Componente de Pago (RF-12) -->
          <StripeCheckout :appointment-id="0" :amount="50" />
        </div>

        <!-- Controles del Navegador (Mockup 4) -->
        <div class="mt-6 flex justify-between border-t pt-4">
          <button
            type="button"
            @click="prevStep"
            class="px-4 py-2 border rounded-xl text-gray-700 bg-gray-100 hover:bg-gray-200 transition disabled:opacity-50"
            :disabled="currentStep === 1"
          >
            ← Anterior
          </button>

          <button
            v-if="currentStep < 4"
            type="submit"
            class="px-4 py-2 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition disabled:opacity-50"
            :disabled="!isStepValid"
          >
            Siguiente →
          </button>

          <!-- En el paso 4, el botón es el de pago (StripeCheckout) -->
          <button
            v-else
            type="button"
            @click="$emit('close')"
            class="px-4 py-2 bg-gray-400 text-white font-bold rounded-xl hover:bg-gray-500 transition"
          >
            Cerrar
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue'
import axios from 'axios'
import StripeCheckout from './StripeCheckout.vue' // Componente de pago (RF-12)

const props = defineProps({
  isOpen: Boolean,
})

const emit = defineEmits(['close', 'save-appointment'])

// Estado de la reserva
const currentStep = ref(1)
const availabilityMessage = ref(null)

const form = reactive({
  tattooArtistId: null,
  date: '',
  time: '',
  details: '',
})

// Datos simulados
const artists = [
  { id: 1, name: 'Carlos (Tatuador)', specialty: 'Realismo' },
  { id: 2, name: 'Ana (Tatuadora)', specialty: 'Tradicional' },
]

// Computed Properties
const progressPercentage = computed(() => (currentStep.value / 4) * 100 + '%')
const selectedArtistName = computed(() => {
  const artist = artists.find((a) => a.id === form.tattooArtistId)
  return artist ? artist.name : 'No seleccionado'
})

const isStepValid = computed(() => {
  // Validación de pasos (RF-14)
  if (currentStep.value === 1) return !!form.tattooArtistId
  if (currentStep.value === 2)
    return form.date && form.time && availabilityMessage.value?.type === 'success'
  if (currentStep.value === 3) return form.details.length >= 20
  return true
})

// Watchers para resetear o verificar
watch(
  () => props.isOpen,
  (newVal) => {
    if (newVal) {
      currentStep.value = 1
      // Opcional: Resetear form aquí
    }
  },
)

watch([() => form.date, () => form.time, () => form.tattooArtistId], () => {
  if (currentStep.value === 2) {
    checkAvailability() // Re-validar si cambia la fecha/hora
  }
})

// Métodos
function nextStep() {
  if (currentStep.value < 4 && isStepValid.value) {
    currentStep.value++
  }
}

function prevStep() {
  if (currentStep.value > 1) {
    currentStep.value--
  } else {
    emit('close')
  }
}

// RF-6: El sistema debe evitar que dos citas se solapen
async function checkAvailability() {
  if (!form.tattooArtistId || !form.date || !form.time) {
    availabilityMessage.value = null
    return
  }

  availabilityMessage.value = { text: 'Verificando disponibilidad...', type: 'info' }

  try {
    // 1. Llamada al endpoint de Laravel para validar (RF-6)
    // const response = await axios.post('/appointments/check-availability', form);

    // SIMULACIÓN: Siempre disponible si es un futuro (Para que el front avance)
    const now = new Date()
    const selectedDate = new Date(`${form.date}T${form.time}:00`)

    if (selectedDate < now) {
      availabilityMessage.value = {
        text: '¡ERROR! No puedes reservar en el pasado.',
        type: 'error',
      }
    } else {
      // Asumiendo que Laravel valida y devuelve éxito
      availabilityMessage.value = {
        text: '¡Horario disponible! Puedes continuar.',
        type: 'success',
      }
    }
  } catch (error) {
    availabilityMessage.value = {
      text: 'Horario no disponible. Conflicto con otra cita.',
      type: 'error',
    }
  }
}
</script>
