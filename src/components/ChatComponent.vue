<template>
  <div class="flex flex-col h-full bg-white">
    <!-- Encabezado del Chat -->
    <header class="p-4 bg-gray-50 border-b shadow-sm">
      <h3 class="text-lg font-semibold text-gray-800">Conversación con {{ recipientName }}</h3>
    </header>

    <!-- Área de Mensajes (scrollable) -->
    <div ref="messagesContainer" class="flex-grow p-4 overflow-y-auto space-y-4">
      <div
        v-for="message in messages"
        :key="message.id"
        class="flex"
        :class="message.isMine ? 'justify-end' : 'justify-start'"
      >
        <div
          class="max-w-xs lg:max-w-md px-4 py-2 rounded-xl shadow-md"
          :class="
            message.isMine
              ? 'bg-indigo-600 text-white rounded-br-none'
              : 'bg-gray-100 text-gray-800 border border-gray-300 rounded-tl-none'
          "
        >
          <!-- Contenido del Mensaje -->
          <p v-html="message.content"></p>
          <!-- Hora del Mensaje -->
          <span
            class="block text-xs mt-1 text-right"
            :class="message.isMine ? 'text-indigo-200' : 'text-gray-500'"
          >
            {{ formatTime(message.created_at) }}
          </span>
        </div>
      </div>
      <!-- Indicador 'Escribiendo...' (RF-11) -->
      <p v-if="isTyping" class="text-sm text-gray-500 italic p-2 rounded-lg bg-yellow-50 max-w-xs">
        Escribiendo...
      </p>
    </div>

    <!-- Área de Entrada de Mensaje (RF-11) -->
    <footer class="p-4 bg-gray-50 border-t">
      <form @submit.prevent="sendMessage" class="flex items-center space-x-3">
        <input
          type="text"
          v-model="newMessage"
          placeholder="Escribe tu mensaje..."
          @input="sendTypingEvent"
          required
          class="flex-grow p-3 border rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button
          type="submit"
          :disabled="isSending || !newMessage.trim()"
          class="bg-indigo-600 text-white p-3 rounded-full hover:bg-indigo-700 transition duration-150 disabled:opacity-50"
        >
          <svg
            class="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M5 12h14M12 5l7 7-7 7"
            ></path>
          </svg>
        </button>
      </form>
    </footer>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted, nextTick } from 'vue'
import axios from 'axios'
import Echo from '../services/echo'
import { useAuthStore } from '../stores/auth'

const props = defineProps({
  recipientId: { type: Number, required: true },
  recipientName: { type: String, required: true },
})

const authStore = useAuthStore()
const messages = ref([])
const newMessage = ref('')
const isSending = ref(false)
const isTyping = ref(false)
const messagesContainer = ref(null)

let chatChannel = null
let typingTimeout = null

// CLAVE: Generar el nombre del canal privado
const getChannelName = () => {
  const currentUserId = authStore.user?.id || 0
  const ids = [currentUserId, props.recipientId].sort()
  return `private-chat.${ids[0]}.${ids[1]}`
}

const formatTime = (dateString) => {
  return new Date(dateString).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
}

const scrollToBottom = () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })
}

// Lógica principal de envío (RF-11)
async function sendMessage() {
  if (!newMessage.value.trim() || isSending.value) return

  const content = newMessage.value
  isSending.value = true
  newMessage.value = ''

  // Mensaje temporal para UX inmediata
  messages.value.push({
    id: Date.now(),
    content: content,
    isMine: true,
    created_at: new Date().toISOString(),
  })
  scrollToBottom()

  try {
    // Envío de mensaje a la API (Laravel lo guarda y hace el broadcast)
    await axios.post('/messages', {
      recipient_id: props.recipientId,
      content: content,
    })
  } catch (error) {
    console.error('Error al enviar mensaje:', error)
    alert('Error al enviar. Inténtalo de nuevo.')
  } finally {
    isSending.value = false
  }
}

// Escuchar eventos de WebSockets (RF-11)
function setupEchoListeners() {
  if (chatChannel) {
    Echo.leave(chatChannel)
  }

  const channelName = getChannelName()
  chatChannel = channelName

  Echo.private(channelName)
    // Escuchar el evento de nuevo mensaje
    .listen('NewChatMessageEvent', (e) => {
      if (e.message.sender_id === props.recipientId) {
        messages.value.push({
          ...e.message,
          isMine: false,
        })
        scrollToBottom()
      }
    })
    // Escuchar el evento de 'escribiendo...'
    .listenForWhisper('typing', (e) => {
      if (e.user_id !== authStore.user.id) {
        isTyping.value = true
        clearTimeout(typingTimeout)
        typingTimeout = setTimeout(() => {
          isTyping.value = false
        }, 1500)
      }
    })
}

// Enviar el evento 'escribiendo...'
function sendTypingEvent() {
  if (chatChannel && newMessage.value.length > 0) {
    Echo.private(getChannelName()).whisper('typing', {
      user_id: authStore.user.id,
    })
  }
}

// Cargar historial de mensajes (CU-06, CU-14)
async function fetchMessages() {
  try {
    // Carga el historial entre el usuario actual y el destinatario
    const response = await axios.get(`/messages/${props.recipientId}`)
    messages.value = response.data.map((msg) => ({
      ...msg,
      isMine: msg.sender_id === authStore.user.id,
    }))
    scrollToBottom()
  } catch (error) {
    console.error('Error al cargar mensajes:', error)
  }
}

onMounted(() => {
  fetchMessages()
  setupEchoListeners()
})

onUnmounted(() => {
  if (chatChannel) {
    Echo.leave(chatChannel)
  }
})

// Refrescar mensajes y listeners si cambia la conversación
watch(
  () => props.recipientId,
  (newId) => {
    if (newId) {
      fetchMessages()
      setupEchoListeners()
    }
  },
)
</script>
