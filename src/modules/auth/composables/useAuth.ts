import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import apiClient from '@/services/api'
import type { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse, User, UserResponse } from '../interfaces/auth.interface'
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

export function useAuth() {
  const router = useRouter()

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

    // Persist tenant slug before the request so axios sends X-Tenant from the start
    setCookie(TENANT_COOKIE_NAME, tenantSlug.toLowerCase())

    try {
      const loginData: LoginRequest = { email, password }
      const response = await apiClient.post<LoginResponse>('/login', loginData)

      const token = response.data.token
      
      if (token) {
        setCookie(TOKEN_COOKIE_NAME, token)
        // Ensure the immediate follow-up /user request uses the fresh token.
        apiClient.defaults.headers.common.Authorization = `Bearer ${token}`
        // Fetch user data after successful login
        const userFetched = await fetchUser()
        // Update tenant cookie from actual user data (source of truth)
        if (userFetched && user.value?.tenant_id) {
          setCookie(TENANT_COOKIE_NAME, user.value.tenant_id)
        } else if (!userFetched) {
          // Login failed after token – remove tenant cookie
          deleteCookie(TENANT_COOKIE_NAME)
        }
        return userFetched
      } else {
        error.value = 'No token received from server'
        return false
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Error logging in'
      error.value = msg
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
    login,
    register,
    logout
  }
}
