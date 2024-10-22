import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './config/i18next-config.js'
import App from './App.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
