<template>
  <div class="min-h-screen bg-white font-sans text-gray-900">
    <!-- Navbar -->
    <nav class="fixed w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16 items-center">
          <!-- Logo -->
          <div class="flex items-center">
            <span class="text-2xl font-black tracking-tighter text-black">
              INK<span class="text-indigo-600">TATTOO</span>PRO
            </span>
          </div>

          <!-- Botones de Acción -->
          <div class="flex items-center space-x-4">
            <router-link
              to="/login"
              class="text-sm font-semibold text-gray-700 hover:text-indigo-600 transition"
            >
              Iniciar Sesión
            </router-link>
            <router-link
              to="/register"
              class="inline-flex items-center justify-center px-5 py-2.5 border border-transparent text-sm font-bold rounded-full text-white bg-black hover:bg-gray-800 transition shadow-lg hover:shadow-indigo-500/20"
            >
              Registrarse
            </router-link>
          </div>
        </div>
      </div>
    </nav>

    <!-- Hero Section -->
    <header class="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div class="text-center">
          <h1 class="text-5xl md:text-7xl font-extrabold tracking-tight text-gray-900 mb-6">
            El arte del tatuaje, <br />
            <span class="text-indigo-600">gestionado con maestría.</span>
          </h1>
          <p class="max-w-2xl mx-auto text-lg md:text-xl text-gray-600 mb-10">
            Conecta con los mejores artistas, gestiona tus citas y lleva tu estudio al siguiente
            nivel con la plataforma líder para profesionales del tatuaje.
          </p>
          <div class="flex flex-col sm:flex-row justify-center gap-4">
            <router-link
              to="/register"
              class="px-8 py-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 transition shadow-xl shadow-indigo-200"
            >
              Empezar ahora gratis
            </router-link>
          </div>
        </div>
      </div>

      <!-- Decoración de fondo (Círculos difuminados) -->
      <div class="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 pointer-events-none">
        <div
          class="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-100 rounded-full blur-[120px] opacity-50"
        ></div>
        <div
          class="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-purple-100 rounded-full blur-[120px] opacity-50"
        ></div>
      </div>
    </header>

    <!-- Características Rápidas -->
    <section class="py-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div class="space-y-4">
            <div
              class="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.827-1.213L3 20l1.391-3.951A9.115 9.115 0 013 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </div>
            <h3 class="text-xl font-bold">Chat en Tiempo Real</h3>
            <p class="text-gray-600">
              Habla directamente con tus clientes o artistas favoritos para concretar detalles de
              forma segura.
            </p>
          </div>

          <div class="space-y-4">
            <div
              class="w-12 h-12 bg-black rounded-xl flex items-center justify-center text-white shadow-lg shadow-gray-200"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h3 class="text-xl font-bold">Galería de Trabajos</h3>
            <p class="text-gray-600">
              Muestra tus mejores piezas y deja que el mundo descubra tu estilo único como tatuador.
            </p>
          </div>

          <div class="space-y-4">
            <div
              class="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-green-100"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 class="text-xl font-bold">Gestión de Citas</h3>
            <p class="text-gray-600">
              Organiza tu agenda de forma automática y evita solapamientos o cancelaciones de última
              hora.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer Simple -->
    <footer class="bg-white border-t border-gray-100 py-12">
      <div class="max-w-7xl mx-auto px-4 text-center">
        <p class="text-gray-400 text-sm">© 2024 InkTattooPro. Todos los derechos reservados.</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
// No necesitamos lógica compleja para esta vista de presentación
</script>

<style scoped>
/* Transición suave para los botones */
.router-link-active {
  color: #4f46e5;
}
</style>
