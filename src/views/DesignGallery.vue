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
        <svg
          class="w-5 h-5 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
          ></path>
        </svg>
        Subir Nuevo Diseño
      </button>
    </header>

    <p class="text-gray-600">
      Diseños asociados a tu próxima cita o trabajos previos. Haz clic para ver comentarios o
      editar.
    </p>

    <div v-if="loading" class="text-center p-10">
      <div
        class="animate-spin inline-block w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full mb-2"
      ></div>
      <p class="text-gray-500">Cargando diseños...</p>
    </div>

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
          <img
            :src="design.image_url"
            :alt="design.title"
            class="object-cover h-full w-full"
            onerror="this.onerror=null; this.src='https://placehold.co/300x200/cccccc/333333?text=Diseño+No+Cargado';"
          />
        </div>

        <div class="p-4">
          <h3 class="font-semibold text-gray-800 truncate">{{ design.title }}</h3>
          <p class="text-xs text-gray-500 mt-1">
            Subido por: {{ design.tattoo_artist?.name || 'Desconocido' }}
          </p>

          <div class="mt-3 flex justify-between text-sm">
            <button
              @click="editAnnotation(design)"
              class="text-indigo-600 hover:text-indigo-800 font-medium"
            >
              Anotar / Ver Detalle
            </button>

            <button
              v-if="authStore.isTattooArtist && design.tattoo_artist_id === authStore.user.id"
              @click="deleteDesign(design.id)"
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
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { useAuthStore } from '../stores/auth'
import AnnotationEditor from '../components/AnnotationEditor.vue'
import UploadDesignModal from '../components/UploadDesignModal.vue'

const authStore = useAuthStore()
const router = useRouter() // Ya lo tenías importado, ahora lo usamos en el template

const designs = ref([])
const loading = ref(true)
const isUploadModalOpen = ref(false)
const isAnnotationModalOpen = ref(false)
const selectedDesign = ref(null)

async function fetchDesigns() {
  loading.value = true
  try {
    const response = await axios.get('/designs')
    designs.value = response.data.designs
  } catch (error) {
    console.error('Error al cargar diseños:', error)
    designs.value = []
  } finally {
    loading.value = false
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
  if (index !== -1) {
    designs.value[index] = updatedDesign
  }
  selectedDesign.value = updatedDesign
}

async function deleteDesign(id) {
  if (confirm('¿Estás seguro de eliminar este diseño? Esta acción no se puede deshacer.')) {
    try {
      await axios.delete(`/designs/${id}`)
      alert('Diseño eliminado con éxito.')
      fetchDesigns()
    } catch (error) {
      alert('Error al eliminar el diseño.')
    }
  }
}

onMounted(() => {
  fetchDesigns()
})
</script>
