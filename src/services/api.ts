import axios from 'axios'
import showToast from '@/modules/common/composables/useToast'

// NOTE: previous comment contained Spanish/Catalan; translated to English
// This file configures axios to use the API based on cookies.
// If stronger security is required, httpOnly cookies would be preferable,
// but then the frontend cannot access the token to add it to requests.
// For now the token is read from cookies and added to request headers.
// Improve security later as needed.

// Normalize API base URL and ensure it points to the backend API prefix (/api)
const _rawApiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8001'
const _apiBase = (_rawApiUrl as string).replace(/\/$/, '') + '/api'

const apiClient = axios.create({
  baseURL: _apiBase,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Interceptor to add token and tenant to all requests
apiClient.interceptors.request.use(
  (config) => {
    // Get token from cookies
    const token = document.cookie
      .split('; ')
      .find((row) => row.startsWith('token='))
      ?.split('=')[1]

    if (token) {
      config.headers.Authorization = `Bearer ${decodeURIComponent(token)}`
    }

    // Get active tenant slug from cookie (or localStorage fallback) and add X-Tenant header.
    // Respect explicit per-request X-Tenant (used by Super Admin cross-tenant views).
    let tenant = document.cookie
      .split('; ')
      .find((row) => row.startsWith('tenant='))
      ?.split('=')[1]

    if (!tenant) {
      // Some flows set the active tenant in localStorage (admin workspace). Use it as fallback.
      try {
        tenant = localStorage.getItem('active_admin_tenant') || undefined
      } catch (e) {
        // ignore (e.g., SSR or blocked access)
        tenant = undefined
      }
    }

    if (tenant && !config.headers?.['X-Tenant']) {
      config.headers['X-Tenant'] = decodeURIComponent(tenant as string)
    }

    return config
  },
  (error) => {
    const msg = error?.message || 'Request error'
    try {
      showToast(msg)
    } catch (e) {
      console.error(e)
    }
    return Promise.reject(error)
  }
)
export default apiClient
