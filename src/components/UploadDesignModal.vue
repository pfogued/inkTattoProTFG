<template>
  <!-- Modal de Subida de Diseño -->
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
      <!-- Overlay de fondo -->
      <div
        class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
        aria-hidden="true"
        @click="closeModal"
      ></div>

      <!-- Contenedor principal del modal -->
      <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true"
        >&#8203;</span
      >

      <div
        class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
      >
        <form @submit.prevent="handleDesignUpload">
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                <h3 class="text-xl leading-6 font-medium text-gray-900" id="modal-title">
                  Subir Diseño a Portafolio (RF-8)
                </h3>
                <div class="mt-4 space-y-4">
                  <!-- Título -->
                  <div>
                    <label for="title" class="block text-sm font-medium text-gray-700"
                      >Título del Diseño</label
                    >
                    <input
                      type="text"
                      id="title"
                      v-model="form.title"
                      required
                      class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>

                  <!-- URL de la Imagen -->
                  <div>
                    <label for="imageUrl" class="block text-sm font-medium text-gray-700"
                      >URL de la Imagen (Link Directo)</label
                    >
                    <input
                      type="url"
                      id="imageUrl"
                      v-model="form.image_url"
                      required
                      class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Ej: https://i.imgur.com/mibonito.jpg"
                    />
                  </div>

                  <!-- Estilo -->
                  <div>
                    <label for="style" class="block text-sm font-medium text-gray-700"
                      >Estilo del Tatuaje</label
                    >
                    <select
                      id="style"
                      v-model="form.style"
                      required
                      class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="traditional">Traditional</option>
                      <option value="watercolor">Watercolor</option>
                      <option value="blackwork">Blackwork</option>
                      <option value="geometric">Geometric</option>
                      <option value="other">Otro</option>
                    </select>
                  </div>

                  <!-- CLIENTE ASOCIADO (SELECT DINÁMICO) -->
                  <div>
                    <label for="clientId" class="block text-sm font-medium text-gray-700"
                      >Cliente Asociado (Opcional)</label
                    >
                    <select
                      id="clientId"
                      v-model="form.client_id"
                      class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                      :disabled="clientLoading"
                    >
                      <option :value="null" disabled>-- Seleccione un cliente --</option>
                      <option :value="null">Diseño Público (Sin cliente asociado)</option>
                      <option v-if="clientLoading" :value="null" disabled>
                        Cargando clientes...
                      </option>
                      <option
                        v-for="client in associatedClients"
                        :key="client.id"
                        :value="client.id"
                      >
                        {{ client.name }} (ID: {{ client.id }})
                      </option>
                    </select>
                    <p
                      v-if="!clientLoading && associatedClients.length === 0"
                      class="text-xs text-gray-500 mt-1"
                    >
                      No hay clientes con citas reservadas aún.
                    </p>
                  </div>

                  <!-- Checkbox de Privacidad -->
                  <div class="flex items-center">
                    <input
                      id="isPrivate"
                      type="checkbox"
                      v-model="form.is_private"
                      class="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                    />
                    <label for="isPrivate" class="ml-2 block text-sm text-gray-900">
                      Diseño Privado (Solo visible para el cliente asociado)
                    </label>
                  </div>

                  <!-- Descripción -->
                  <div>
                    <label for="description" class="block text-sm font-medium text-gray-700"
                      >Descripción (Opcional)</label
                    >
                    <textarea
                      id="description"
                      v-model="form.description"
                      rows="3"
                      class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                    ></textarea>
                  </div>

                  <!-- Mensaje de Error/Éxito -->
                  <p
                    v-if="localMessage"
                    :class="messageClass"
                    class="text-sm text-center p-2 rounded-lg"
                  >
                    {{ localMessage }}
                  </p>
                  <p
                    v-if="error"
                    class="text-sm text-red-600 text-center font-medium p-2 border border-red-200 bg-red-500 rounded-lg"
                  >
                    {{ error }}
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
              class="w-full inline-flex justify-center rounded-lg border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
            >
              <span v-if="isLoading">Subiendo...</span>
              <span v-else>Guardar Diseño</span>
            </button>
            <button
              type="button"
              @click="closeModal"
              class="mt-3 w-full inline-flex justify-center rounded-lg border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
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
  isOpen: {
    type: Boolean,
    required: true,
  },
})
const emit = defineEmits(['close', 'design-uploaded'])

const associatedClients = ref([])
const clientLoading = ref(true)

const form = reactive({
  title: '',
  image_url: '',
  description: '',
  style: 'traditional',
  client_id: null,
  is_private: false,
})

const isLoading = ref(false)
const error = ref(null)
const localMessage = ref(null)
const messageClass = ref('')

// Carga la lista de clientes asociados al tatuador
const fetchAssociatedClients = async () => {
  clientLoading.value = true
  try {
    const response = await axios.get('/clients/associated')
    associatedClients.value = response.data.clients
  } catch (error) {
    console.error('Error al cargar clientes asociados:', error)
    associatedClients.value = []
  } finally {
    clientLoading.value = false
  }
}

// Si client_id cambia, ajusta la privacidad.
watch(
  () => form.client_id,
  (newId) => {
    // Si se selecciona un cliente, se sugiere que sea privado.
    if (newId) {
      form.is_private = true
    } else {
      // Si se selecciona el diseño público o se vacía, la privacidad se desactiva.
      form.is_private = false
    }
  },
)

// Cuando el modal se abre, cargamos la lista de clientes
watch(
  () => props.isOpen,
  (newVal) => {
    if (newVal) {
      fetchAssociatedClients()
    }
  },
  { immediate: true },
)

const closeModal = () => {
  Object.assign(form, {
    title: '',
    image_url: '',
    description: '',
    style: 'traditional',
    client_id: null,
    is_private: false,
  })
  error.value = null
  localMessage.value = null
  emit('close')
}

const handleDesignUpload = async () => {
  error.value = null
  localMessage.value = null
  isLoading.value = true

  // Convertir client_id a entero si existe, o dejarlo null
  const payload = {
    ...form,
    client_id: form.client_id ? parseInt(form.client_id) : null,
  }

  try {
    const response = await axios.post('/designs', payload)

    localMessage.value = response.data.message || 'Diseño subido con éxito.'
    messageClass.value = 'bg-green-100 text-green-700'

    emit('design-uploaded')

    setTimeout(closeModal, 1500)
  } catch (err) {
    let msg = 'Error al subir. Revisa la URL (debe ser directa) y los campos.'
    if (err.response && err.response.data.errors) {
      msg = Object.values(err.response.data.errors).flat().join(' ')
    } else if (err.response && err.response.data.message) {
      msg = err.response.data.message
    }
    error.value = msg
    localMessage.value = null
  } finally {
    isLoading.value = false
  }
}
</script>
