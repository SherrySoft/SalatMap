import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/index.css'
import App from './App.jsx'
import { LanguageProvider } from './context/LanguageContext.jsx'

// Disable right-click context menu
document.addEventListener('contextmenu', (e) => e.preventDefault());

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <LanguageProvider>
      <App />
    </LanguageProvider>
  </StrictMode>,
)

