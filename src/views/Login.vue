<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 p-4">
    <div
      class="max-w-md w-full p-8 space-y-8 bg-white shadow-2xl rounded-2xl border border-gray-200"
    >
      <div class="text-center">
        <h2 class="text-5xl font-extrabold text-gray-900">InkTattooPro</h2>
        <p class="mt-4 text-lg text-gray-600">Inicia sesión en tu cuenta</p>
      </div>

      <form class="mt-8 space-y-6" @submit.prevent="submitLogin">
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
              v-model="credentials.email"
              :disabled="isLoading"
              class="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-xl focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-base transition duration-150"
              placeholder="email@ejemplo.com"
            />
          </div>
        </div>

        <div>
          <label for="password" class="block text-sm font-medium text-gray-700"> Contraseña </label>
          <div class="mt-1">
            <input
              id="password"
              name="password"
              type="password"
              autocomplete="current-password"
              required
              v-model="credentials.password"
              :disabled="isLoading"
              class="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-xl focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-base transition duration-150"
              placeholder="Contraseña"
            />
          </div>
        </div>

        <p
          v-if="error"
          class="text-sm text-red-600 text-center font-medium p-2 border border-red-200 bg-red-50 rounded-lg"
        >
          {{ error }}
        </p>

        <div>
          <button
            type="submit"
            :disabled="isLoading"
            class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-lg font-medium rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 disabled:opacity-50"
          >
            <span v-if="isLoading" class="flex items-center">
              <svg
                class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
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
              Iniciando sesión...
            </span>
            <span v-else> Iniciar Sesión </span>
          </button>
        </div>
      </form>

      <div
        class="flex flex-col sm:flex-row items-center justify-between mt-6 space-y-2 sm:space-y-0"
      >
        <div class="text-sm">
          <router-link to="/register" class="font-medium text-indigo-600 hover:text-indigo-500">
            ¿No tienes cuenta? Regístrate (RF-1)
          </router-link>
        </div>
        <div class="text-sm">
          <router-link to="/forgot-password" class="font-medium text-gray-500 hover:text-gray-600">
            ¿Olvidaste tu contraseña? (RF-3)
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()
const credentials = reactive({
  email: '',
  password: '',
})
const isLoading = ref(false)
const error = ref(null)

/**
 * Lógica principal de inicio de sesión
 */
async function submitLogin() {
  error.value = null // Limpiar errores anteriores
  isLoading.value = true

  try {
    // La acción de login en Pinia se encarga de la llamada API y la redirección
    await authStore.login(credentials)
    // Si la redirección fue exitosa, no se ejecuta nada más aquí
  } catch (err) {
    // Manejo de errores de la API (por ejemplo, credenciales inválidas)
    // El servidor de Laravel debe retornar un mensaje de error legible
    const errorMessage =
      err.response?.data?.message || 'Error de red o credenciales inválidas. Verifica tu conexión.'
    error.value = errorMessage
  } finally {
    isLoading.value = false
  }
}
</script>
