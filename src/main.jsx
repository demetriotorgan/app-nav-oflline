import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { registerSW } from 'virtual:pwa-register'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// Registra o Service Worker para permitir cache offline
registerSW({
  immediate: true,
  onNeedRefresh() {
    console.log('🔄 Novo conteúdo disponível, atualize a página.')
  },
  onOfflineReady() {
    console.log('📴 App pronto para uso offline!')
  },
})