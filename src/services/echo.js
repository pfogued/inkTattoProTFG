// src/services/echo.js
import Echo from 'laravel-echo'
import Pusher from 'pusher-js'

window.Pusher = Pusher

// Configuración para conectarse a tu backend de Laravel
const EchoInstance = new Echo({
  broadcaster: 'pusher',
  key: import.meta.env.VITE_PUSHER_APP_KEY || 'pusher_app_key_de_tu_laravel',

  // **AÑADIR ESTA LÍNEA:** Cluster predeterminado
  cluster: 'mt1',

  wsHost: import.meta.env.VITE_PUSHER_HOST || 'localhost',
  wsPort: import.meta.env.VITE_PUSHER_PORT || 6001,
  forceTLS: false,
  disableStats: true,
  auth: {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
    },
  },
})

export default EchoInstance
