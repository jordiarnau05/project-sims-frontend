import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'

const isMobile = typeof window !== 'undefined' && window.innerWidth < 768
const baseToastOptions = {
  theme: 'dark' as const,
  position: (isMobile ? 'top-right' : 'bottom-right') as import('vue3-toastify').ToastPosition,
  pauseOnHover: true,
  pauseOnFocusLoss: true,
}

function formatMessage(payload: string | Error | unknown) {
  if (typeof payload === 'string') return payload
  if (payload instanceof Error) return payload.message
  try {
    return JSON.stringify(payload)
  } catch {
    return String(payload)
  }
}

export function showToast(payload: string | Error | unknown) {
  const message = formatMessage(payload)
  toast(message, {
    ...baseToastOptions,
    type: 'error',
  })
}

export function useToast() {
  return {
    success: (message: string | Error | unknown) => {
      const msg = formatMessage(message)
      toast(msg, {
        ...baseToastOptions,
        type: 'success',
      })
    },
    error: (message: string | Error | unknown) => {
      const msg = formatMessage(message)
      toast(msg, {
        ...baseToastOptions,
        type: 'error',
      })
    }
  }
}

export default showToast
