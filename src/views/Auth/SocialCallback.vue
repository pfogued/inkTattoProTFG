<script setup>
import { onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

onMounted(() => {
  // 1. Extraemos el token que Laravel mandó por la URL
  const token = route.query.token
  const error = route.query.error

  if (token) {
    // 2. Lo guardamos en el localStorage (o tu almacén de Pinia)
    localStorage.setItem('auth_token', token)

    // 3. Redirigimos al usuario a su perfil o inicio
    // Ajusta '/artistas' a la ruta que quieras
    router.push('/artistas')
  } else {
    // Si hubo error, volvemos al login
    console.error('Error en login social:', error)
    router.push({ name: 'login', query: { auth_error: 'social_failed' } })
  }
})
</script>

<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-gray-50">
    <div class="p-10 bg-white shadow-xl rounded-2xl text-center">
      <!-- Spinner de carga -->
      <div
        class="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-black mx-auto"
      ></div>
      <h2 class="mt-6 text-2xl font-bold text-gray-800">Finalizando sesión</h2>
      <p class="mt-2 text-gray-500">Estamos conectando con tu cuenta de Google...</p>
    </div>
  </div>
</template>
