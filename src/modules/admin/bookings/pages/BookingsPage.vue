<template>
  <div class="px-4 sm:px-6 lg:px-8">
    <!-- Header -->
    <PageHeading
      :title="m.adminBookingsUi.title"
      :description="m.adminBookingsUi.description"
    >
      <template #actions>
        <button
          type="button"
          @click="openCreateModal"
          class="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          New booking
        </button>
      </template>
    </PageHeading>

    <!-- Filters -->
    <div class="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div class="flex gap-4 w-full sm:w-auto">
        <input
          v-model="filters.search"
          @input="handleSearch"
          type="text"
          placeholder="Search by guest, email or plate..."
          class="block w-full max-w-md rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm dark:bg-gray-800 dark:text-white dark:ring-gray-700"
        />

        <select
          v-model="filters.status"
          @change="handleStatusChange"
          class="block w-full sm:w-48 rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm dark:bg-gray-800 dark:text-white dark:ring-gray-700"
        >
          <option value="">All statuses</option>
          <option value="active">Active</option>
          <option value="pending">Pending</option>
          <option value="finished">Finished</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <p class="text-sm text-gray-500 dark:text-gray-400">
        {{ pagination.total }} {{ m.adminBookingsUi.title.toLowerCase() }}
      </p>
    </div>

    <!-- Creation form (modal) -->
    <Modal :show="showCreateModal" @close="closeCreateModal">
      <template #header>
        <h3 class="text-lg font-medium">Create booking</h3>
      </template>

      <div class="grid gap-4 sm:grid-cols-2">
        <FormInput
          v-model="createForm.user_id"
          label="User ID (optional)"
          placeholder="e.g. 1"
          type="number"
        />
        <FormInput
          v-model="createForm.vehicle_id"
          label="Vehicle ID"
          placeholder="e.g. 3"
          type="number"
        />
        <FormField label="Start date and time (scheduled_start)">
          <input
            v-model="createForm.scheduled_start"
            type="datetime-local"
            class="block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm dark:bg-gray-800 dark:text-white dark:ring-gray-700"
          />
        </FormField>
      </div>

      <template #footer>
        <button
          type="button"
          class="mr-2 rounded-md border border-gray-300 px-3 py-1.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
          @click="closeCreateModal"
        >
          Cancel
        </button>
        <button
          type="button"
          :disabled="creating"
          class="rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:opacity-50"
          @click="handleCreate"
        >
          {{ creating ? 'Creating...' : 'Create booking' }}
        </button>
      </template>
    </Modal>

    <!-- Loading state -->
    <div v-if="loading" class="mt-8 text-center text-gray-500 dark:text-gray-400">
      Loading bookings...
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="mt-8 text-center text-red-500">
      {{ error }}
    </div>

    <!-- Table -->
    <AdminsTable
      v-else
      :columns="columns"
      :empty="bookings.length === 0"
    >
      <template #empty>
        No bookings available
      </template>

      <tr v-for="booking in bookings" :key="booking.id">
        <AdminTd first variant="primary">
          <div class="flex items-center gap-3">
            <div class="h-8 w-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold">
              {{ getInitials(booking.user?.name || `U${booking.user_id ?? ''}`) }}
            </div>
            <div>
              <div class="text-sm font-medium text-gray-900 dark:text-white">
                <span v-if="booking.user">
                  {{ booking.user.name }}
                </span>
                <span v-else>
                  User #{{ booking.user_id ?? '-' }}
                </span>
              </div>
              <div class="text-xs text-gray-500 dark:text-gray-400">
                {{ booking.user?.email || '-' }}
              </div>
            </div>
          </div>
        </AdminTd>

        <AdminTd variant="muted">
          <div v-if="booking.vehicle">
            <div class="text-sm text-gray-900 dark:text-white">
              {{ booking.vehicle.brand }} {{ booking.vehicle.model }}
            </div>
            <div class="text-xs font-mono text-gray-500 dark:text-gray-400">
              {{ booking.vehicle.license_plate }}
            </div>
          </div>
          <div v-else>
            <div class="text-sm text-gray-900 dark:text-white">
              Vehicle #{{ booking.vehicle_id ?? '-' }}
            </div>
          </div>
        </AdminTd>

        <AdminTd variant="muted">
          <div class="text-xs text-gray-900 dark:text-white">
            <span class="font-semibold">{{ formatDateDay(getStartDate(booking)) }}</span>
            · {{ formatDateHour(getStartDate(booking)) }}
          </div>
          <div class="text-xs text-gray-500 dark:text-gray-400">
            → {{ formatDateDay(getEndDate(booking)) }} · {{ formatDateHour(getEndDate(booking)) }}
          </div>
        </AdminTd>

        <AdminTd variant="muted">
          {{ formatCurrency(getTotal(booking)) }}
        </AdminTd>

        <AdminTd variant="muted">
          <span
            :class="[
              'inline-flex rounded-full px-2 py-1 text-xs font-semibold',
              getStatusClasses(booking.status),
            ]"
          >
            {{ booking.status }}
          </span>
        </AdminTd>

        <AdminTd variant="actions">
          <div class="flex gap-2">
            <button
              class="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors"
              @click="navigateToDetail(booking.id)"
              title="View"
            >
              <span class="material-icons text-xl">visibility</span>
              <span class="sr-only">View, booking #{{ booking.id }}</span>
            </button>
            <button
              class="text-purple-600 hover:text-purple-900 dark:text-purple-400 dark:hover:text-purple-300 transition-colors"
              @click="navigateToEdit(booking.id)"
              title="Edit"
            >
              <span class="material-icons text-xl">edit</span>
              <span class="sr-only">Edit, booking #{{ booking.id }}</span>
            </button>
            <button
              @click="handleDelete(booking.id)"
              class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 transition-colors"
              title="Delete"
            >
              <span class="material-icons text-xl">delete</span>
              <span class="sr-only">Delete, booking #{{ booking.id }}</span>
            </button>
          </div>
        </AdminTd>
      </tr>
    </AdminsTable>

    <!-- Pagination -->
    <AdminPagination
      v-if="pagination.total > 0"
      :page="pagination.current_page"
      :per-page="pagination.per_page"
      :total="pagination.total"
      @update:page="handlePageChange"
    />

    <!-- Delete confirmation modal -->
    <Modal :show="showDeleteModal" @close="showDeleteModal = false">
      <template #header>
        <h3 class="text-lg font-medium text-gray-900 dark:text-white">Confirmar esborrat</h3>
      </template>

      <p class="text-sm text-gray-600 dark:text-gray-400">
        Estàs segur que vols esborrar aquesta reserva? Aquesta acció no es pot desfer.
      </p>

      <template #footer>
        <button
          type="button"
          class="mr-2 rounded-md border border-gray-300 px-3 py-1.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700"
          @click="showDeleteModal = false"
        >
          Cancel·lar
        </button>
        <button
          type="button"
          :disabled="deleting"
          class="rounded-md bg-red-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-red-500 disabled:opacity-50"
          @click="confirmDelete"
        >
          {{ deleting ? 'Esborrant...' : 'Esborrar' }}
        </button>
      </template>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useBookings } from '../composables/useBookings'
