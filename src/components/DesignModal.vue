<template>
  <!-- Modal para Subir/Editar Diseño o Anotación (RF-9, RF-10) -->
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
        @click="$emit('close')"
      ></div>
      <span class="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>

      <div
        class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-md sm:w-full"
      >
        <form @submit.prevent="submitDesign">
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <h3 class="text-xl font-medium text-gray-900 mb-4 border-b pb-2">
              {{ isEditing ? 'Editar Diseño / Nota (RF-10)' : 'Subir Nuevo Diseño (RF-9)' }}
            </h3>

            <div class="space-y-4">
              <!-- Título (Solo para creación o edición básica) -->
              <div v-if="!isEditing || authStore.isTattooArtist">
                <label for="title" class="block text-sm font-medium text-gray-700"
                  >Título del Diseño</label
                >
                <input
                  type="text"
                  id="title"
                  v-model="form.title"
                  required
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>

              <!-- Descripción -->
              <div v-if="!isEditing || authStore.isTattooArtist">
                <label for="description" class="block text-sm font-medium text-gray-700"
                  >Descripción</label
                >
                <textarea
                  id="description"
                  v-model="form.description"
                  rows="2"
                  required
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg"
                ></textarea>
              </div>

              <!-- Anotación (RF-10, Solo para Tatuador) -->
              <div v-if="authStore.isTattooArtist">
                <label for="annotation" class="block text-sm font-medium text-gray-700"
                  >Anotación Privada (RF-10)</label
                >
                <textarea
                  id="annotation"
                  v-model="form.annotation"
                  rows="2"
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg"
                ></textarea>
                <p class="text-xs text-gray-500">
                  Notas internas sobre el estilo, dificultad o precio estimado.
                </p>
              </div>
            </div>

            <p v-if="message" :class="messageClass" class="text-center p-2 rounded-lg mt-4">
              {{ message }}
            </p>
          </div>

          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="submit"
              :disabled="isLoading"
              class="w-full inline-flex justify-center rounded-lg border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
            >
              <span v-if="isLoading">Guardando...</span>
              <span v-else>Guardar Diseño</span>
            </button>
            <button
              type="button"
              @click="$emit('close')"
              class="mt-3 w-full inline-flex justify-center rounded-lg border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 sm:mt-0 sm:w-auto sm:text-sm"
            >
              Cerrar
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, ref, reactive, watch, computed } from 'vue'
import axios from 'axios'
import { useAuthStore } from '../stores/auth'

const props = defineProps({
  isOpen: Boolean,
  design: Object, // El objeto de diseño a editar
})
const emit = defineEmits(['close', 'design-updated'])

const authStore = useAuthStore()
const isLoading = ref(false)
const message = ref('')
const messageClass = ref('')

const form = reactive({
  title: '',
  description: '',
  annotation: '',
})

const isEditing = computed(() => !!props.design)

watch(
  () => props.design,
  (newDesign) => {
    if (newDesign) {
      form.title = newDesign.title || ''
      form.description = newDesign.description || ''
      form.annotation = newDesign.annotation || ''
    } else {
      form.title = ''
      form.description = ''
      form.annotation = ''
    }
    message.value = ''
  },
  { immediate: true },
)

const submitDesign = async () => {
  isLoading.value = true
  message.value = ''
  messageClass.value = ''

  try {
    let response

    if (isEditing.value) {
      // Editar (PATCH)
      const dataToSend = {
        title: form.title,
        description: form.description,
        annotation: authStore.isTattooArtist ? form.annotation : undefined,
      }

      response = await axios.patch(`/designs/${props.design.id}/annotation`, dataToSend)
    } else {
      // Crear (POST)
      response = await axios.post('/designs', form)
    }

    message.value = response.data.message || 'Operación exitosa.'
    messageClass.value = 'bg-green-100 text-green-700'

    emit('design-updated')

    setTimeout(() => {
      emit('close')
    }, 1500)
  } catch (error) {
    let msg = 'Error desconocido al guardar.'
    if (error.response?.data?.errors) {
      msg = Object.values(error.response.data.errors).flat().join(' ')
    } else if (error.response?.data?.message) {
      msg = error.response.data.message
    }
    message.value = msg
    messageClass.value = 'bg-red-100 text-red-700'
  } finally {
    isLoading.value = false
  }
}
</script>
