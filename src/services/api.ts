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
const _windowHost = typeof window !== 'undefined' ? window.location.hostname : 'localhost'
const _useDomainMode = _windowHost !== 'localhost' && _windowHost !== '127.0.0.1'
const _apiBase = _useDomainMode
  ? '/api'
  : (_rawApiUrl as string).replace(/\/$/, '') + '/api'

const apiClient = axios.create({
  baseURL: _apiBase,
  headers: {
    'Content-Type': 'application/json'
  }
})

const getTenantFromHost = (): string | undefined => {
  if (typeof window === 'undefined') return undefined
  const host = window.location.hostname.toLowerCase()

  const centralHosts = new Set(['localhost', '127.0.0.1', 'app.localhost'])
  if (centralHosts.has(host)) return undefined

  if (host.endsWith('.localhost')) {
    const label = host.split('.')[0]
    return label && label !== 'app' ? label : undefined
  }

  // Handle central production domains (they are central hosts, not subdomains for tenants)
  const centralProductionHosts = new Set(['grup1-sims.com', 'www.grup1-sims.com'])
  if (host.endsWith('.ondigitalocean.app') || centralProductionHosts.has(host)) {
    return undefined
  }

  const parts = host.split('.')
  if (parts.length >= 3) {
    const subdomain = parts[0]
    return subdomain && subdomain !== 'www' ? subdomain : undefined
  }

  return undefined
}
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

    // Get active tenant slug and add X-Tenant header.
    // Priority:
    // 1) Explicit per-request X-Tenant (super-admin cross-tenant views)
    // 2) Tenant inferred from host subdomain (preferred in multi-tenant domains)
    // 3) Cookie/localStorage fallback
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

    const tenantFromHost = getTenantFromHost()
    let resolvedTenant = tenantFromHost || tenant

    if (resolvedTenant && !config.headers?.['X-Tenant']) {
      config.headers['X-Tenant'] = decodeURIComponent(resolvedTenant as string)
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