import type { Booking, BookingFilters, BookingCreatePayload } from '../interfaces/booking.interface'
import { useI18n } from '@/i18n'
import AdminsTable from '@/modules/admin/components/AdminsTable.vue'
import AdminTd from '@/modules/admin/components/AdminTd.vue'
import AdminPagination from '@/modules/admin/components/AdminPagination.vue'
import PageHeading from '@/modules/admin/components/PageHeading.vue'
import Modal from '@/modules/admin/components/Modal.vue'
import FormInput from '@/modules/admin/components/FormInput.vue'
import FormField from '@/modules/admin/components/FormField.vue'
import { useToast } from '@/modules/common/composables/useToast'

const router = useRouter()
const { m } = useI18n()
const { bookings, loading, error, pagination, getBookings, deleteBooking, createBooking } = useBookings()

const { success: toastSuccess, error: toastError } = useToast()

const columns = [
  { key: 'guest', label: m.value.adminBookingsUi.guest },
  { key: 'vehicle', label: m.value.adminBookingsUi.vehicle },
  { key: 'schedule', label: m.value.adminBookingsUi.schedule },
  { key: 'price', label: m.value.adminBookingsUi.price },
  { key: 'status', label: m.value.commonUi.status },
  { key: 'actions', label: m.value.commonUi.actions, srOnly: true },
]

