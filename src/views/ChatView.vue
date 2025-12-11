<template>
  <div class="p-4 sm:p-8 min-h-[85vh] flex flex-col">
    <h1 class="text-3xl font-extrabold text-gray-900 mb-6">Mensajería (RF-11)</h1>

    <div
      class="flex-grow bg-white shadow-2xl rounded-xl overflow-hidden flex border border-gray-200"
    >
      <!-- Columna 1: Lista de Contactos -->
      <div class="w-1/4 border-r border-gray-200 bg-gray-50 flex flex-col">
        <div class="p-4 border-b">
          <h2 class="font-semibold text-lg text-indigo-700">Contactos Disponibles</h2>
          <p class="text-xs text-gray-500 mt-1">
            {{ authStore.isTattooArtist ? 'Clientes y Tatuadores' : 'Solo Tatuadores' }}
          </p>
        </div>

        <div class="flex-grow overflow-y-auto">
          <div v-if="contactsLoading" class="p-4 text-center text-gray-500">
            Cargando usuarios...
          </div>
          <div v-else class="space-y-1">
            <div
              v-for="contact in filteredContacts"
              :key="contact.id"
              @click="openChat(contact)"
              :class="{
                'bg-indigo-100 border-l-4 border-indigo-600':
                  activePartner && activePartner.id === contact.id,
                'hover:bg-gray-100 border-l-4 border-transparent':
                  !activePartner || activePartner.id !== contact.id,
              }"
              class="p-3 cursor-pointer transition flex justify-between items-center"
            >
              <div>
                <p class="font-medium text-gray-800">{{ contact.name }}</p>
                <p class="text-xs text-gray-500">
                  {{ contact.role_id === 2 ? 'Tatuador' : 'Cliente' }}
                </p>
              </div>
              <!-- Indicador de Nuevo Mensaje (Simplificado) -->
              <span v-if="contact.hasNewMessages" class="h-2 w-2 bg-red-500 rounded-full"></span>
            </div>
            <div v-if="filteredContacts.length === 0" class="p-4 text-center text-gray-500 text-sm">
              No hay otros usuarios para chatear.
            </div>
          </div>
        </div>
      </div>

      <!-- Columna 2: Ventana de Chat (RF-12) -->
      <div class="w-3/4 flex flex-col">
        <div v-if="!activePartner" class="flex-grow flex items-center justify-center text-gray-500">
          <p>Selecciona un contacto para iniciar la conversación.</p>
        </div>

        <div v-else class="flex-grow flex flex-col h-full">
          <!-- Encabezado del Chat -->
          <div class="p-4 border-b bg-gray-50">
            <h2 class="font-semibold text-lg text-gray-900">{{ activePartner.name }}</h2>
            <p class="text-xs text-gray-500">ID del Chat: {{ chatId || '...' }}</p>
          </div>

          <!-- Área de Mensajes (Historial - RF-12) -->
          <div ref="messageContainer" class="flex-grow p-4 space-y-4 overflow-y-auto bg-white">
            <div v-if="chatLoading" class="text-center py-6 text-gray-500">
              Cargando mensajes...
            </div>
            <div v-else-if="messages.length === 0" class="text-center py-6 text-gray-500">
              ¡Inicia la conversación!
            </div>
            <div
              v-for="message in messages"
              :key="message.id"
              :class="
                message.sender_id === authStore.user.id ? 'flex justify-end' : 'flex justify-start'
              "
            >
              <div
                :class="
                  message.sender_id === authStore.user.id
                    ? 'bg-indigo-600 text-white rounded-tr-none'
                    : 'bg-gray-200 text-gray-800 rounded-tl-none'
                "
                class="max-w-xs lg:max-w-md p-3 rounded-xl shadow-md"
              >
                <p
                  class="text-xs font-semibold mb-1"
                  v-if="message.sender_id !== authStore.user.id && message.sender"
                >
                  {{ message.sender.name }}
                </p>
                <p class="text-sm">{{ message.content }}</p>
                <span
                  class="block text-right mt-1"
                  :class="
                    message.sender_id === authStore.user.id
                      ? 'text-indigo-200 text-xs'
                      : 'text-gray-500 text-xs'
                  "
                >
                  {{ formatTime(message.created_at) }}
                </span>
              </div>
            </div>
          </div>

          <!-- Formulario de Envío de Mensajes -->
          <div class="p-4 border-t bg-gray-50">
            <form @submit.prevent="sendMessage" class="flex space-x-3">
              <input
                type="text"
                v-model="newMessageContent"
                ref="messageInput"
                placeholder="Escribe tu mensaje..."
                required
                :disabled="chatLoading || sendingMessage"
                class="flex-grow px-4 py-2 border border-gray-300 rounded-xl focus:ring-indigo-500 focus:border-indigo-500"
              />
              <!-- La etiqueta es autocerrada -->

              <button
                type="submit"
                :disabled="!newMessageContent.trim() || sendingMessage || !chatId"
                class="px-6 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition disabled:opacity-50"
              >
                <span v-if="sendingMessage">Enviando...</span>
                <span v-else>Enviar</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, computed } from 'vue'
