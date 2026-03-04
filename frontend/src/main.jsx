import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import axios from 'axios'
import './index.css'
import App from './App.jsx'

// ---------------------------------------------------------------------------
// Axios default configuration
//  - baseURL: allow services to use relative paths if desired
//  - request interceptor: attach auth token automatically
// ---------------------------------------------------------------------------
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL || ''

axios.interceptors.request.use(
  config => {
    // grab token from either storage location (session > local)
    const token = sessionStorage.getItem('token') || localStorage.getItem('token')
    if (token) {
      config.headers = config.headers || {}
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => Promise.reject(error)
)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
