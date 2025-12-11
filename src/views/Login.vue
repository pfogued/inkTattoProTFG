<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 p-4">
    <div
      class="max-w-md w-full p-8 space-y-8 bg-white shadow-2xl rounded-2xl border border-gray-200"
    >
      <!-- Encabezado -->
      <div class="text-center">
        <h2 class="text-3xl font-extrabold text-gray-900">Iniciar Sesión</h2>
        <p class="mt-2 text-sm text-gray-600">Accede a tu cuenta de InkTattooPro (RF-2)</p>
      </div>

      <!-- Formulario de Login -->
      <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
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
            :disabled="authStore.loading"
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
            :disabled="authStore.loading"
            class="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
            placeholder="Tu contraseña"
          />
        </div>

        <!-- Mensaje de Error (Desde Pinia Store) -->
        <p
          v-if="authStore.error"
          class="text-sm text-red-600 text-center font-medium p-2 border border-red-200 bg-red-50 rounded-lg"
        >
          {{ authStore.error }}
        </p>
        <!-- Mensaje de Error Local -->
        <p
          v-if="localError"
          class="text-sm text-red-600 text-center font-medium p-2 border border-red-200 bg-red-50 rounded-lg"
        >
          {{ localError }}
        </p>

        <!-- Botón de Enviar -->
        <div>
          <button
            type="submit"
            :disabled="authStore.loading"
            class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-lg font-medium rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 transition duration-150 disabled:opacity-50"
          >
            <span v-if="authStore.loading">Iniciando...</span>
            <span v-else> Iniciar Sesión </span>
          </button>
        </div>
      </form>

      <!-- Links de Navegación -->
      <div class="text-center text-sm mt-4 space-y-2">
        <router-link
          to="/forgot-password"
          class="font-medium text-indigo-600 hover:text-indigo-500 block"
        >
          ¿Olvidaste tu contraseña?
        </router-link>
        ¿No tienes cuenta?
        <router-link to="/register" class="font-medium text-green-600 hover:text-green-500">
          Regístrate aquí
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()
const localError = ref(null)

// Estado del formulario
const form = reactive({
  email: '',
  password: '',
})

async function handleLogin() {
  authStore.error = null // Limpiar errores del store
  localError.value = null // Limpiar errores locales

  if (!form.email || !form.password) {
    localError.value = 'Por favor, ingresa correo y contraseña.'
    return
  }

  try {
    // 🎯 Llamada a la acción de Pinia para iniciar sesión
    await authStore.login({
      email: form.email,
      password: form.password,
    })
    // Redirección se maneja dentro del store
  } catch (error) {
    // El error ya está manejado y establecido en authStore.error por la acción login
    console.error('Fallo en el intento de login:', error)
  }
}
</script>
