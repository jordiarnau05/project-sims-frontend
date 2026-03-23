import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import apiClient from '@/services/api'
import type { CentralLoginResponse, LoginRequest, LoginResponse, RegisterRequest, RegisterResponse, User, UserResponse } from '../interfaces/auth.interface'
import showToast from '@/modules/common/composables/useToast'

const TOKEN_COOKIE_NAME  = 'token'
const TENANT_COOKIE_NAME = 'tenant'

// Helper functions to manage cookies
function getCookie(name: string): string | null {
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) {
    const raw = parts.pop()?.split(';').shift() || null
    return raw ? decodeURIComponent(raw) : null
  }
  return null
}

function setCookie(name: string, value: string, days: number = 7): void {
  const date = new Date()
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000)
  const expires = `expires=${date.toUTCString()}`
  document.cookie = `${name}=${encodeURIComponent(value)};${expires};path=/`
}

// Deletes cookie by setting its expiration date in the past
function deleteCookie(name: string): void {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/`
}

// Global state shared across all useAuth() calls
const isLoading = ref(false)
const error = ref<string | null>(null)
const user = ref<User | null>(null)

const isAuthenticated = computed(() => !!user.value)

const normalizeTenantSlug = (input: string): string => {
  // Accept user-friendly org names and normalize to a slug expected by the API.
  // Examples: "SIMS Corp" -> "sims-corp", "ecomove" -> "ecomove".
  return String(input || '')
    .trim()
    .toLowerCase()
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

const formatApiError = (err: any, fallbackMsg: string): string => {
  const status = err?.response?.status
  const data = err?.response?.data
  const message = data?.message || err?.message || fallbackMsg
  if (status) return `${message} (HTTP ${status})`
  return message
}

const looksLikeTenancyHeaderError = (err: any): boolean => {
  const status = err?.response?.status
  const msg = String(err?.response?.data?.message || '').toLowerCase()
  if (status === 422 && (msg.includes('tenant') || msg.includes('x-tenant'))) return true
  if (status === 500 && (msg.includes('tenant') || msg.includes('tenancy'))) return true
  return false
}
export function useAuth() {
  const router = useRouter()

  const isCentralHost = (): boolean => {
    if (typeof window === 'undefined') return false
    const host = window.location.hostname.toLowerCase()

    const forced = String((import.meta as any)?.env?.VITE_FORCE_CENTRAL_LOGIN || '').toLowerCase()
    if (['true', '1', 'yes'].includes(forced)) return true

    const configuredCentralHosts = String((import.meta as any)?.env?.VITE_CENTRAL_HOSTNAMES || '')
      .split(',')
      .map(s => s.trim().toLowerCase())
      .filter(Boolean)
    if (configuredCentralHosts.includes(host)) return true

    if (host === 'localhost' || host === '127.0.0.1' || host === 'app.localhost') return true

    if (host.endsWith('.ondigitalocean.app')) {
      const parts = host.split('.')
      if (parts.length === 3) return true
    }

    return false
  }

  const redirectToTenantDomain = (tenantHost: string, exchangeToken: string, tenantRef: string): void => {
    const protocol = window.location.protocol
    const portSuffix = window.location.port ? `:${window.location.port}` : ''
    const tenantUrl = `${protocol}//${tenantHost}${portSuffix}/auth/callback?exchange_token=${encodeURIComponent(exchangeToken)}&tenant=${encodeURIComponent(tenantRef)}`
    window.location.assign(tenantUrl)
  }

  const getToken = (): string | null => {
    return getCookie(TOKEN_COOKIE_NAME)
  }

  const fetchUser = async (): Promise<boolean> => {
    isLoading.value = true
    error.value = null
    try {
      const response = await apiClient.get<UserResponse>('/user')
      // Merge instead of overwrite to avoid losing existing reactive refs or fields
      user.value = Object.assign({}, user.value || {}, response.data.user)
      return true
    } catch (err: any) {
      if (err.response?.status === 401) {
        // Token is invalid or expired
        deleteCookie(TOKEN_COOKIE_NAME)
        user.value = null
      }
      return false
    } finally {
      isLoading.value = false
    }
  }

  const login = async (tenantSlug: string, email: string, password: string): Promise<boolean> => {
    isLoading.value = true
    error.value = null

    const normalizedTenant = normalizeTenantSlug(tenantSlug)
    if (!normalizedTenant) {
      error.value = 'Organization is required'
      isLoading.value = false
      return false
    }
    const tryCentralLogin = async (): Promise<boolean> => {
      const response = await apiClient.post<CentralLoginResponse>('/central/login', {
        organization: normalizedTenant,
        email,
        password,
      })

      const tenantRef = response.data.tenant_id || normalizedTenant
      redirectToTenantDomain(response.data.tenant_host, response.data.exchange_token, tenantRef)
      return false
    }

    // Central domain login: authenticate once and redirect user to tenant subdomain.
    if (isCentralHost()) {
      try {
        return await tryCentralLogin()
      } catch (err: any) {
        error.value = formatApiError(err, 'Error logging in')
        return false
      } finally {
        isLoading.value = false
      }
    }

    // Tenant-domain login flow (same-domain session)
    setCookie(TENANT_COOKIE_NAME, normalizedTenant)

    try {
      const loginData: LoginRequest = { email, password }
      const response = await apiClient.post<LoginResponse>('/login', loginData, {
        headers: {
          'X-Tenant': normalizedTenant,
        },
      })

      const token = response.data.token
      
      if (token) {
        setCookie(TOKEN_COOKIE_NAME, token)
        // Ensure the immediate follow-up /user request uses the fresh token.
        apiClient.defaults.headers.common.Authorization = `Bearer ${token}`
        // Fetch user data after successful login
        const userFetched = await fetchUser()
        // Keep tenant cookie as a valid slug (X-Tenant). Some backends return tenant_id
        // as a numeric/uuid; only accept it if it looks like a slug.
        if (userFetched) {
          const tenantFromUser = typeof (user.value as any)?.tenant_id === 'string'
            ? normalizeTenantSlug((user.value as any).tenant_id)
            : ''
          setCookie(TENANT_COOKIE_NAME, tenantFromUser || normalizedTenant)
          try { localStorage.setItem('active_admin_tenant', tenantFromUser || normalizedTenant) } catch {}
        } else {
          // Login failed after token – remove tenant cookie
          deleteCookie(TENANT_COOKIE_NAME)
        }
        return userFetched
      } else {
        error.value = 'No token received from server'
        return false
      }
    } catch (err: any) {
      const status = err?.response?.status
      if (looksLikeTenancyHeaderError(err) || status === 500) {
        try {
          return await tryCentralLogin()
        } catch (err2: any) {
          error.value = formatApiError(err2, 'Error logging in')
          deleteCookie(TENANT_COOKIE_NAME)
          return false
        } finally {
          isLoading.value = false
        }
      }

      error.value = formatApiError(err, 'Error logging in')
      deleteCookie(TENANT_COOKIE_NAME)
      return false
    } finally {
      isLoading.value = false
    }
  }

  const completeTenantRedirectLogin = async (exchangeToken: string, tenantSlug: string): Promise<boolean> => {
    isLoading.value = true
    error.value = null

    try {
      const normalizedTenant = normalizeTenantSlug(tenantSlug)
      setCookie(TENANT_COOKIE_NAME, normalizedTenant)
      localStorage.setItem('active_admin_tenant', normalizedTenant)

      const response = await apiClient.post<LoginResponse>('/auth/exchange-token', {
        exchange_token: exchangeToken,
      })

      const token = response.data.token
      if (!token) {
        error.value = 'No token received from exchange endpoint'
        deleteCookie(TOKEN_COOKIE_NAME)
        deleteCookie(TENANT_COOKIE_NAME)
        return false
      }

      setCookie(TOKEN_COOKIE_NAME, token)
      apiClient.defaults.headers.common.Authorization = `Bearer ${token}`

      const userFetched = await fetchUser()
      if (userFetched) {
        const tenantFromUser = typeof (user.value as any)?.tenant_id === 'string'
          ? normalizeTenantSlug((user.value as any).tenant_id)
          : ''
        setCookie(TENANT_COOKIE_NAME, tenantFromUser || normalizedTenant)
        try { localStorage.setItem('active_admin_tenant', tenantFromUser || normalizedTenant) } catch {}
      }

      return userFetched
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Error completing login'
      error.value = msg
      deleteCookie(TOKEN_COOKIE_NAME)
      deleteCookie(TENANT_COOKIE_NAME)
      return false
    } finally {
      isLoading.value = false
    }
  }

  const logout = async (): Promise<void> => {
    try {
      // Call backend to revoke token
      await apiClient.post('/logout')
      // Clear local state
      deleteCookie(TOKEN_COOKIE_NAME)
      deleteCookie(TENANT_COOKIE_NAME)
      user.value = null
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Error during logout'
      showToast(errorMsg)
      throw err
    }
  }

  const register = async (name: string, username: string, email: string, password: string) => {
    isLoading.value = true
    error.value = null
    try {
      const registerData: RegisterRequest = {
        name,
        username,
        email,
        password,
        role_id: 2 // Client role ID is always 2, this might be not ideal but I dont care
      }
      if (await apiClient.post<RegisterResponse>('/users', registerData)) router.push('/login')
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Error registering'
      showToast(msg)
    } finally {
      isLoading.value = false
    }
  }

  return {
    isLoading,
    error,
    user,
    isAuthenticated,
    getToken,
    fetchUser,
    completeTenantRedirectLogin,
    login,
    register,
    logout
  }
}