const filters = ref<BookingFilters>({
  search: '',
  status: '',
})

const showCreateModal = ref(false)
const creating = ref(false)

const showDeleteModal = ref(false)
const deleting = ref(false)
const bookingToDelete = ref<number | null>(null)

const createForm = ref<{
  user_id: string
  vehicle_id: string
  scheduled_start: string
}>({
  user_id: '',
  vehicle_id: '',
  scheduled_start: '',
})

let searchTimeout: ReturnType<typeof setTimeout> | null = null

const loadBookings = (page = 1) => {
  getBookings(page, filters.value)
}

onMounted(() => {
  loadBookings()
})

const openCreateModal = () => {
  showCreateModal.value = true
}

const handleSearch = () => {
  if (searchTimeout) clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    pagination.value.current_page = 1
    loadBookings()
  }, 500)
}

const handleStatusChange = () => {
  pagination.value.current_page = 1
  loadBookings()
}

const handlePageChange = (page: number) => {
  pagination.value.current_page = page
  loadBookings(page)
}

const closeCreateModal = () => {
  showCreateModal.value = false
}

const handleCreate = async () => {
  if (!createForm.value.vehicle_id || !createForm.value.scheduled_start) {
    toastError('Fill vehicle and start date/time')
    return
  }

  const payload: BookingCreatePayload = {
    vehicle_id: Number(createForm.value.vehicle_id),
    scheduled_start: createForm.value.scheduled_start,
  }

  if (createForm.value.user_id) {
    payload.user_id = Number(createForm.value.user_id)
  }

  creating.value = true
  try {
    await createBooking(payload)
    toastSuccess('Booking created successfully')
    createForm.value = { user_id: '', vehicle_id: '', scheduled_start: '' }
    showCreateModal.value = false
    loadBookings(pagination.value.current_page)
  } catch (e: any) {
    toastError(e)
  } finally {
    creating.value = false
  }
}

const handleDelete = (id: number) => {
  bookingToDelete.value = id
  showDeleteModal.value = true
}

const confirmDelete = async () => {
  if (!bookingToDelete.value) return
  
  deleting.value = true
  try {
    await deleteBooking(bookingToDelete.value)
    toastSuccess('Reserva esborrada correctament')
    loadBookings(pagination.value.current_page)
    showDeleteModal.value = false
    bookingToDelete.value = null
  } catch (e: any) {
    toastError(e)
  } finally {
    deleting.value = false
  }
}

const getInitials = (name?: string) =>
  name
    ? name
        .split(' ')
        .map((x) => x[0])
        .join('')
        .substring(0, 2)
        .toUpperCase()
    : '??'

const formatDateDay = (d: string) =>
  d ? new Date(d).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : '-'

const formatDateHour = (d: string) =>
  d ? new Date(d).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' }) : '--:--'

const formatCurrency = (v: number) =>
  new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(v)

const getStatusClasses = (s: string) => {
  const map: Record<string, string> = {
    active: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    finished: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    completed: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  }
  return map[s] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
}

const getStartDate = (booking: Booking) =>
  booking.start_time || booking.scheduled_start || booking.trip?.engine_started_at || ''

const getEndDate = (booking: Booking) =>
  booking.end_time || booking.activation_deadline || booking.trip?.engine_started_at || ''
const getTotal = (booking: Booking) =>
  booking.total_price ?? booking.trip?.total_amount ?? 0

const navigateToDetail = (id: number) => {
  router.push(`/admin/bookings/${id}`)
}

const navigateToEdit = (id: number) => {
  router.push(`/admin/bookings/${id}/edit`)
}
</script>
