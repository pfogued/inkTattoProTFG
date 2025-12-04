<template>
  <!-- Modal de Subida (RF-9) -->
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 overflow-y-auto bg-gray-600 bg-opacity-75 flex items-center justify-center p-4"
  >
    <div class="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
      <header class="flex justify-between items-center border-b pb-3 mb-4">
        <h3 class="text-xl font-semibold">Subir Nuevo Diseño (RF-9)</h3>
        <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600">&times;</button>
      </header>

      <form @submit.prevent="submitUpload" class="space-y-4">
        <!-- Selección de Archivo -->
        <div>
          <label class="block text-sm font-medium text-gray-700"
            >Archivo de Diseño (JPEG/PNG)</label
          >
          <input
            type="file"
            required
            @change="handleFileChange"
            class="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
          />
        </div>

        <!-- Descripción -->
        <div>
          <label class="block text-sm font-medium text-gray-700">Descripción</label>
          <textarea
            v-model="description"
            rows="3"
            class="mt-1 block w-full border border-gray-300 rounded-lg p-2"
          ></textarea>
        </div>

        <!-- Mensaje de Estado -->
        <p v-if="uploadError" class="text-sm text-red-600">{{ uploadError }}</p>

        <!-- Botones -->
        <div class="flex justify-end space-x-3 pt-2">
          <button
            type="button"
            @click="$emit('close')"
            class="px-4 py-2 border rounded-xl text-gray-700 hover:bg-gray-200"
          >
            Cancelar
          </button>
          <button
            type="submit"
            :disabled="isUploading"
            class="px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50"
          >
            <span v-if="isUploading">Subiendo...</span>
            <span v-else>Subir y Asignar</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'

const props = defineProps({
  isOpen: Boolean,
})

const emit = defineEmits(['close', 'design-uploaded'])

const file = ref(null)
const description = ref('')
const isUploading = ref(false)
const uploadError = ref(null)

const handleFileChange = (event) => {
  file.value = event.target.files[0]
}

async function submitUpload() {
  if (!file.value) return

  isUploading.value = true
  uploadError.value = null

  // Crear un FormData para enviar el archivo y datos a Laravel
  const formData = new FormData()
  formData.append('design_file', file.value)
  formData.append('description', description.value)

  // Opcional: Asignar a una cita específica
  // formData.append('appointment_id', someAppointmentId.value);

  try {
    // 1. Envío del archivo a la API (RF-9)
    await axios.post('/designs/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })

    alert('Diseño subido con éxito!')

    // 2. Limpiar y cerrar
    file.value = null
    description.value = ''
    emit('design-uploaded') // Notificar a la galería para recargar
    emit('close')
  } catch (error) {
    uploadError.value = 'Error al subir el diseño. Archivo demasiado grande o formato incorrecto.'
    console.error('Error de subida:', error)
  } finally {
    isUploading.value = false
  }
}
</script>
