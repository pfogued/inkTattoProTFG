<template>
  <div class="p-8">
    <h1 class="text-3xl font-bold mb-6">Gestión de Citas y Reservas</h1>
    <div class="calendar-container">
      <FullCalendar :options="calendarOptions" />
    </div>

    <AppointmentModal
      :is-open="isModalOpen"
      @close="isModalOpen = false"
      @save-appointment="handleSave"
    />
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import FullCalendar from '@fullcalendar/vue'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import timeGridPlugin from '@fullcalendar/timegrid'
import AppointmentModal from '../components/AppointmentModal.vue'
// Estado de la aplicación
const isModalOpen = ref(false)
const currentEvent = reactive({}) // Para almacenar el evento seleccionado o la fecha de un nuevo evento

// Opciones de FullCalendar
const calendarOptions = reactive({
  plugins: [dayGridPlugin, interactionPlugin, timeGridPlugin],
  initialView: 'dayGridMonth',
  headerToolbar: {
    left: 'prev,next today',
    center: 'title',
    right: 'dayGridMonth,timeGridWeek,timeGridDay',
  },
  locale: 'es',
  events: [
    // Aquí se cargarán las citas desde el servidor (API)
  ],
  dateClick: handleDateClick, // Función para abrir el modal al hacer clic en una fecha/hora
  eventClick: handleEventClick, // Función para abrir el modal al hacer clic en un evento
})

// Métodos de interacción con el calendario
function handleDateClick(clickInfo) {
  currentEvent.value = { start: clickInfo.dateStr }
  isModalOpen.value = true
}

function handleEventClick(clickInfo) {
  // Cargar datos del evento existente
  currentEvent.value = {
    id: clickInfo.event.id,
    title: clickInfo.event.title,
    start: clickInfo.event.startStr,
    // ... otros datos ...
  }
  isModalOpen.value = true
}

function handleSave(appointmentData) {
  // Lógica para enviar la cita a la API de Laravel
  console.log('Cita a guardar:', appointmentData)
  isModalOpen.value = false
  // Después de guardar, recargar los eventos del calendario
}

onMounted(() => {
  // Cargar eventos iniciales de la API aquí
})
</script>

<style scoped>
/* Estilos básicos de FullCalendar */
.calendar-container {
  max-width: 1100px;
  margin: 0 auto;
}
</style>
