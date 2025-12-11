<template>
  <!-- Modal de Reserva de Citas (RF-5) -->
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 overflow-y-auto"
    aria-labelledby="modal-title"
    role="dialog"
    aria-modal="true"
  >
    <div
      class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0"
    >
      <div
        class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
        aria-hidden="true"
        @click="$emit('close')"
      ></div>

      <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true"
        >&#8203;</span
      >

      <div
        class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-md sm:w-full"
      >
        <form @submit.prevent="submitAppointment">
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="mt-3 text-center sm:mt-0 sm:text-left w-full">
              <h3
                class="text-xl leading-6 font-medium text-gray-900 mb-4 border-b pb-2"
                id="modal-title"
              >
                Reservar Nueva Cita (RF-3)
              </h3>
              <div class="space-y-4">
                <!-- Tatuador (SELECTOR DINÁMICO) -->
                <div>
                  <label for="artistId" class="block text-sm font-medium text-gray-700"
                    >Seleccionar Tatuador</label
                  >
                  <select
                    id="artistId"
                    v-model="form.tattoo_artist_id"
                    required
                    :disabled="artistsLoading || artists.length === 0"
                    class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option :value="null" disabled>-- Seleccione un artista --</option>
                    <option v-if="artistsLoading" :value="null" disabled>
                      Cargando artistas...
                    </option>

                    <option v-for="artist in artists" :key="artist.id" :value="artist.id">
                      {{ artist.name }} (ID: {{ artist.id }})
                    </option>
                  </select>
                  <p
                    v-if="!artistsLoading && artists.length === 0"
                    class="text-xs text-red-500 mt-1"
                  >
                    No hay tatuadores disponibles.
                  </p>
                </div>

                <!-- Fecha y Hora -->
                <div>
                  <label for="scheduledAt" class="block text-sm font-medium text-gray-700"
                    >Fecha y Hora</label
                  >
                  <input
                    type="datetime-local"
                    id="scheduledAt"
                    v-model="form.scheduled_at"
                    required
                    class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <!-- Descripción -->
                <div>
                  <label for="description" class="block text-sm font-medium text-gray-700"
                    >Descripción del Tatuaje</label
                  >
                  <textarea
                    id="description"
                    v-model="form.description"
                    required
                    rows="3"
                    class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                  ></textarea>
                </div>

                <!-- Mensaje de Cita -->
                <p
                  v-if="appointmentMessage"
                  :class="messageClass"
                  class="text-center p-2 rounded-lg"
                >
                  {{ appointmentMessage }}
                </p>
              </div>
            </div>
          </div>

          <!-- Botones de Acción -->
          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="submit"
              :disabled="isLoading || artistsLoading || form.tattoo_artist_id === null"
              class="w-full inline-flex justify-center rounded-lg border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
            >
              <span v-if="isLoading">Procesando depósito...</span>
              <span v-else>Reservar y Pagar Depósito (50€)</span>
            </button>
            <button
              type="button"
              @click="$emit('close')"
              class="mt-3 w-full inline-flex justify-center rounded-lg border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 sm:mt-0 sm:w-auto sm:text-sm"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, ref, reactive, watch } from 'vue'
import axios from 'axios'

const props = defineProps({
  isOpen: { type: Boolean, required: true },
  artists: { type: Array, required: true },
  artistsLoading: { type: Boolean, required: true },
})

const emit = defineEmits(['close', 'appointment-booked'])

const isLoading = ref(false)
const appointmentMessage = ref('')
const messageClass = ref('')

const form = reactive({
  tattoo_artist_id: null,
  scheduled_at: '',
  description: '',
})

// Inicializar form.tattoo_artist_id con el primer artista disponible cuando la lista cargue
watch(
  () => props.artists,
  (newArtists) => {
    if (newArtists.length > 0) {
      form.tattoo_artist_id = newArtists[0].id
    } else {
      form.tattoo_artist_id = null
    }
  },
  { immediate: true },
)

// Reiniciar el mensaje al abrir/cerrar
watch(
  () => props.isOpen,
  (newVal) => {
    if (newVal) {
      appointmentMessage.value = ''
      form.scheduled_at = ''
      form.description = ''
    }
  },
)

const submitAppointment = async () => {
  isLoading.value = true
  appointmentMessage.value = ''
  messageClass.value = ''

  try {
    const response = await axios.post('/appointments', form)

    appointmentMessage.value = response.data.message
    messageClass.value = 'bg-green-100 text-green-700'

    // Notificar al componente padre que se reserve la cita y luego cerrar
    emit('appointment-booked')
    setTimeout(() => {
      emit('close')
    }, 1500)
  } catch (error) {
    let msg = 'Error desconocido al reservar.'
    if (error.response && error.response.data.message) {
      msg = error.response.data.message
    } else if (error.response && error.response.data.errors) {
      msg = Object.values(error.response.data.errors).flat().join(' ')
    }
    appointmentMessage.value = msg
    messageClass.value = 'bg-red-100 text-red-700'
  } finally {
    isLoading.value = false
  }
}
</script>
