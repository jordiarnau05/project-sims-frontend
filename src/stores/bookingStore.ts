import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import apiClient from '@/services/api'

export interface Booking {
  id: number
  user_id: number
  vehicle_id: number
  tenant_id: number
  scheduled_start: string
  scheduled_end: string
  activation_deadline: string
  total_price: number
  status: 'pending' | 'active' | 'completed' | 'cancelled' | 'confirmed'
  cancelled_at?: string | null
  cancellation_fee?: number | null
  created_at?: string
  updated_at?: string
  // Relacions
  user?: {
    id: number
    name: string
    email: string
  }
  vehicle?: {
    id: number
    license_plate: string
    brand: string
    model: string
  }
  trip?: {
    id: number
    minutes_driven: number
    total_amount: number
    engine_started_at: string
  }
}

export const useBookingStore = defineStore('booking', () => {
  // State
  const bookings = ref<Booking[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const selectedBooking = ref<Booking | null>(null)

  // Getters
  const pendingBookings = computed(() => 
    bookings.value.filter(b => b.status === 'pending')
  )

  const activeBookings = computed(() => 
    bookings.value.filter(b => b.status === 'active')
  )

  const completedBookings = computed(() => 
    bookings.value.filter(b => b.status === 'completed')
  )

  const cancelledBookings = computed(() => 
    bookings.value.filter(b => b.status === 'cancelled')
  )

  const extractCollection = (payload: any): any[] => {
    if (Array.isArray(payload)) return payload
    if (!payload || typeof payload !== 'object') return []

    const candidates = [
      payload.data,
      payload.reservations,
      payload.bookings,
      payload.results,
    ]

    for (const candidate of candidates) {
      if (Array.isArray(candidate)) return candidate
      if (candidate && typeof candidate === 'object' && Array.isArray(candidate.data)) {
        return candidate.data
      }
    }

    return []
  }

  // Actions
  async function fetchBookings() {
    loading.value = true
    error.value = null
    
    try {
      const response = await apiClient.get('/reservations')
      const bookingsData = extractCollection(response.data)
      
      bookings.value = bookingsData
      return bookings.value
    } catch (err: any) {
      error.value = err.message || 'Error fetching bookings'
      console.error('Error fetching bookings:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchBookingById(id: number) {
    loading.value = true
    error.value = null
    
    try {
      const response = await apiClient.get(`/reservations/${id}`)
      selectedBooking.value = response.data
      return selectedBooking.value
    } catch (err: any) {
      error.value = err.message || 'Error fetching booking'
      console.error('Error fetching booking:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function createBooking(bookingData: Partial<Booking>) {
    loading.value = true
    error.value = null
    
    try {
      const response = await apiClient.post('/reservations', bookingData)
      const newBooking = response.data
      bookings.value.push(newBooking)
      return newBooking
    } catch (err: any) {
      error.value = err.message || 'Error creating booking'
      console.error('Error creating booking:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updateBooking(id: number, bookingData: Partial<Booking>) {
    loading.value = true
    error.value = null
    
    try {
      const response = await apiClient.put(`/reservations/${id}`, bookingData)
      const updatedBooking = response.data
      
      const index = bookings.value.findIndex(b => b.id === id)
      if (index !== -1) {
        bookings.value[index] = updatedBooking
      }
      
      if (selectedBooking.value?.id === id) {
        selectedBooking.value = updatedBooking
      }
      
      return updatedBooking
    } catch (err: any) {
      error.value = err.message || 'Error updating booking'
      console.error('Error updating booking:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function deleteBooking(id: number) {
    loading.value = true
    error.value = null
    
    try {
      // Si la reserva està activa o pending, primer la cancel·lem
      const booking = bookings.value.find(b => b.id === id)
      if (booking && (booking.status === 'active' || booking.status === 'pending')) {
        await apiClient.post(`/reservations/${id}/cancel`)
      }
      
      await apiClient.delete(`/reservations/${id}`)
      bookings.value = bookings.value.filter(b => b.id !== id)
      
      if (selectedBooking.value?.id === id) {
        selectedBooking.value = null
      }
    } catch (err: any) {
      error.value = err.message || 'Error deleting booking'
      console.error('Error deleting booking:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function cancelBooking(id: number) {
    loading.value = true
    error.value = null
    
    try {
      const response = await apiClient.post(`/reservations/${id}/cancel`)
      const cancelledBooking = response.data
      
      const index = bookings.value.findIndex(b => b.id === id)
      if (index !== -1) {
        bookings.value[index] = cancelledBooking
      }
      
      if (selectedBooking.value?.id === id) {
        selectedBooking.value = cancelledBooking
      }
      
      return cancelledBooking
    } catch (err: any) {
      error.value = err.message || 'Error cancelling booking'
      console.error('Error cancelling booking:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function calculatePrice(scheduled_start: string, scheduled_end: string) {
    try {
      const response = await apiClient.post('/reservations/calculate-price', {
        scheduled_start,
        scheduled_end
      })
      return response.data
    } catch (err: any) {
      console.error('Error calculating price:', err)
      throw err
    }
  }

  // Retorna les reserves actives/pending d'un vehicle concret
  async function fetchVehicleBookings(vehicleId: number): Promise<Booking[]> {
    try {
      const response = await apiClient.get('/reservations')
      const all: Booking[] = extractCollection(response.data) as Booking[]
      const now = Date.now()
      const twoHoursMs = 2 * 60 * 60 * 1000
      return all.filter(b => {
        if (b.vehicle_id !== vehicleId) return false
        if (b.status === 'active') return true
        if (['pending', 'confirmed'].includes(b.status)) {
          const startsIn = new Date(b.scheduled_start).getTime() - now
          return startsIn <= twoHoursMs
        }
        return false
      })
    } catch (err: any) {
      console.error('Error fetching vehicle bookings:', err)
      return []
    }
  }

  function confirmBooking(id: number) {
    return updateBooking(id, { status: 'confirmed' })
  }

  function selectBooking(booking: Booking | null) {
    selectedBooking.value = booking
  }

  function clearError() {
    error.value = null
  }

  function $reset() {
    bookings.value = []
    loading.value = false
    error.value = null
    selectedBooking.value = null
  }

  return {
    // State
    bookings,
    loading,
    error,
    selectedBooking,
    
    // Getters
    pendingBookings,
    activeBookings,
    completedBookings,
    cancelledBookings,
    
    // Actions
    fetchBookings,
    fetchBookingById,
    fetchVehicleBookings,
    createBooking,
    updateBooking,
    deleteBooking,
    cancelBooking,
    confirmBooking,
    calculatePrice,
    selectBooking,
    clearError,
    $reset,
  }
})
