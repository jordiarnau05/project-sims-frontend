<template>
  <div class="px-4 sm:px-6 lg:px-8">
    <div class="mb-6">
      <router-link
        to="/admin/bookings"
        class="inline-flex items-center text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
      >
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        Back to bookings
      </router-link>
    </div>

    <div v-if="loading" class="flex justify-center items-center py-12">
      <div class="text-center text-gray-500 dark:text-gray-400">
        <svg class="animate-spin h-8 w-8 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        Loading...
      </div>
    </div>

    <div v-else class="bg-white dark:bg-gray-900 shadow rounded-lg">
      <div class="px-4 py-5 sm:px-6">
        <h3 class="text-lg font-medium leading-6 text-gray-900 dark:text-white">
          Edit booking
        </h3>
      </div>

      <form @submit.prevent="handleSubmit" class="px-4 py-5 sm:px-6 space-y-6 border-t border-gray-200 dark:border-gray-700">
        <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <FormField label="User ID (optional)">
            <FormInput
              v-model="form.user_id"
              type="number"
              min="1"
              placeholder="e.g. 1"
            />
          </FormField>

          <FormField label="Vehicle ID">
            <FormInput
              v-model="form.vehicle_id"
              type="number"
              min="1"
              required
            />
          </FormField>

          <FormField label="Start date and time (scheduled_start)">
            <input
              v-model="form.scheduled_start"
              type="datetime-local"
              required
              class="block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm dark:bg-gray-800 dark:text-white dark:ring-gray-700"
            />
          </FormField>
        </div>

        <div class="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <router-link
            to="/admin/bookings"
            class="flex-1 px-4 py-2 text-center text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
          >
            Cancel
          </router-link>
          <button
            type="submit"
            :disabled="saving"
            class="flex-1 inline-flex items-center justify-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg
              v-if="saving"
              class="animate-spin h-4 w-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            {{ saving ? 'Saving...' : 'Save changes' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import FormField from '@/modules/admin/components/FormField.vue'
import FormInput from '@/modules/admin/components/FormInput.vue'
import { useBookings } from '../composables/useBookings'
import type { BookingCreatePayload } from '../interfaces/booking.interface'
import { useToast } from '@/modules/common/composables/useToast'

const route = useRoute()
const router = useRouter()
const { getBooking, updateBooking, loading, error } = useBookings()
const { success: toastSuccess, error: toastError } = useToast()

const bookingId = computed(() => (route.params.id ? Number(route.params.id) : null))

const form = reactive<{
  user_id: string
  vehicle_id: string
  scheduled_start: string
}>(
  {
    user_id: '',
    vehicle_id: '',
    scheduled_start: '',
  }
)

const saving = ref(false)

onMounted(async () => {
  if (bookingId.value) {
    try {
      const booking = await getBooking(bookingId.value)
      if (booking.user_id) form.user_id = String(booking.user_id)
      if (booking.vehicle_id) form.vehicle_id = String(booking.vehicle_id)
      if (booking.scheduled_start) {
        const d = new Date(booking.scheduled_start)
        form.scheduled_start = d.toISOString().slice(0, 16)
      }
    } catch (e) {
      toastError(error.value || 'Error loading booking')
      router.push('/admin/bookings')
    }
  }
})

const handleSubmit = async () => {
  try {
    saving.value = true

    const payload: BookingCreatePayload = {
      vehicle_id: Number(form.vehicle_id),
      scheduled_start: form.scheduled_start,
    }

    if (form.user_id) {
      payload.user_id = Number(form.user_id)
    }

    if (!bookingId.value) {
      toastError('Missing booking id')
      return
    }

    await updateBooking(bookingId.value, payload)
    toastSuccess('Booking updated successfully')

    router.push('/admin/bookings')
  } catch (e: any) {
    toastError(e?.response?.data?.message || 'Error saving booking')
  } finally {
    saving.value = false
  }
}
</script>
