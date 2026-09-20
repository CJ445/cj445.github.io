import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { initTheme } from './lib/theme'
import SatelliteReport from './components/report/SatelliteReport.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SatelliteReport />
  </StrictMode>,
)

initTheme()
