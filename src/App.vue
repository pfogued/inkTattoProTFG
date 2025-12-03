<template>
  <div id="app" class="min-h-screen">
    <router-view />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useAuthStore } from './stores/auth'
import axios from 'axios'

const authStore = useAuthStore()

onMounted(() => {
  // Inicializar el store de Pinia para cargar el token y el usuario del localStorage al inicio.
  authStore.initialize()

  // Establecer la URL base para todas las llamadas a la API de Laravel
  axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'
})
</script>

<style>
/* Estilos globales */
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
/* Asegura que el body use el 100% de la altura de la ventana */
html,
body {
  height: 100%;
}
</style>
