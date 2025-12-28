<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-50">
    <div class="text-center p-8 bg-white shadow-xl rounded-2xl">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
      <h2 class="mt-4 text-xl font-bold text-gray-800">Sincronizando con Google</h2>
      <p class="text-gray-500">Estamos preparando tu panel de InkTattooPro...</p>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

onMounted(async () => {
  const tokenFromUrl = route.query.token

  if (tokenFromUrl) {
    // 1. Guardamos el token con el nombre que espera tu store ('token')
    localStorage.setItem('token', tokenFromUrl)
    authStore.token = tokenFromUrl

    // 2. Llamamos a initialize (que ahora es async y bajará el usuario)
    await authStore.initialize()

    // 3. Ahora que initialize ya bajó el user.role_id, redirigimos
    if (authStore.user) {
      const redirectName =
        authStore.user.role_id === 2 ? 'TattooArtistDashboard' : 'ClientDashboard'
      router.push({ name: redirectName })
    } else {
      router.push({ name: 'Login' })
    }
  } else {
    router.push({ name: 'Login' })
  }
})
</script>
