<template>
  <div
    class="min-h-screen bg-white font-sans text-gray-900 selection:bg-black selection:text-white"
  >
    <!-- Navegación Principal -->
    <nav class="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/80 backdrop-blur-md">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-20">
          <!-- Logo -->
          <router-link to="/" class="flex items-center gap-3 group">
            <div
              class="w-11 h-11 bg-black rounded-2xl flex items-center justify-center shadow-xl group-hover:rotate-6 transition-all duration-300"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="w-6 h-6 text-white"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <span class="text-2xl font-black tracking-tighter text-black">InkTattooPro</span>
          </router-link>

          <!-- Menú Central -->
          <div class="hidden md:flex items-center space-x-10">
            <a href="#" class="text-sm font-bold text-gray-500 hover:text-black transition-colors"
              >Explorar</a
            >
            <!-- Este botón ahora sí funcionará porque la ruta ya existe -->
            <router-link
              to="/artistas"
              class="text-sm font-bold text-gray-500 hover:text-black transition-colors"
            >
              Artistas
            </router-link>
          </div>

          <!-- Acciones -->
          <div class="flex items-center gap-4">
            <router-link
              to="/login"
              class="hidden sm:block px-5 py-2.5 text-sm font-bold text-gray-700 hover:bg-gray-100 rounded-xl transition-all"
            >
              Iniciar Sesión
            </router-link>
            <router-link
              to="/register"
              class="px-6 py-3 text-sm font-bold text-white bg-black rounded-xl hover:bg-zinc-800 shadow-lg transition-all active:scale-95"
            >
              Registrarse
            </router-link>
          </div>
        </div>
      </div>
    </nav>

    <!-- Hero Section -->
    <main class="relative pt-20 pb-32 overflow-hidden text-center">
      <h1 class="text-6xl md:text-8xl font-black tracking-tight text-black leading-[0.9] mb-8">
        EL ARTE DE <br />
        <span class="text-gray-400">GESTIONAR TINTA.</span>
      </h1>
      <p class="max-w-2xl mx-auto text-xl text-gray-500 mb-12">
        La plataforma profesional para tatuadores.
      </p>
      <div class="flex justify-center gap-5">
        <router-link
          to="/register"
          class="px-10 py-5 bg-black text-white rounded-2xl font-bold text-lg hover:shadow-2xl transition-all"
        >
          Empezar ahora
        </router-link>
      </div>
    </main>
  </div>
</template>

<script setup>
// Código limpio
</script>
