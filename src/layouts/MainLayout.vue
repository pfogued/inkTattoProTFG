<template>
  <div class="min-h-screen bg-gray-50">
    <Navbar />

    <main class="py-6">
      <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
        <router-view />
      </div>
    </main>

    <footer class="mt-auto p-4 bg-white border-t text-center text-gray-500 text-sm">
      © {{ new Date().getFullYear() }} InkTattooPro. Todos los derechos reservados.
    </footer>
  </div>
</template>

<script setup>
import Navbar from '../components/Navbar.vue'
</script>
