<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 p-4">
    <div
      class="max-w-md w-full p-8 space-y-8 bg-white shadow-2xl rounded-2xl border border-gray-200"
    >
      <!-- Encabezado -->
      <div class="text-center">
        <h2 class="text-3xl font-extrabold text-gray-900">¿Olvidaste tu Contraseña?</h2>
        <p class="mt-2 text-sm text-gray-600">
          Ingresa tu correo electrónico y te enviaremos las instrucciones (RF-3).
        </p>
      </div>

      <!-- Formulario de Recuperación -->
      <form class="mt-8 space-y-6" @submit.prevent="submitRequest">
        <!-- Campo Email -->
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700">
            Correo Electrónico
          </label>
          <div class="mt-1">
            <input
              id="email"
              name="email"
              type="email"
              autocomplete="email"
              required
              v-model="form.email"
              :disabled="isLoading || isSubmitted"
              class="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-xl focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-base transition duration-150"
              placeholder="email@ejemplo.com"
            />
          </div>
        </div>

        <!-- Mensajes de Estado -->
        <p
          v-if="successMessage"
          class="text-sm text-green-600 text-center font-medium p-2 border border-green-200 bg-green-50 rounded-lg"
        >
          {{ successMessage }}
        </p>
        <p
          v-if="error"
          class="text-sm text-red-600 text-center font-medium p-2 border border-red-200 bg-red-50 rounded-lg"
        >
          {{ error }}
        </p>

        <!-- Botón de Enviar Solicitud -->
        <div>
          <button
            type="submit"
            :disabled="isLoading || isSubmitted"
            class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-lg font-medium rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 disabled:opacity-50"
          >
            <span v-if="isLoading">Enviando...</span>
            <span v-else> Enviar Instrucciones </span>
          </button>
        </div>
      </form>

      <!-- Link a Login -->
      <div class="text-center text-sm mt-4">
        <router-link to="/login" class="font-medium text-gray-500 hover:text-indigo-500">
          ← Volver al inicio de sesión
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import axios from 'axios'

const form = reactive({
  email: '',
})

const isLoading = ref(false)
const isSubmitted = ref(false)
const error = ref(null)
const successMessage = ref(null)

async function submitRequest() {
  error.value = null
  successMessage.value = null
  isLoading.value = true

  try {
    // 1. Llamada a tu API de Laravel para iniciar el proceso
    // El endpoint de Laravel es típicamente /forgot-password o /password/email
    const response = await axios.post('/forgot-password', {
      email: form.email,
    })

    // 2. Éxito: Mostrar mensaje de confirmación
    successMessage.value = response.data.message || 'Se ha enviado un correo con las instrucciones.'
    isSubmitted.value = true // Deshabilita el botón después del éxito
  } catch (err) {
    // Manejo de errores (ej. correo no encontrado)
    let errorMessage = 'Error al procesar la solicitud.'
    if (err.response && err.response.data.message) {
      errorMessage = err.response.data.message
    }

    error.value = errorMessage
  } finally {
    isLoading.value = false
  }
}
</script>
