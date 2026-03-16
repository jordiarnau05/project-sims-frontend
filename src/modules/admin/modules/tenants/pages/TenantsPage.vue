<template>
  <div class="px-4 sm:px-6 lg:px-8">
    <!-- Header -->
    <PageHeading
      :title="m.adminTenantsUi.title"
      :description="m.adminTenantsUi.description"
    >
      <template #actions>
        <router-link
          to="/admin/tenants/create"
          class="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          {{ m.adminTenantsUi.add }}
        </router-link>
      </template>
    </PageHeading>

    <!-- Filters -->
    <div class="mt-6">
      <input
        v-model="filters.search"
        @input="handleSearch"
        type="text"
        :placeholder="m.adminTenantsUi.searchPlaceholder"
        class="block w-full max-w-md rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm dark:bg-gray-800 dark:text-white dark:ring-gray-700"
      />
    </div>

    <!-- Loading state -->
    <div v-if="loading" class="mt-8 text-center text-gray-500 dark:text-gray-400">
      {{ m.adminTenantsUi.loading }}
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="mt-8 text-center text-red-500">
      {{ error }}
    </div>

    <!-- Table -->
    <AdminsTable
      v-else
      :columns="columns"
      :empty="tenants.length === 0"
    >
      <template #empty>
        {{ m.adminTenantsUi.empty }}
      </template>

      <tr v-for="tenant in tenants" :key="tenant.id">
        <AdminTd first variant="muted">
          {{ tenant.id }}
        </AdminTd>
        <AdminTd variant="primary">
          {{ tenant.name }}
        </AdminTd>
        <AdminTd variant="muted">
          {{ tenant.slug }}
        </AdminTd>
        <AdminTd variant="muted">
          {{ tenant.email || '-' }}
        </AdminTd>
        <AdminTd variant="muted">
          {{ tenant.tax_id || '-' }}
        </AdminTd>
        <AdminTd variant="muted">
          <button
            @click="handleToggleActive(tenant)"
            :title="tenant.active ? m.adminTenantsUi.deactivate : m.adminTenantsUi.activate"
            class="cursor-pointer"
          >
            <StatusBadge :active="tenant.active" :active-text="m.commonUi.active" :inactive-text="m.commonUi.inactive" />
          </button>
        </AdminTd>
        <AdminTd variant="muted">
          {{ tenant.users_count ?? '-' }}
        </AdminTd>
        <AdminTd variant="muted">
          {{ tenant.vehicles_count ?? '-' }}
        </AdminTd>
        <AdminTd variant="actions">
          <div class="flex gap-2">
            <router-link
              :to="`/admin/tenants/${tenant.id}`"
              class="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors"
              :title="m.commonUi.view"
            >
              <span class="material-icons text-xl">visibility</span>
              <span class="sr-only">{{ m.commonUi.view }}, {{ tenant.name }}</span>
            </router-link>
            <router-link
              :to="`/admin/tenants/${tenant.id}/edit`"
              class="text-purple-600 hover:text-purple-900 dark:text-purple-400 dark:hover:text-purple-300 transition-colors"
              :title="m.commonUi.edit"
            >
              <span class="material-icons text-xl">edit</span>
              <span class="sr-only">{{ m.commonUi.edit }}, {{ tenant.name }}</span>
            </router-link>
            <router-link
              :to="`/admin/tenant-workspace`"
              class="text-emerald-600 hover:text-emerald-900 dark:text-emerald-400 dark:hover:text-emerald-300 transition-colors"
              :title="m.adminTenantsUi.manageTenant"
              @click="activateTenantContext(tenant.slug)"
            >
              <span class="material-icons text-xl">hub</span>
              <span class="sr-only">{{ m.adminTenantsUi.manageTenant }}, {{ tenant.name }}</span>
            </router-link>
            <router-link
              :to="`/admin/tenant-workspace`"
              class="text-emerald-600 hover:text-emerald-900 dark:text-emerald-400 dark:hover:text-emerald-300 transition-colors"
              title="Gestionar tenant"
              @click="activateTenantContext(tenant.slug)"
            >
              <span class="material-icons text-xl">hub</span>
              <span class="sr-only">Gestionar tenant, {{ tenant.name }}</span>
            </router-link>
            <button
              @click="confirmDelete(tenant)"
              class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 transition-colors"
              :title="m.commonUi.delete"
            >
              <span class="material-icons text-xl">delete</span>
              <span class="sr-only">{{ m.commonUi.delete }}, {{ tenant.name }}</span>
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
      :title="m.adminTenantsUi.deleteTitle"
      :message="m.adminTenantsUi.deleteMsg.replace('{name}', tenantToDelete?.name || '-')"
      @confirm="handleDelete"
      @cancel="showDeleteDialog = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useTenants } from '../composables/useTenants'
import { useI18n } from '@/i18n'
import type { Tenant, TenantFilters } from '../interfaces/tenant.interface'
import AdminsTable from '@/modules/admin/components/AdminsTable.vue'
import AdminTd from '@/modules/admin/components/AdminTd.vue'
import AdminPagination from '@/modules/admin/components/AdminPagination.vue'
import PageHeading from '@/modules/admin/components/PageHeading.vue'
import StatusBadge from '@/modules/admin/components/StatusBadge.vue'
import ConfirmDialog from '@/modules/admin/components/ConfirmDialog.vue'

const { tenants, loading, error, pagination, getTenants, deleteTenant, toggleActive } = useTenants()
const { m } = useI18n()

// Delete state
const showDeleteDialog = ref(false)
const tenantToDelete = ref<Tenant | null>(null)

function confirmDelete(tenant: Tenant) {
  tenantToDelete.value = tenant
  showDeleteDialog.value = true
}

async function handleDelete() {
  if (!tenantToDelete.value) return
  try {
    await deleteTenant(tenantToDelete.value.id)
    showDeleteDialog.value = false
    tenantToDelete.value = null
    loadTenants()
  } catch {
    showDeleteDialog.value = false
  }
}

async function handleToggleActive(tenant: Tenant) {
  try {
    const updated = await toggleActive(tenant.id)
    // Update in-place
    const idx = tenants.value.findIndex(t => t.id === tenant.id)
    if (idx !== -1) tenants.value[idx] = updated
  } catch {
    // error is already set in composable
  }
}

const columns = [
  { key: 'id', label: m.value.commonUi.id },
  { key: 'name', label: m.value.adminTenantsUi.name },
  { key: 'slug', label: m.value.commonUi.slug },
  { key: 'email', label: m.value.commonUi.email },
  { key: 'tax_id', label: m.value.adminTenantsUi.taxId },
  { key: 'active', label: m.value.commonUi.status },
  { key: 'users_count', label: m.value.adminTenantsUi.users },
  { key: 'vehicles_count', label: m.value.adminTenantsUi.vehicles },
  { key: 'actions', label: m.value.commonUi.actions, srOnly: true }
]

const filters = ref<TenantFilters>({
  search: ''
})

let searchTimeout: ReturnType<typeof setTimeout> | null = null

onMounted(() => {
  loadTenants()
})

const loadTenants = () => {
  getTenants(pagination.value.current_page, filters.value)
}

const handleSearch = () => {
  if (searchTimeout) clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    pagination.value.current_page = 1
    loadTenants()
  }, 500)
}

const handlePageChange = (page: number) => {
  pagination.value.current_page = page
  loadTenants()
}

const activateTenantContext = (tenantSlug: string) => {
  document.cookie = `tenant=${tenantSlug};path=/`
  localStorage.setItem('active_admin_tenant', tenantSlug)
}
</script>
