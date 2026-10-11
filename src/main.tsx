import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, MemoryRouter } from 'react-router'
import './index.css'
import App from './App.tsx'

const Router = location.protocol === 'file:' ? MemoryRouter : BrowserRouter

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Router>
      <App />
    </Router>
  </StrictMode>,
)
