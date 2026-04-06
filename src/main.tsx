import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { DesignSystem } from './DesignSystem.tsx'
import { AuditReport } from './AuditReport.tsx'

const path = window.location.pathname
const isDesignSystem = path === '/design-system'
const isReport = path === '/report'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {isReport ? <AuditReport /> : isDesignSystem ? <DesignSystem /> : <App />}
  </StrictMode>,
)
