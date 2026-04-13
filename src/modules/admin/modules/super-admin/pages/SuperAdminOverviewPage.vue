<template>
  <div class="space-y-8 px-4 sm:px-6 lg:px-8">
    <PageHeading
      :title="m.superAdminUi.title"
      :description="m.superAdminUi.description"
    >
      <template #actions>
        <button
          class="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
          @click="refreshOverview"
          :disabled="loading"
        >
          {{ loading ? m.superAdminUi.refreshing : m.superAdminUi.refresh }}
        </button>
      </template>
    </PageHeading>

    <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      <div class="rounded-xl border border-gray-200 bg-white p-4 dark:border-white/10 dark:bg-gray-900/60">
        <p class="text-sm text-gray-500 dark:text-gray-400">{{ m.superAdminUi.tenants }}</p>
        <p class="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">{{ summary.tenants }}</p>
        <p class="text-xs text-gray-500 dark:text-gray-400">{{ summary.activeTenants }} active</p>
      </div>
      <div class="rounded-xl border border-gray-200 bg-white p-4 dark:border-white/10 dark:bg-gray-900/60">
        <p class="text-sm text-gray-500 dark:text-gray-400">{{ m.adminVehiclesUi.title }}</p>
        <p class="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">{{ summary.totalVehicles }}</p>
        <p class="text-xs text-gray-500 dark:text-gray-400">{{ summary.activeVehicles }} active</p>
      </div>
      <div class="rounded-xl border border-gray-200 bg-white p-4 dark:border-white/10 dark:bg-gray-900/60">
        <p class="text-sm text-gray-500 dark:text-gray-400">{{ m.superAdminUi.users }}</p>
        <p class="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">{{ summary.totalUsers }}</p>
        <p class="text-xs text-gray-500 dark:text-gray-400">{{ summary.activeUsers }} active</p>
      </div>
    </div>

    <div v-if="error" class="rounded-md bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-300">
      {{ error }}
    </div>

    <section class="space-y-3">
      <div class="flex items-center justify-between">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white">{{ m.superAdminUi.vehiclesByTenant }}</h2>
        <router-link to="/admin/tenant-workspace" class="text-sm font-medium text-indigo-600 hover:text-indigo-500">{{ m.superAdminUi.manageByTenant }}</router-link>
      </div>

      <AdminsTable :columns="vehicleColumns" :empty="vehicles.length === 0">
        <template #empty>{{ m.superAdminUi.noVehicles }}</template>

        <tr v-for="vehicle in vehicles" :key="`${vehicle.tenant_id}-${vehicle.id}`">
          <AdminTd first variant="muted">{{ vehicle.tenant_name }}</AdminTd>
          <AdminTd variant="primary">{{ vehicle.license_plate }}</AdminTd>
          <AdminTd variant="muted">{{ vehicle.brand || '-' }}</AdminTd>
          <AdminTd variant="muted">{{ vehicle.model || '-' }}</AdminTd>
          <AdminTd variant="muted">
            <StatusBadge :active="vehicle.active" :active-text="m.commonUi.active" :inactive-text="m.commonUi.inactive" />
          </AdminTd>
        </tr>
      </AdminsTable>
    </section>

    <section class="space-y-3">
      <h2 class="text-lg font-semibold text-gray-900 dark:text-white">{{ m.superAdminUi.usersByTenant }}</h2>

      <AdminsTable :columns="userColumns" :empty="users.length === 0">
        <template #empty>{{ m.superAdminUi.noUsers }}</template>

        <tr v-for="entry in users" :key="`${entry.tenant_id}-${entry.id}`">
          <AdminTd first variant="muted">{{ entry.tenant_name }}</AdminTd>
          <AdminTd variant="primary">{{ entry.name }}</AdminTd>
          <AdminTd variant="muted">{{ entry.username }}</AdminTd>
          <AdminTd variant="muted">{{ entry.email }}</AdminTd>
          <AdminTd variant="muted">{{ entry.role_name }}</AdminTd>
          <AdminTd variant="muted">
            <StatusBadge :active="entry.active" :active-text="m.commonUi.active" :inactive-text="m.commonUi.inactive" />
          </AdminTd>
        </tr>
      </AdminsTable>
    </section>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useSuperAdmin } from '../composables/useSuperAdmin'
import { useI18n } from '@/i18n'
import PageHeading from '@/modules/admin/components/PageHeading.vue'
import AdminsTable from '@/modules/admin/components/AdminsTable.vue'
import AdminTd from '@/modules/admin/components/AdminTd.vue'
import StatusBadge from '@/modules/admin/components/StatusBadge.vue'

const {
  loading,
  error,
  users,
  vehicles,
  summary,
  refreshOverview,
} = useSuperAdmin()

const { m } = useI18n()

const vehicleColumns = computed(() => [
  { key: 'tenant', label: m.value.superAdminUi.tenant },
  { key: 'license_plate', label: m.value.superAdminUi.plate },
  { key: 'brand', label: m.value.adminVehiclesUi.brand },
  { key: 'model', label: m.value.adminVehiclesUi.model },
  { key: 'active', label: m.value.commonUi.status },
])

const userColumns = computed(() => [
  { key: 'tenant', label: m.value.superAdminUi.tenant },
  { key: 'name', label: m.value.adminUsersUi.name },
  { key: 'username', label: m.value.adminUsersUi.username },
  { key: 'email', label: m.value.adminUsersUi.email },
  { key: 'role', label: m.value.superAdminUi.role },
  { key: 'active', label: m.value.commonUi.status },
])

onMounted(() => {
  refreshOverview()
})
</script>
