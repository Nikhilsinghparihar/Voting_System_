import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import BusMap from './App.jsx'
// import TrackingMap from './blank.jsx'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BusMap />
    {/* <TrackingMap /> */}
  </StrictMode>,
)