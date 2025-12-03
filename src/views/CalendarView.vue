<template>
  <div class="p-8">
    <h1 class="text-3xl font-bold mb-6">Gestión de Citas (Vista Temporal)</h1>

    <div class="text-center p-10 border-2 border-dashed border-red-400 bg-red-50 rounded-lg">
      <p class="text-lg font-semibold text-red-700">
        El componente de calendario interactivo está temporalmente deshabilitado debido a conflictos
        de versión.
      </p>
      <p class="mt-2 text-sm text-gray-600">Continuaremos con los módulos de Login y Chat.</p>
    </div>

    <button
      @click="isModalOpen = true"
      class="mt-6 bg-indigo-500 text-white py-2 px-4 rounded hover:bg-indigo-600"
    >
      Abrir Modal de Reserva (Prueba)
    </button>

    <AppointmentModal
      :is-open="isModalOpen"
      @close="isModalOpen = false"
      @save-appointment="handleSave"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import AppointmentModal from '../components/AppointmentModal.vue'

// Estado del modal (el único estado necesario ahora)
const isModalOpen = ref(false)

// Función de placeholder
function handleSave(appointmentData) {
  console.log('Cita de prueba guardada:', appointmentData)
  isModalOpen.value = false
  alert('Cita simulada guardada. Revisa la consola.')
}
</script>

<style scoped>
/* No se necesitan estilos de FullCalendar */
</style>
