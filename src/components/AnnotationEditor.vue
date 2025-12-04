<template>
  <!-- Modal de Anotación (Mockup 7) -->
  <div
    v-if="isOpen && design"
    class="fixed inset-0 z-50 overflow-y-auto bg-gray-600 bg-opacity-75 flex items-center justify-center p-4"
  >
    <div class="bg-white rounded-lg shadow-2xl w-full max-w-5xl h-[90vh] flex flex-col">
      <!-- Encabezado del Editor -->
      <header class="flex justify-between items-center p-4 border-b">
        <h3 class="text-xl font-semibold">Editar Anotaciones en: {{ design.title }}</h3>
        <button @click="closeEditor" class="text-gray-400 hover:text-gray-600">&times;</button>
      </header>

      <div class="flex flex-grow overflow-hidden">
        <!-- Panel de Herramientas (Mockup 7) -->
        <aside class="w-48 bg-gray-50 p-4 border-r space-y-4 flex flex-col">
          <h4 class="font-bold mb-2">Herramientas</h4>

          <button
            @click="setDrawingMode('pencil')"
            :class="{ 'bg-indigo-100': tool === 'pencil' }"
            class="w-full py-2 border rounded hover:bg-indigo-50 transition"
          >
            Lápiz
          </button>
          <button
            @click="setDrawingMode('marker')"
            :class="{ 'bg-indigo-100': tool === 'marker' }"
            class="w-full py-2 border rounded hover:bg-indigo-50 transition"
          >
            Marcador
          </button>
          <button
            @click="setDrawingMode('text')"
            :class="{ 'bg-indigo-100': tool === 'text' }"
            class="w-full py-2 border rounded hover:bg-indigo-50 transition"
          >
            Texto
          </button>
          <button
            @click="setDrawingMode('erase')"
            :class="{ 'bg-indigo-100': tool === 'erase' }"
            class="w-full py-2 border rounded hover:bg-indigo-50 transition"
          >
            Borrador
          </button>

          <!-- Selector de Color -->
          <div class="pt-4 border-t">
            <h4 class="text-sm font-bold mb-2">Color</h4>
            <input
              type="color"
              v-model="color"
              @input="updateBrush"
              class="w-full h-8 cursor-pointer border-none p-0"
            />
          </div>

          <!-- Grosor del Pincel -->
          <div class="pt-4 border-t">
            <h4 class="text-sm font-bold mb-2">Grosor</h4>
            <input
              type="range"
              min="1"
              max="50"
              v-model="brushWidth"
              @input="updateBrush"
              class="w-full"
            />
            <span class="text-xs text-gray-500">{{ brushWidth }}px</span>
          </div>
        </aside>

        <!-- Área de Canvas (RF-10) -->
        <div
          class="flex-grow flex items-center justify-center p-4 bg-gray-100 overflow-auto relative"
        >
          <canvas id="annotationCanvas" class="shadow-xl border border-gray-300"></canvas>
          <div
            v-if="loadingImage"
            class="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center"
          >
            Cargando imagen...
          </div>
        </div>
      </div>

      <!-- Footer y Botones de Acción -->
      <footer class="p-4 border-t flex justify-end space-x-3 bg-gray-50">
        <button
          @click="closeEditor"
          class="px-4 py-2 border rounded-xl text-gray-700 hover:bg-gray-200 transition"
        >
          Cancelar
        </button>
        <button
          @click="saveAnnotations"
          class="px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition"
        >
          Guardar Anotaciones
        </button>
      </footer>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue'
import * as fabric from 'fabric' // Importación de la librería Fabric.js
import axios from 'axios'

const props = defineProps({
  isOpen: Boolean,
  design: Object, // El objeto del diseño a anotar (id, image_url)
})

const emit = defineEmits(['close'])

const canvas = ref(null)
const loadingImage = ref(true)
const tool = ref('pencil')
const color = ref('#ff0000')
const brushWidth = ref(5)
const textCounter = ref(1)

// Inicializa Fabric.js cuando se abre el modal
watch(
  () => props.isOpen,
  (newVal) => {
    if (newVal) {
      // Usamos nextTick para asegurarnos de que el modal esté visible antes de intentar crear el canvas
      onMounted(() => initializeCanvas())
    }
  },
)

// Función de inicialización del Canvas
const initializeCanvas = () => {
  // 1. Crear la instancia de Canvas
  if (!canvas.value) {
    canvas.value = new fabric.Canvas('annotationCanvas', {
      isDrawingMode: false,
      selection: true,
      hoverCursor: 'pointer',
    })
    // Establecer el pincel por defecto
    updateBrush()
  }

  // 2. Cargar la imagen de fondo (diseño)
  if (props.design?.image_url) {
    loadingImage.value = true
    fabric.Image.fromURL(props.design.image_url, function (img) {
      // Ajustar el tamaño del canvas al tamaño de la imagen (Mockup 7)
      canvas.value.setWidth(img.width)
      canvas.value.setHeight(img.height)

      // Establecer la imagen como fondo
      canvas.value.setBackgroundImage(img, canvas.value.renderAll.bind(canvas.value), {
        scaleX: canvas.value.width / img.width,
        scaleY: canvas.value.height / img.height,
        originX: 'left',
        originY: 'top',
      })
      loadingImage.value = false
    })
  }

  setDrawingMode(tool.value) // Activar el modo de dibujo inicial
}

// CU-08: Cambiar el modo de herramienta
const setDrawingMode = (newTool) => {
  tool.value = newTool
  canvas.value.isDrawingMode = false

  if (tool.value === 'pencil' || tool.value === 'marker') {
    canvas.value.isDrawingMode = true
    canvas.value.selection = false
  } else if (tool.value === 'text') {
    canvas.value.selection = false
    addText() // Añade un objeto de texto al cambiar
  } else if (tool.value === 'erase') {
    // Permite seleccionar objetos (líneas, texto) para que el usuario los borre manualmente
    canvas.value.selection = true
    canvas.value.on('mouse:down', function (options) {
      if (options.target) {
        canvas.value.remove(options.target)
      }
    })
  }
}

const updateBrush = () => {
  if (canvas.value) {
    canvas.value.freeDrawingBrush.color = color.value
    canvas.value.freeDrawingBrush.width = parseInt(brushWidth.value)
  }
}

// Añadir un objeto de texto al canvas
const addText = () => {
  const textObject = new fabric.IText(`Comentario ${textCounter.value++}`, {
    left: 50,
    top: 50,
    fill: color.value,
    fontSize: 24,
  })
  canvas.value.add(textObject)
  canvas.value.renderAll()
}

// CU-08: Guardar las anotaciones
async function saveAnnotations() {
  if (!canvas.value) return

  // 1. Exportar el canvas como una imagen base64 con todas las anotaciones
  const dataURL = canvas.value.toDataURL({
    format: 'png',
    multiplier: 1.5, // Aumentar resolución
  })

  try {
    // 2. Enviar los datos del canvas a la API de Laravel (RF-10)
    await axios.post(`/designs/${props.design.id}/annotate`, {
      annotation_image: dataURL,
    })

    alert('Anotaciones guardadas con éxito!')
    closeEditor()
  } catch (error) {
    console.error('Error al guardar anotaciones:', error)
    alert('Error al guardar las anotaciones. Inténtalo de nuevo.')
  }
}

const closeEditor = () => {
  // Limpiar el canvas antes de cerrar
  if (canvas.value) {
    canvas.value.clear()
    canvas.value.dispose()
    canvas.value = null
  }
  emit('close')
}

onUnmounted(() => {
  if (canvas.value) {
    canvas.value.dispose()
  }
})
</script>
