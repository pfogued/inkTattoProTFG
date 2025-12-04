<template>
  <!-- Contenedor principal con altura fija, simulando el área de chat -->
  <div class="h-[80vh] flex bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
    <!-- 1. Lista de Conversaciones (Panel Izquierdo - Mockup 5) -->
    <div class="w-1/3 border-r bg-gray-50 flex flex-col">
      <header class="p-4 border-b">
        <h2 class="text-xl font-bold text-gray-800">Mensajes (RF-11)</h2>
        <input
          type="text"
          placeholder="Buscar cliente..."
          class="w-full p-2 mt-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
          v-model="searchQuery"
        />
      </header>

      <!-- Listado de Usuarios/Conversaciones -->
      <div class="flex-grow overflow-y-auto">
        <div v-if="loadingConversations" class="p-4 text-center text-gray-500">Cargando...</div>
        <div v-else-if="!filteredConversations.length" class="p-4 text-center text-gray-500">
          No hay conversaciones.
        </div>

        <div
          v-for="conversation in filteredConversations"
          :key="conversation.recipientId"
          @click="selectConversation(conversation)"
          :class="{
            'bg-indigo-50 border-l-4 border-indigo-600':
              conversation.recipientId === selectedRecipientId,
          }"
          class="flex items-center p-3 border-b cursor-pointer hover:bg-indigo-50 transition duration-150"
        >
          <div
            class="flex-shrink-0 w-10 h-10 bg-gray-400 rounded-full flex items-center justify-center text-white font-semibold"
          >
            {{ conversation.recipientName.charAt(0) }}
          </div>
          <div class="ml-3 flex-grow">
            <span class="font-medium text-gray-800">{{ conversation.recipientName }}</span>
          </div>
          <!-- Indicador de mensaje no leído -->
          <span
            v-if="conversation.unreadCount > 0"
            class="ml-auto w-2 h-2 bg-red-500 rounded-full"
          ></span>
        </div>
      </div>
    </div>

    <!-- 2. Área de Chat Activa (Panel Derecho - Mockup 5) -->
    <div class="w-2/3 flex flex-col">
      <div v-if="selectedRecipientId" class="flex-grow">
        <!-- ChatComponent se encarga de la lógica de tiempo real (RF-11) -->
        <ChatComponent
          :recipient-id="selectedRecipientId"
          :recipient-name="selectedRecipientName"
        />
      </div>
      <div v-else class="flex items-center justify-center h-full text-gray-500">
        Selecciona un cliente o tatuador para empezar una conversación.
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import ChatComponent from '../components/ChatComponent.vue'

// Estado
const loadingConversations = ref(false)
const searchQuery = ref('')
const selectedRecipientId = ref(null)
const selectedRecipientName = ref('')

// Datos simulados (Reemplazar con llamada a la API)
const conversations = ref([
  { recipientId: 101, recipientName: 'Juan Pérez (Cliente)', unreadCount: 2 },
  { recipientId: 102, recipientName: 'Martina López (Cliente)', unreadCount: 0 },
  { recipientId: 201, recipientName: 'Ana García (Tatuador)', unreadCount: 0 },
])

// Computed para filtrar las conversaciones
const filteredConversations = computed(() => {
  const query = searchQuery.value.toLowerCase()
  return conversations.value.filter((c) => c.recipientName.toLowerCase().includes(query))
})

// Métodos
function selectConversation(conversation) {
  selectedRecipientId.value = conversation.recipientId
  selectedRecipientName.value = conversation.recipientName
}

async function fetchConversations() {
  // En un entorno real, Laravel devolvería las conversaciones del usuario actual.
  // const response = await axios.get('/conversations');

  // Simulación: Seleccionar la primera conversación por defecto al cargar
  if (conversations.value.length) {
    selectConversation(conversations.value[0])
  }
}

onMounted(() => {
  fetchConversations()
})
</script>

<style scoped>
/* Altura fija para el contenedor del chat, menos el navbar/footer */
.h-\[80vh\] {
  height: 80vh;
}
</style>
