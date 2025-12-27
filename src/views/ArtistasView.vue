<template>
  <div
    class="min-h-screen bg-gray-50 font-sans text-gray-900 selection:bg-black selection:text-white"
  >
    <!-- Navegación -->
    <nav class="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-md">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-20">
          <router-link to="/" class="flex items-center gap-3">
            <div class="w-10 h-10 bg-black rounded-xl flex items-center justify-center shadow-lg">
              <span class="text-white font-black text-xl">I</span>
            </div>
            <span class="text-xl font-bold tracking-tighter">InkTattooPro</span>
          </router-link>

          <div class="flex items-center gap-4">
            <router-link
              to="/login"
              class="text-sm font-bold text-gray-600 hover:text-black transition-colors"
              >Mi Cuenta</router-link
            >
          </div>
        </div>
      </div>
    </nav>

    <header class="bg-white border-b border-gray-100 py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 class="text-5xl font-black tracking-tight mb-4 tracking-tighter">
          Directorio de Artistas
        </h1>
        <p class="text-gray-500 text-xl max-w-2xl mx-auto font-medium leading-relaxed">
          Descubre el talento de nuestra comunidad.
        </p>
      </div>
    </header>

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <!-- Grid de Artistas -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        <div
          v-for="artista in artistas"
          :key="artista.id"
          class="bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300"
        >
          <!-- Cover -->
          <div class="h-48 relative overflow-hidden">
            <img
              :src="artista.cover"
              class="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
            />
          </div>

          <div class="p-8 pt-12 relative">
            <!-- Avatar -->
            <div class="absolute -top-10 left-8">
              <img
                :src="artista.avatar"
                class="w-20 h-20 rounded-2xl border-4 border-white shadow-xl object-cover"
              />
            </div>

            <h2 class="text-2xl font-black mb-1 text-black">{{ artista.nombre }}</h2>
            <p class="text-gray-400 font-bold text-sm mb-4">{{ artista.especialidad }}</p>

            <!-- Valoraciones -->
            <div
              class="flex items-center gap-3 bg-gray-50 p-4 rounded-2xl border border-gray-100 mb-6"
            >
              <div class="flex text-yellow-400">
                <svg
                  v-for="i in 5"
                  :key="i"
                  class="w-5 h-5"
                  :fill="i <= Math.floor(artista.rating) ? 'currentColor' : 'none'"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.518 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.921-.755 1.688-1.54 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.784.57-1.838-.197-1.539-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                  />
                </svg>
              </div>
              <span class="font-black text-xl text-black">{{ artista.rating }}</span>
              <span class="text-xs text-gray-400 font-bold">({{ artista.votos }} reseñas)</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const artistas = ref([
  {
    id: 1,
    nombre: 'Roberto Martínez',
    especialidad: 'Realismo & Retrato',
    rating: 4.9,
    votos: 128,
    avatar: 'https://i.pravatar.cc/150?u=elena',
    cover: 'https://images.unsplash.com/photo-1598371839696-5c5bb00bdc28?q=80&w=600',
  },
  {
    id: 2,
    nombre: 'Marcos Ink',
    especialidad: 'Blackwork & Geométrico',
    rating: 4.7,
    votos: 94,
    avatar: 'https://i.pravatar.cc/150?u=marcos',
    cover: 'https://images.unsplash.com/photo-1560707303-4e980ce876ad?q=80&w=600',
  },
  {
    id: 3,
    nombre: 'Sara Gold',
    especialidad: 'Tradicional & Color',
    rating: 5.0,
    votos: 215,
    avatar: 'https://i.pravatar.cc/150?u=sara',
    cover: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=600',
  },
])
</script>
