<template>
  <div class="p-4 space-y-8">
    <div class="mb-2">
      <button
        @click="router.back()"
        class="flex items-center text-indigo-600 hover:text-indigo-800 transition-colors font-bold group"
      >
        <div class="bg-indigo-100 group-hover:bg-indigo-200 p-2 rounded-lg mr-3 transition-colors">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
        </div>
        Volver al Panel Principal
      </button>
    </div>

    <header class="flex justify-between items-center pb-4 border-b">
      <h1 class="text-3xl font-extrabold text-gray-900">Galería de Diseños (RF-9, RF-10)</h1>
      <button
        v-if="authStore.isTattooArtist"
        @click="openUploadModal"
        class="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition font-semibold shadow-md"
      >
        Subir Nuevo Diseño
      </button>
    </header>

    <div v-if="loading" class="text-center p-10 text-gray-500">Cargando diseños...</div>
    <div
      v-else-if="!designs.length"
      class="text-center p-10 text-gray-500 border border-dashed rounded-xl"
    >
      Aún no hay diseños en la galería.
    </div>

    <div v-else class="grid grid-cols-2 md:grid-cols-4 gap-6">
      <div
        v-for="design in designs"
        :key="design.id"
        class="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 transition hover:shadow-xl"
      >
        <div
          @click="viewDesign(design)"
          class="h-48 w-full bg-gray-100 flex items-center justify-center cursor-pointer hover:opacity-90 transition"
        >
          <img :src="design.image_url" :alt="design.title" class="object-cover h-full w-full" />
        </div>

        <div class="p-4">
          <h3 class="font-semibold text-gray-800 truncate">{{ design.title }}</h3>
          <div class="mt-3 flex justify-between text-sm">
            <button
              @click="editAnnotation(design)"
              class="text-indigo-600 hover:text-indigo-800 font-medium"
            >
              Anotar / Ver Detalle
            </button>
            <button
              v-if="authStore.isTattooArtist && design.tattoo_artist_id === authStore.user.id"
              @click="triggerDelete(design.id)"
              class="text-red-500 hover:text-red-700 font-medium"
            >
              Eliminar
            </button>
          </div>
        </div>
      </div>
    </div>

    <UploadDesignModal
      :isOpen="isUploadModalOpen"
      @close="isUploadModalOpen = false"
      @design-uploaded="fetchDesigns"
    />
    <AnnotationEditor
      :design="selectedDesign"
      :isOpen="isAnnotationModalOpen"
      @close="isAnnotationModalOpen = false"
      @design-updated="handleDesignUpdate"
    />

    <ConfirmModal
      :isOpen="isConfirmDeleteOpen"
      title="¿Eliminar Diseño?"
      message="¿Estás seguro de que quieres borrar este trabajo? Esta acción eliminará la imagen y sus anotaciones de forma permanente."
      @close="isConfirmDeleteOpen = false"
      @confirm="executeDelete"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { useAuthStore } from '../stores/auth'
import AnnotationEditor from '../components/AnnotationEditor.vue'
import UploadDesignModal from '../components/UploadDesignModal.vue'
import ConfirmModal from '../components/ConfirmModal.vue' // Importación necesaria

const authStore = useAuthStore()
const router = useRouter()

const designs = ref([])
const loading = ref(true)
const isUploadModalOpen = ref(false)
const isAnnotationModalOpen = ref(false)
const selectedDesign = ref(null)

// Estados para el Modal de Confirmación
const isConfirmDeleteOpen = ref(false)
const designIdToDelete = ref(null)

async function fetchDesigns() {
  loading.value = true
  try {
    const response = await axios.get('/designs')
    designs.value = response.data.designs
  } catch (error) {
    console.error('Error:', error)
  } finally {
    loading.value = false
  }
}

// 1. Preparamos la eliminación (Abre el modal)
const triggerDelete = (id) => {
  designIdToDelete.value = id
  isConfirmDeleteOpen.value = true
}

// 2. Ejecutamos la eliminación (Llamada a la API)
const executeDelete = async () => {
  isConfirmDeleteOpen.value = false
  try {
    await axios.delete(`/designs/${designIdToDelete.value}`)
    fetchDesigns() // Recargamos la lista
  } catch (error) {
    alert('No se pudo eliminar el diseño.')
  }
}

function openUploadModal() {
  isUploadModalOpen.value = true
}
function editAnnotation(design) {
  selectedDesign.value = design
  isAnnotationModalOpen.value = true
}
function viewDesign(design) {
  editAnnotation(design)
}
function handleDesignUpdate(updatedDesign) {
  const index = designs.value.findIndex((d) => d.id === updatedDesign.id)
  if (index !== -1) designs.value[index] = updatedDesign
  selectedDesign.value = updatedDesign
}

onMounted(() => fetchDesigns())
</script>
