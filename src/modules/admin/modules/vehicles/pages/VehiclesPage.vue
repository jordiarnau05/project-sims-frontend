<template>
  <div class="px-4 sm:px-6 lg:px-8">
    <!-- Header -->
    <PageHeading
      :title="m.adminVehiclesUi.title"
      :description="m.adminVehiclesUi.description"
    >
      <template #actions>
        <router-link
          to="/admin/vehicles/create"
          class="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          {{ m.adminVehiclesUi.add }}
        </router-link>
      </template>
    </PageHeading>

    <!-- Filters -->
    <div class="mt-6">
      <input
        v-model="filters.search"
        @input="handleSearch"
        type="text"
        :placeholder="m.adminVehiclesUi.searchPlaceholder"
        class="block w-full max-w-md rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm dark:bg-gray-800 dark:text-white dark:ring-gray-700"
      />
    </div>

    <!-- Loading state -->
    <div v-if="loading" class="mt-8 text-center text-gray-500 dark:text-gray-400">
      {{ m.adminVehiclesUi.loading }}
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="mt-8 text-center text-red-500">
      {{ error }}
    </div>

    <!-- Table -->
    <AdminsTable
      v-else
      :columns="columns"
      :empty="vehicles.length === 0"
    >
      <template #empty>
        {{ m.adminVehiclesUi.empty }}
      </template>

      <tr v-for="vehicle in vehicles" :key="vehicle.id">
        <AdminTd first variant="muted">
          {{ vehicle.id }}
        </AdminTd>
        <AdminTd variant="primary">
          {{ vehicle.license_plate }}
        </AdminTd>
        <AdminTd variant="muted">
          {{ vehicle.brand || '-' }}
        </AdminTd>
        <AdminTd variant="muted">
          {{ vehicle.model || '-' }}
        </AdminTd>
        <AdminTd variant="muted">
          <StatusBadge :active="vehicle.active" :active-text="m.commonUi.active" :inactive-text="m.commonUi.inactive" />
        </AdminTd>
        <AdminTd variant="actions">
          <div class="flex gap-2">
            <router-link
              :to="`/admin/vehicles/${vehicle.id}`"
              class="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors"
              :title="m.commonUi.view"
            >
              <span class="material-icons text-xl">visibility</span>
              <span class="sr-only">{{ m.commonUi.view }}, {{ vehicle.license_plate }}</span>
            </router-link>
            <router-link
              :to="`/admin/vehicles/${vehicle.id}/edit`"
              class="text-purple-600 hover:text-purple-900 dark:text-purple-400 dark:hover:text-purple-300 transition-colors"
              :title="m.commonUi.edit"
            >
              <span class="material-icons text-xl">edit</span>
              <span class="sr-only">{{ m.commonUi.edit }}, {{ vehicle.license_plate }}</span>
            </router-link>
            <button
              @click="confirmDelete(vehicle)"
              class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 transition-colors"
              :title="m.commonUi.delete"
            >
              <span class="material-icons text-xl">delete</span>
              <span class="sr-only">{{ m.commonUi.delete }}, {{ vehicle.license_plate }}</span>
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

    <!-- Delete confirmation -->
    <ConfirmDialog
      :visible="showDeleteDialog"
      :title="m.adminVehiclesUi.deleteTitle"
      :message="m.adminVehiclesUi.deleteMsg.replace('{plate}', vehicleToDelete?.license_plate || '-')"
      @confirm="handleDelete"
      @cancel="showDeleteDialog = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useVehicles } from '../composables/useVehicles'
import { useI18n } from '@/i18n'
import type { Vehicle, VehicleFilters } from '../interfaces/vehicle.interface'
import AdminsTable from '@/modules/admin/components/AdminsTable.vue'
import AdminTd from '@/modules/admin/components/AdminTd.vue'
import AdminPagination from '@/modules/admin/components/AdminPagination.vue'
import PageHeading from '@/modules/admin/components/PageHeading.vue'
import StatusBadge from '@/modules/admin/components/StatusBadge.vue'
import ConfirmDialog from '@/modules/admin/components/ConfirmDialog.vue'

const { vehicles, loading, error, pagination, getVehicles, deleteVehicle } = useVehicles()
const { m } = useI18n()

// Delete state
const showDeleteDialog = ref(false)
const vehicleToDelete = ref<Vehicle | null>(null)

function confirmDelete(vehicle: Vehicle) {
  vehicleToDelete.value = vehicle
  showDeleteDialog.value = true
}

async function handleDelete() {
  if (!vehicleToDelete.value) return
  try {
    await deleteVehicle(vehicleToDelete.value.id)
    showDeleteDialog.value = false
    vehicleToDelete.value = null
    loadVehicles()
  } catch {
    showDeleteDialog.value = false
  }
}

const columns = [
  { key: 'id', label: m.value.commonUi.id },
  { key: 'license_plate', label: m.value.adminVehiclesUi.plate },
  { key: 'brand', label: m.value.adminVehiclesUi.brand },
  { key: 'model', label: m.value.adminVehiclesUi.model },
  { key: 'active', label: m.value.commonUi.status },
  { key: 'actions', label: m.value.commonUi.actions, srOnly: true }
]

const filters = ref<VehicleFilters>({
  search: ''
})

let searchTimeout: ReturnType<typeof setTimeout> | null = null

onMounted(() => {
  loadVehicles()
})

const loadVehicles = () => {
  getVehicles(pagination.value.current_page, filters.value)
}

const handleSearch = () => {
  if (searchTimeout) clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    pagination.value.current_page = 1
    loadVehicles()
  }, 500)
}

const handlePageChange = (page: number) => {
  pagination.value.current_page = page
  loadVehicles()
}
</script>
