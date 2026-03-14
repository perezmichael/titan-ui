import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { DesignSystem } from './DesignSystem.tsx'

const isDesignSystem = window.location.pathname === '/design-system'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {isDesignSystem ? <DesignSystem /> : <App />}
  </StrictMode>,
)
