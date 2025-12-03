// src/services/echo.js
import Echo from 'laravel-echo'
import Pusher from 'pusher-js' // Necesitas instalar este paquete: npm install pusher-js

window.Pusher = Pusher

// Configuración para conectarse a tu backend de Laravel
// NOTA: Ajusta el 'key' y 'wsHost' a la configuración de tu archivo .env de Laravel
const EchoInstance = new Echo({
  broadcaster: 'pusher',
  key: import.meta.env.VITE_PUSHER_APP_KEY || 'pusher_app_key_de_tu_laravel',
  wsHost: import.meta.env.VITE_PUSHER_HOST || 'localhost',
  wsPort: import.meta.env.VITE_PUSHER_PORT || 6001, // Puerto por defecto de WebSockets en Laravel
  forceTLS: false, // Cambiar a true si usas HTTPS en producción
  disableStats: true,
  auth: {
    // Enviar el token de autenticación en las peticiones privadas (authStore lo inyectará)
    headers: {
      Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
    },
  },
})

export default EchoInstance
