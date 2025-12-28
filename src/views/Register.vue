<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 p-4">
    <div
      class="max-w-lg w-full p-8 space-y-8 bg-white shadow-2xl rounded-2xl border border-gray-200"
    >
      <!-- Encabezado -->
      <div class="text-center">
        <h2 class="text-3xl font-extrabold text-gray-900">Registro de Cuenta</h2>
        <p class="mt-2 text-sm text-gray-600">
          Completa el formulario para unirte a InkTattooPro (RF-1)
        </p>
      </div>

      <!-- Formulario de Registro -->
      <form class="mt-8 space-y-6" @submit.prevent="submitRegister">
        <!-- Nombre Completo -->
        <div>
          <label for="name" class="block text-sm font-medium text-gray-700">Nombre Completo</label>
          <input
            type="text"
            id="name"
            required
            v-model="form.name"
            :disabled="isLoading"
            class="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
            placeholder="Tu nombre y apellido"
          />
        </div>

        <!-- Correo Electrónico -->
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700"
            >Correo Electrónico</label
          >
          <input
            type="email"
            id="email"
            required
            v-model="form.email"
            :disabled="isLoading"
            class="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
            placeholder="email@ejemplo.com"
          />
        </div>

        <!-- Contraseña -->
        <div>
          <label for="password" class="block text-sm font-medium text-gray-700">Contraseña</label>
          <input
            type="password"
            id="password"
            required
            v-model="form.password"
            :disabled="isLoading"
            class="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
            placeholder="Mínimo 8 caracteres"
          />
        </div>

        <!-- Selector de Rol -->
        <div>
          <label for="role" class="block text-sm font-medium text-gray-700">Tipo de Cuenta</label>
          <select
            id="role"
            required
            v-model="form.role_id"
            :disabled="isLoading"
            class="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
          >
            <option :value="1">Cliente</option>
            <option :value="2">Tatuador / Estudio</option>
          </select>
        </div>

        <!-- Aceptar Términos (RF-16) -->
        <div class="flex items-center">
          <input
            id="terms"
            type="checkbox"
            required
            v-model="form.accept_terms"
            class="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
          />
          <label for="terms" class="ml-2 block text-sm text-gray-900">
            Acepto los
            <span class="font-medium text-indigo-600">términos y condiciones</span> (RF-16)
          </label>
        </div>

        <!-- Mensaje de Error/Éxito -->
        <p
          v-if="error"
          class="text-sm text-red-600 text-center font-medium p-2 border border-red-200 bg-red-50 rounded-lg"
        >
          {{ error }}
        </p>

        <!-- Botón de Enviar (V-IF/V-ELSE CORREGIDO) -->
        <div>
          <button
            type="submit"
            :disabled="isLoading"
            class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-lg font-medium rounded-xl text-white bg-green-600 hover:bg-green-700 transition duration-150 disabled:opacity-50"
          >
            <!-- CORRECCIÓN CRÍTICA: Pegar v-if y v-else para evitar el error de compilación -->
            <span v-if="isLoading">Registrando...</span><span v-else> Registrar Cuenta </span>
          </button>
        </div>

        <!-- Link a Login -->
        <div class="text-center text-sm mt-4">
          ¿Ya tienes cuenta?
          <router-link to="/login" class="font-medium text-indigo-600 hover:text-indigo-500">
            Inicia sesión aquí
          </router-link>
        </div>
      </form>
    </div>
  </div>

  <div class="mt-8">
    <div class="relative mb-6">
      <div class="absolute inset-0 flex items-center">
        <div class="w-full border-t border-gray-200"></div>
      </div>
      <div class="relative flex justify-center text-sm">
        <span class="px-4 bg-white text-gray-400 uppercase tracking-widest text-xs font-semibold">
          O continúa con
        </span>
      </div>
    </div>

    <div class="grid grid-cols-2 gap-4">
      <!-- Botón Google -->
      <a
        href="http://localhost:8000/api/auth/google/redirect"
        class="flex items-center justify-center py-3 px-4 border border-gray-300 rounded-xl shadow-sm bg-white hover:bg-gray-50 transition-all duration-200 group"
      >
        <svg class="w-5 h-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z"
          />
        </svg>
        <span class="ml-3 text-sm font-bold text-gray-700">Google</span>
      </a>

      <!-- Botón Apple -->
      <a
        href="#"
        class="flex items-center justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm bg-black text-white hover:bg-gray-800 transition-all duration-200 group"
      >
        <svg
          class="w-5 h-5 group-hover:scale-110 transition-transform"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            d="M17.057 12.781c.018 2.583 2.235 3.445 2.261 3.453-.021.073-.354 1.209-1.154 2.378-.691 1.012-1.41 2.019-2.54 2.039-1.112.019-1.472-.659-2.742-.659-1.269 0-1.666.639-2.722.679-1.092.039-1.921-1.109-2.615-2.122-1.419-2.064-2.503-5.83-1.041-8.361.725-1.258 2.018-2.053 3.418-2.073 1.066-.02 2.074.719 2.727.719.654 0 1.868-.899 3.129-.773.53.022 2.02.212 2.977 1.61-.077.047-1.776 1.033-1.758 3.102zM15.029 4.316c.58-.703.968-1.681.861-2.657-.84.034-1.854.559-2.456 1.262-.54.629-.915 1.631-.786 2.583.935.072 1.874-.523 2.381-1.188z"
          />
        </svg>
        <span class="ml-3 text-sm font-bold">Apple</span>
      </a>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()

// Estado del formulario
const form = reactive({
  name: '',
  email: '',
  password: '',
  role_id: 1, // Por defecto: Cliente
  accept_terms: false,
})

const isLoading = ref(false)
const error = ref(null)

// Función de registro
async function submitRegister() {
  error.value = null
  isLoading.value = true

  if (!form.accept_terms) {
    error.value = 'Debes aceptar los términos y condiciones.'
    isLoading.value = false
    return
  }

  try {
    // 🎯 SOLUCIÓN CRÍTICA: Usar la URL ABSOLUTA para forzar el envío POST
    // Esto resuelve el error 405 (Method Not Allowed)
    await axios.post('http://localhost:8000/api/register', {
      name: form.name,
      email: form.email,
      password: form.password,
      role_id: form.role_id,
    })

    // Éxito: Redirigir a la página de Login
    alert('Registro exitoso. ¡Ahora puedes iniciar sesión!')
    router.push({ name: 'Login' })
  } catch (err) {
    // Manejo de errores 422 (Validación) y 500
    let errorMessage = 'Error al registrar. Verifica tus datos.'
    if (err.response) {
      if (err.response.data.errors) {
        // Capturar errores de validación 422
        const errors = err.response.data.errors
        errorMessage = Object.values(errors).flat().join(' ')
      } else if (err.response.data.message) {
        errorMessage = err.response.data.message
      }
    } else {
      // Fallo de red o servidor 500
      errorMessage = 'Fallo al conectar con el servidor API. Revisa tu consola.'
    }

    error.value = errorMessage
  } finally {
    isLoading.value = false
  }
}
</script>
