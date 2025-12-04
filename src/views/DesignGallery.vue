<template>
  <div class="p-4 space-y-8">
    <!-- Encabezado y Acciones -->
    <header class="flex justify-between items-center pb-4 border-b">
      <h1 class="text-3xl font-extrabold text-gray-900">Galería de Diseños (RF-9, RF-10)</h1>

      <!-- Botón de Subida (Solo para Tatuadores, RF-9) -->
      <button
        v-if="authStore.isTattooArtist"
        @click="openUploadModal"
        class="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition"
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

    <!-- Subtítulo de la Galería -->
    <p class="text-gray-600">
      Diseños asociados a tu próxima cita o trabajos previos. Haz clic para ver comentarios o
      editar.
    </p>

    <!-- Grid de Diseños (Mockup 6) -->
    <div v-if="loading" class="text-center p-10">Cargando diseños...</div>
    <div
      v-else-if="!designs.length"
      class="text-center p-10 text-gray-500 border border-dashed rounded-xl"
    >
      Aún no tienes diseños asociados.
    </div>
    <div v-else class="grid grid-cols-2 md:grid-cols-4 gap-6">
      <div
        v-for="design in designs"
        :key="design.id"
        class="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200"
      >
        <!-- Miniatura del Diseño -->
        <div
          @click="viewDesign(design.id)"
          class="h-48 w-full bg-gray-100 flex items-center justify-center cursor-pointer hover:opacity-90 transition"
        >
          <!-- Usar URL real del diseño o un placeholder -->
          <img
            :src="design.image_url"
            :alt="design.title"
            class="object-cover h-full w-full"
            onerror="this.onerror=null; this.src='https://placehold.co/300x200/cccccc/333333?text=Diseño';"
          />
        </div>

        <!-- Información y Acciones -->
        <div class="p-4">
          <h3 class="font-semibold text-gray-800 truncate">{{ design.title }}</h3>
          <p class="text-xs text-gray-500 mt-1">Subido: {{ design.date_uploaded }}</p>

          <div class="mt-3 flex justify-between text-sm">
            <!-- RF-10: Anotaciones (Cliente) -->
            <button
              @click="editAnnotation(design)"
              class="text-indigo-600 hover:text-indigo-800 font-medium"
            >
              Anotar / Comentar
            </button>

            <!-- Opción de eliminar (solo Tatuador) -->
            <button
              v-if="authStore.isTattooArtist"
              @click="deleteDesign(design.id)"
              class="text-red-500 hover:text-red-700 font-medium"
            >
              Eliminar
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modales -->
    <UploadDesignModal
      :isOpen="isUploadModalOpen"
      @close="isUploadModalOpen = false"
      @design-uploaded="fetchDesigns"
    />
    <AnnotationEditor
      :design="selectedDesign"
      :isOpen="isAnnotationModalOpen"
      @close="isAnnotationModalOpen = false"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { useAuthStore } from '../stores/auth'
import AnnotationEditor from '../components/AnnotationEditor.vue' // Se creará después
import UploadDesignModal from '../components/UploadDesignModal.vue' // Se creará después

const authStore = useAuthStore()
const router = useRouter()

const designs = ref([])
const loading = ref(true)
const isUploadModalOpen = ref(false)
const isAnnotationModalOpen = ref(false)
const selectedDesign = ref(null)

// Datos simulados (Reemplazar con API de Laravel)
const mockDesigns = [
  {
    id: 1,
    title: 'Dragón en espalda',
    image_url: 'https://placehold.co/300x200/cccccc/333333?text=Dragon',
    date_uploaded: '15/01/26',
  },
  {
    id: 2,
    title: 'Rosa realista',
    image_url: 'https://placehold.co/300x200/cccccc/333333?text=Rosa',
    date_uploaded: '15/01/26',
  },
  {
    id: 3,
    title: 'Frase en antebrazo',
    image_url: 'https://placehold.co/300x200/cccccc/333333?text=Frase',
    date_uploaded: '15/01/26',
  },
  {
    id: 4,
    title: 'Diseño 4',
    image_url: 'https://placehold.co/300x200/cccccc/333333?text=Diseno+4',
    date_uploaded: '15/01/26',
  },
]

// CU-07: Ver diseños
async function fetchDesigns() {
  loading.value = true
  try {
    // const response = await axios.get('/designs');
    // designs.value = response.data;

    designs.value = mockDesigns // Usar mock data
  } catch (error) {
    console.error('Error al cargar diseños:', error)
    designs.value = []
  } finally {
    loading.value = false
  }
}

// RF-9: Lógica de subida (solo para Tatuadores)
function openUploadModal() {
  isUploadModalOpen.value = true
}

// CU-08: Añadir anotaciones (Cliente)
function editAnnotation(design) {
  selectedDesign.value = design
  isAnnotationModalOpen.value = true
}

// CU-08: Ver diseño
function viewDesign(id) {
  // Redirigir a una vista de detalle o abrir el editor en modo solo lectura
  const design = designs.value.find((d) => d.id === id)
  editAnnotation(design)
}

// Lógica para eliminar diseño (solo Tatuador)
async function deleteDesign(id) {
  if (confirm('¿Estás seguro de eliminar este diseño?')) {
    try {
      await axios.delete(`/designs/${id}`)
      alert('Diseño eliminado.')
      fetchDesigns() // Recargar lista
    } catch (error) {
      alert('Error al eliminar el diseño.')
    }
  }
}

onMounted(() => {
  fetchDesigns()
})
</script>