import axios from 'axios'
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()

// Estado de la lista de contactos
const contacts = ref([])
const contactsLoading = ref(true)

// Estado del chat activo
const activePartner = ref(null)
const chatId = ref(null)
const messages = ref([])
const chatLoading = ref(false)

// Estado del formulario de mensaje
const newMessageContent = ref('')
const sendingMessage = ref(false)
const messageContainer = ref(null)
const messageInput = ref(null)

// Filtra la lista de contactos para no incluir al usuario actual
const filteredContacts = computed(() => {
  return contacts.value.filter((c) => c.id !== authStore.user.id)
})

// Desplaza el contenedor de mensajes al final
const scrollToBottom = () => {
  nextTick(() => {
    if (messageContainer.value) {
      messageContainer.value.scrollTop = messageContainer.value.scrollHeight
    }
  })
}

// 1. Cargar todos los usuarios como posibles contactos
const fetchContacts = async () => {
  contactsLoading.value = true
  try {
    const usersResponse = await axios.get('/users')
    contacts.value = usersResponse.data.users
  } catch (error) {
    console.error('Error al cargar contactos:', error)
  } finally {
    contactsLoading.value = false
  }
}

// 2. Abrir un chat con un usuario
const openChat = async (partner) => {
  activePartner.value = partner
  chatLoading.value = true
  messages.value = []
  chatId.value = null

  try {
    const response = await axios.get(`/chat/${partner.id}`)

    if (response.data.chat_id) {
      chatId.value = response.data.chat_id
      messages.value = response.data.messages

      scrollToBottom()

      nextTick(() => {
        if (messageInput.value) {
          messageInput.value.focus()
        }
      })
    } else {
      console.error('ERROR CHAT: La API no devolvió un chat_id válido.')
    }
  } catch (error) {
    console.error('Error al cargar chat:', error.response?.data?.message || error)
    alert(`Error al iniciar chat con ${partner.name}. Revisa la consola.`)
  } finally {
    chatLoading.value = false
  }
}

// 3. Enviar un mensaje
const sendMessage = async () => {
  if (!newMessageContent.value.trim() || !chatId.value) {
    return
  }

  sendingMessage.value = true
  const content = newMessageContent.value
  newMessageContent.value = ''

  try {
    const response = await axios.post(`/chat/${chatId.value}`, { content })

    messages.value.push(response.data.message_sent)

    scrollToBottom()
  } catch (error) {
    console.error('Error al enviar mensaje:', error.response?.data?.message || error)
    alert('No se pudo enviar el mensaje.')
    newMessageContent.value = content
  } finally {
    sendingMessage.value = false
  }
}

// Utilidad de formato de hora
const formatTime = (isoString) => {
  if (!isoString) return ''
  return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

onMounted(() => {
  if (authStore.isAuthenticated) {
    fetchContacts()
  }
})
</script>
