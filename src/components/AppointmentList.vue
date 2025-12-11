<template>
  <div class="space-y-4">
    <div v-if="loading" class="text-center py-10 text-gray-500">Cargando tus citas...</div>
    <div v-else-if="appointments.length === 0" class="text-center py-10 text-gray-500">
      Aún no has reservado ninguna cita.
    </div>
    <div v-else>
      <div
        v-for="app in appointments"
        :key="app.id"
        :class="
          app.status === 'approved' ? 'border-l-4 border-green-500' : 'border-l-4 border-yellow-500'
        "
        class="p-4 border rounded-lg shadow-sm bg-white flex justify-between items-center"
      >
        <div>
          <p class="font-semibold text-gray-900">Tatuador: {{ app.tattoo_artist.name }}</p>
          <p class="text-sm text-gray-600">Fecha: {{ formatDateTime(app.scheduled_at) }}</p>
          <p class="text-sm text-gray-600 truncate max-w-sm">Detalle: {{ app.description }}</p>
          <span
            :class="getStatusBadgeClass(app.status)"
            class="text-xs font-medium px-2.5 py-0.5 rounded-full mt-1 inline-block"
          >
            {{ app.status.toUpperCase() }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'

// Definir las propiedades que este componente recibe
const props = defineProps({
  appointments: {
    type: Array,
    required: true,
  },
  loading: {
    type: Boolean,
    required: true,
  },
})

// Utilitarios
const formatDateTime = (datetime) => {
  return new Date(datetime).toLocaleString()
}

const getStatusBadgeClass = (status) => {
  switch (status) {
    case 'approved':
      return 'bg-green-100 text-green-800'
    case 'pending':
      return 'bg-yellow-100 text-yellow-800'
    case 'canceled':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}
</script>
