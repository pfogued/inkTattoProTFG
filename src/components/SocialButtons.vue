<template>
  <div class="mt-6">
    <div class="relative">
      <div class="absolute inset-0 flex items-center">
        <div class="w-full border-t border-gray-300"></div>
      </div>
      <div class="relative flex justify-center text-sm">
        <span class="px-2 bg-white text-gray-500 font-medium">O continúa con</span>
      </div>
    </div>

    <div class="mt-6 grid grid-cols-2 gap-4">
      <!-- Botón Google -->
      <a
        href="http://localhost:8000/api/auth/google/redirect"
        class="w-full inline-flex justify-center py-2.5 px-4 border border-gray-300 rounded-xl shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all duration-200"
      >
        <svg class="w-5 h-5" viewBox="0 0 24 24">
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.47 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z"
          />
        </svg>
        <span class="ml-2">Google</span>
      </a>

      <!-- Botón Apple -->
      <a
        href="#"
        class="w-full inline-flex justify-center py-2.5 px-4 border border-transparent rounded-xl shadow-sm bg-black text-sm font-medium text-white hover:bg-gray-900 transition-all duration-200"
      >
        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path
            d="M17.057 12.781c.018 2.583 2.235 3.445 2.261 3.453-.021.073-.354 1.209-1.154 2.378-.691 1.012-1.41 2.019-2.54 2.039-1.112.019-1.472-.659-2.742-.659-1.269 0-1.666.639-2.722.679-1.092.039-1.921-1.109-2.615-2.122-1.419-2.064-2.503-5.83-1.041-8.361.725-1.258 2.018-2.053 3.418-2.073 1.066-.02 2.074.719 2.727.719.654 0 1.868-.899 3.129-.773.53.022 2.02.212 2.977 1.61-.077.047-1.776 1.033-1.758 3.102zM15.029 4.316c.58-.703.968-1.681.861-2.657-.84.034-1.854.559-2.456 1.262-.54.629-.915 1.631-.786 2.583.935.072 1.874-.523 2.381-1.188z"
          />
        </svg>
        <span class="ml-2">Apple</span>
      </a>
    </div>
  </div>
</template>
