<template>
  <div class="p-8">
    <h1 class="text-3xl font-extrabold mb-6">Agenda y Gestión de Citas</h1>

    <!-- LÓGICA DE CONTROL POR ROL -->

    <!-- 1. INTERFAZ PARA EL CLIENTE (RF-5: Reservar Cita) -->
    <div
      v-if="authStore.isClient"
      class="text-center p-10 border-2 border-dashed border-indigo-400 bg-indigo-50 rounded-xl"
    >
      <p class="text-lg font-semibold text-gray-700">¿Listo para tu próximo tatuaje?</p>
      <button
        @click="isModalOpen = true"
        class="mt-6 bg-indigo-600 text-white py-3 px-6 rounded-xl hover:bg-indigo-700 transition font-bold"
      >
        Reservar Nueva Cita (RF-5)
      </button>
    </div>

    <!-- 2. INTERFAZ PARA EL TATUADOR (RF-8: Gestión de Agenda) -->
    <!-- ESTE BLOQUE SOLO SE MUESTRA SI NO ES CLIENTE (v-else-if) -->
    <div v-else-if="authStore.isTattooArtist" class="text-right pb-4">
      <button
        @click="openAvailabilityModal"
        class="bg-yellow-500 text-white py-2 px-4 rounded-xl hover:bg-yellow-600 transition"
      >
        Establecer Disponibilidad (RF-8)
      </button>

      <!-- Nota: La acción rápida de reservar citas para el tatuador (en nombre de un cliente) se haría desde otro modal -->
    </div>

    <!-- 3. Contenido Principal: Lista de Citas (Agenda) -->
    <div class="mt-8 bg-white p-6 rounded-xl shadow-lg">
      <h2 class="text-xl font-semibold mb-4 border-b pb-2">
        Agenda de Citas {{ authStore.isClient ? 'Confirmadas' : 'Completas' }}
      </h2>
      <ul class="divide-y divide-gray-200">
        <li
          v-for="appointment in appointments"
          :key="appointment.id"
          class="py-4 flex justify-between items-center"
        >
          <div>
            <p class="text-lg font-medium text-gray-900">{{ appointment.title }}</p>
            <p class="text-sm text-gray-500">
              Fecha: {{ appointment.date }} |
              <!-- Muestra el artista si eres cliente, o el cliente si eres artista -->
              <span v-if="authStore.isClient">Tatuador: {{ appointment.artist }}</span>
              <span v-else>Cliente: {{ appointment.client }}</span>
            </p>
          </div>
          <button
            @click="viewDetails(appointment.id)"
            class="text-indigo-600 hover:text-indigo-800 text-sm"
          >
            Ver/Gestionar (RF-7)
          </button>
        </li>
        <li v-if="!appointments.length" class="py-4 text-gray-500">No hay citas registradas.</li>
      </ul>
    </div>

    <!-- Modal de Reserva de Citas (RF-5) -->
    <AppointmentModal :is-open="isModalOpen" @close="isModalOpen = false" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth' // Importamos el store para el control de rol
import AppointmentModal from '../components/AppointmentModal.vue'
import axios from 'axios'

const authStore = useAuthStore()
const isModalOpen = ref(false)

// Datos de citas simulados (Representa la Agenda del Tatuador/Cliente)
const appointments = ref([
  {
    id: 101,
    title: 'Diseño de Loto',
    date: '2026-03-15',
    artist: 'Ana Tatuadora',
    client: 'Pablo Cliente',
    status: 'Confirmada',
  },
  {
    id: 102,
    title: 'Retoque de Frase',
    date: '2026-04-01',
    artist: 'Carlos Tatuador',
    client: 'Marta Cliente',
    status: 'Confirmada',
  },
])

function viewDetails(id) {
  // Alerta de gestión temporal (RF-7)
  alert(`Ver detalles de la cita #${id}. Aquí se abriría un modal para Modificar/Cancelar (RF-7).`)
}

function openAvailabilityModal() {
  // Alerta de gestión temporal (RF-8)
  alert('Funcionalidad de establecer disponibilidad del Tatuador (RF-8).')
}

onMounted(() => {
  // Aquí se cargaría la agenda real desde Laravel
  // axios.get(`/appointments/agenda?role=${authStore.userRole}`);
})
</script>
