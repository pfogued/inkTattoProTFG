<template>
  <!-- Modal del Editor de Anotaciones / Detalle del Diseño -->
  <div
    v-if="isOpen && design"
    class="fixed inset-0 z-50 overflow-y-auto"
    aria-labelledby="modal-title"
    role="dialog"
    aria-modal="true"
  >
    <div
      class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0"
    >
      <!-- Overlay de fondo -->
      <div
        class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
        aria-hidden="true"
        @click="$emit('close')"
      ></div>

      <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true"
        >&#8203;</span
      >

      <div
        class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full"
      >
        <div class="grid grid-cols-1 lg:grid-cols-3">
          <!-- Columna 1: Imagen del Diseño -->
          <div class="lg:col-span-2 bg-gray-100 p-2 flex items-center justify-center">
            <img
              :src="design.image_url"
              :alt="design.title"
              class="w-full h-auto object-contain max-h-[80vh]"
              onerror="this.onerror=null;this.src='https://placehold.co/800x600/cccccc/333333?text=Diseño+No+Cargado';"
            />
          </div>

          <!-- Columna 2: Detalles y Anotaciones (RF-10) -->
          <div class="lg:col-span-1 p-6 bg-white">
            <h3 class="text-2xl font-bold text-gray-900 mb-4">{{ design.title }}</h3>

            <p class="text-sm text-gray-600 mb-1">
              <span class="font-semibold">{{
                design.is_private ? 'Privado 🔒' : 'Público 🌍'
              }}</span>
              <span v-if="design.client_id"> - Cliente ID: {{ design.client_id }}</span>
            </p>
            <p class="text-sm text-gray-600 mb-1">
              Estilo: <span class="font-semibold">{{ design.style }}</span>
            </p>
            <p class="text-sm text-gray-500 mt-1">
              Subido por: {{ design.tattoo_artist?.name || 'Desconocido' }}
            </p>
            <p class="text-sm text-gray-700 border-t pt-3">
              {{ design.description || 'Sin descripción detallada.' }}
            </p>

            <div class="mt-6 border-t pt-4">
              <h4 class="text-lg font-semibold text-indigo-700 mb-2">
                Anotaciones del Cliente (RF-10)
              </h4>

              <!-- Si el usuario es Cliente y es el cliente asociado, le permitimos editar -->
              <div v-if="authStore.isClient && design.client_id === authStore.user.id">
                <textarea
                  v-model="annotationText"
                  rows="4"
                  placeholder="Escribe tus comentarios, cambios, o dudas sobre el diseño..."
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                ></textarea>

                <button
                  @click="saveAnnotation"
                  :disabled="isSaving"
                  class="mt-3 w-full py-2 px-4 rounded-lg text-sm font-medium text-white bg-green-600 hover:bg-green-700 disabled:opacity-50 transition"
                >
                  {{ isSaving ? 'Guardando...' : 'Guardar Anotación' }}
                </button>
                <p v-if="saveMessage" :class="messageClass" class="mt-2 text-center text-sm">
                  {{ saveMessage }}
                </p>
              </div>
              <!-- Si no es el cliente asociado o es Tatuador, solo mostramos la anotación -->
              <div v-else>
                <p
                  v-if="design.client_annotation"
                  class="p-3 bg-gray-100 rounded-lg text-gray-700 whitespace-pre-wrap"
                >
                  {{ design.client_annotation }}
                </p>
                <p v-else class="text-sm text-gray-500">
                  El cliente aún no ha añadido ninguna anotación.
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Botón de Cerrar -->
        <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
          <button
            type="button"
            @click="$emit('close')"
            class="mt-3 w-full inline-flex justify-center rounded-lg border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, ref, watch } from 'vue'
import { useAuthStore } from '../stores/auth'
import axios from 'axios'

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true,
  },
  design: {
    type: Object,
    default: null,
  },
})

const emit = defineEmits(['close', 'design-updated'])

const authStore = useAuthStore()
const isSaving = ref(false)
const annotationText = ref('')
const saveMessage = ref('')
const messageClass = ref('')

// Cargar la anotación existente del diseño cuando cambie la prop
watch(
  () => props.design,
  (newDesign) => {
    if (newDesign) {
      annotationText.value = newDesign.client_annotation || ''
      saveMessage.value = ''
    }
  },
  { immediate: true },
)

// Guardar anotación (RF-10) usando el endpoint real de la API
const saveAnnotation = async () => {
  if (!props.design) return

  isSaving.value = true
  saveMessage.value = ''

  try {
    // Llama al nuevo endpoint PATCH /designs/{id}/annotation
    const response = await axios.patch(`/designs/${props.design.id}/annotation`, {
      client_annotation: annotationText.value,
    })

    saveMessage.value = 'Anotación guardada con éxito.'
    messageClass.value = 'bg-green-100 text-green-700'

    // Notificar a la galería que el diseño ha sido actualizado
    emit('design-updated', response.data.design)
    // El componente padre (DesignGallery) se encarga de cerrar el modal o refrescar.
  } catch (e) {
    console.error('Error al guardar anotación:', e)
    let msg = 'Error al guardar. Verifica que seas el cliente asignado.'
    if (e.response && e.response.data.message) {
      msg = e.response.data.message
    }
    saveMessage.value = msg
    messageClass.value = 'bg-red-100 text-red-700'
  } finally {
    isSaving.value = false
    setTimeout(() => (saveMessage.value = ''), 3000)
  }
}
</script>
