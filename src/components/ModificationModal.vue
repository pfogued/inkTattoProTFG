<template>
  <!-- Modal de Modificación de Cita (RF-7) -->
  <div
    v-if="isOpen && localAppointment"
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
        class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
      >
        <form @submit.prevent="submitModification">
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                <h3 class="text-xl leading-6 font-medium text-gray-900" id="modal-title">
                  Modificar Cita #{{ localAppointment.id }}
                </h3>
                <div class="mt-4 space-y-4">
                  <!-- Fecha y Hora -->
                  <div>
                    <label for="scheduledAt" class="block text-sm font-medium text-gray-700"
                      >Nueva Fecha y Hora</label
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
                    v-if="modificationMessage"
                    :class="messageClass"
                    class="text-center p-3 rounded-lg"
                  >
                    {{ modificationMessage }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Botones de Acción -->
          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="submit"
              :disabled="isLoading"
              class="w-full inline-flex justify-center rounded-lg border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
            >
              <span v-if="isLoading">Guardando...</span>
              <span v-else>Guardar Cambios (RF-7)</span>
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
  appointment: { type: Object, default: null }, // La cita a modificar
})
const emit = defineEmits(['close', 'appointment-updated'])

const localAppointment = ref(null)
const isLoading = ref(false)
const modificationMessage = ref('')
const messageClass = ref('')

const form = reactive({
  scheduled_at: '',
  description: '',
})

// Watcher para inicializar el formulario cuando se abre el modal
watch(
  () => props.appointment,
  (newApp) => {
    if (newApp) {
      localAppointment.value = newApp
      // Convertir la fecha ISO a formato datetime-local
      const date = new Date(newApp.scheduled_at)
      const isoDate = date.toISOString().substring(0, 16)

      form.scheduled_at = isoDate
      form.description = newApp.description
      modificationMessage.value = ''
    }
  },
  { immediate: true },
)

const submitModification = async () => {
  if (!localAppointment.value) return

  isLoading.value = true
  modificationMessage.value = ''
  messageClass.value = ''

  try {
    // Llama al endpoint PUT /appointments/{id}
    const response = await axios.put(`/appointments/${localAppointment.value.id}`, form)

    modificationMessage.value = response.data.message
    messageClass.value = 'bg-green-100 text-green-700'

    // Emitir evento para que la vista principal refresque los datos
    emit('appointment-updated')

    setTimeout(() => {
      emit('close')
    }, 1500)
  } catch (error) {
    let msg = 'Error desconocido al actualizar.'
    if (error.response && error.response.data.message) {
      msg = error.response.data.message
    } else if (error.response && error.response.data.errors) {
      msg = Object.values(error.response.data.errors).flat().join(' ')
    }
    modificationMessage.value = msg
    messageClass.value = 'bg-red-100 text-red-700'
  } finally {
    isLoading.value = false
  }
}
</script>
