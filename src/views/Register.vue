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

        <!-- Selector de Rol (RF-1: el sistema debe permitir registrarse con rol) -->
        <div>
          <label for="role" class="block text-sm font-medium text-gray-700">Tipo de Cuenta</label>
          <select
            id="role"
            required
            v-model="form.role_id"
            :disabled="isLoading"
            class="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
          >
            <!-- Rol 1 es Cliente, 2 es Tatuador - según la lógica de tu Store de Pinia -->
            <option :value="1">Cliente</option>
            <option :value="2">Tatuador / Estudio</option>
          </select>
        </div>

        <!-- Aceptar Términos (RF-16: El sistema debe mostrar confirmaciones) -->
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

        <!-- Mensaje de Error/Éxito (RF-14: El sistema debe validar los campos) -->
        <p
          v-if="error"
          class="text-sm text-red-600 text-center font-medium p-2 border border-red-200 bg-red-50 rounded-lg"
        >
          {{ error }}
        </p>

        <!-- Botón de Enviar -->
        <div>
          <button
            type="submit"
            :disabled="isLoading"
            class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-lg font-medium rounded-xl text-white bg-green-600 hover:bg-green-700 transition duration-150 disabled:opacity-50"
          >
            <span v-if="isLoading">Registrando...</span>
            <span v-else> Registrar Cuenta </span>
          </button>
        </div>
      </form>

      <!-- Link a Login -->
      <div class="text-center text-sm mt-4">
        ¿Ya tienes cuenta?
        <router-link to="/login" class="font-medium text-indigo-600 hover:text-indigo-500">
          Inicia sesión aquí
        </router-link>
      </div>
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

async function submitRegister() {
  error.value = null
  isLoading.value = true

  // Validación en el frontend (RF-14)
  if (!form.accept_terms) {
    error.value = 'Debes aceptar los términos y condiciones.'
    isLoading.value = false
    return
  }

  try {
    // 1. Llamada a tu API de Laravel para crear el usuario (RF-1)
    // El endpoint /register se resuelve a http://localhost:8000/api/register (configurado en auth.js)
    await axios.post('/register', {
      name: form.name,
      email: form.email,
      password: form.password,
      role_id: form.role_id,
    })

    // 2. Éxito: Redirigir a la página de Login (RF-16)
    alert('Registro exitoso. ¡Ahora puedes iniciar sesión!')
    router.push({ name: 'Login' })
  } catch (err) {
    // Manejo de errores de validación de Laravel (RF-14)
    let errorMessage = 'Error al registrar. Verifica tus datos.'
    if (err.response && err.response.data.errors) {
      // Si Laravel devuelve errores de validación específicos
      const errors = err.response.data.errors
      // Concatenar todos los mensajes de error
      errorMessage = Object.values(errors).flat().join(' ')
    } else if (err.response && err.response.data.message) {
      errorMessage = err.response.data.message
    }

    error.value = errorMessage
  } finally {
    isLoading.value = false
  }
}
</script>
