import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import SatelliteReport from './components/report/SatelliteReport.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SatelliteReport />
  </StrictMode>,
)
