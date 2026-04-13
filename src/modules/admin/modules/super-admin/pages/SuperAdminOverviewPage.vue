<template>
  <div class="space-y-8 px-4 sm:px-6 lg:px-8">
    <PageHeading
      title="Super Admin Overview"
      description="Global visibility across all tenants"
    >
      <template #actions>
        <button
          class="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
          @click="refreshOverview"
          :disabled="loading"
        >
          {{ loading ? 'Refreshing...' : 'Refresh' }}
        </button>
      </template>
    </PageHeading>

    <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      <div class="rounded-xl border border-gray-200 bg-white p-4 dark:border-white/10 dark:bg-gray-900/60">
        <p class="text-sm text-gray-500 dark:text-gray-400">Tenants</p>
        <p class="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">{{ summary.tenants }}</p>
        <p class="text-xs text-gray-500 dark:text-gray-400">{{ summary.activeTenants }} active</p>
      </div>
      <div class="rounded-xl border border-gray-200 bg-white p-4 dark:border-white/10 dark:bg-gray-900/60">
        <p class="text-sm text-gray-500 dark:text-gray-400">Vehicles</p>
        <p class="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">{{ summary.totalVehicles }}</p>
        <p class="text-xs text-gray-500 dark:text-gray-400">{{ summary.activeVehicles }} active</p>
      </div>
      <div class="rounded-xl border border-gray-200 bg-white p-4 dark:border-white/10 dark:bg-gray-900/60">
        <p class="text-sm text-gray-500 dark:text-gray-400">Users</p>
        <p class="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">{{ summary.totalUsers }}</p>
        <p class="text-xs text-gray-500 dark:text-gray-400">{{ summary.activeUsers }} active</p>
      </div>
    </div>

    <div v-if="error" class="rounded-md bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-300">
      {{ error }}
    </div>

    <section class="space-y-3">
      <div class="flex items-center justify-between">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Vehicles by tenant</h2>
        <router-link to="/admin/tenant-workspace" class="text-sm font-medium text-indigo-600 hover:text-indigo-500">Manage by tenant</router-link>
      </div>

      <AdminsTable :columns="vehicleColumns" :empty="vehicles.length === 0">
        <template #empty>No vehicles found across tenants</template>

        <tr v-for="vehicle in vehicles" :key="`${vehicle.tenant_id}-${vehicle.id}`">
          <AdminTd first variant="muted">{{ vehicle.tenant_name }}</AdminTd>
          <AdminTd variant="primary">{{ vehicle.license_plate }}</AdminTd>
          <AdminTd variant="muted">{{ vehicle.brand || '-' }}</AdminTd>
          <AdminTd variant="muted">{{ vehicle.model || '-' }}</AdminTd>
          <AdminTd variant="muted">
            <StatusBadge :active="vehicle.active" active-text="Active" inactive-text="Inactive" />
          </AdminTd>
        </tr>
      </AdminsTable>
    </section>

    <section class="space-y-3">
      <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Users by tenant</h2>

      <AdminsTable :columns="userColumns" :empty="users.length === 0">
        <template #empty>No users found across tenants</template>

        <tr v-for="entry in users" :key="`${entry.tenant_id}-${entry.id}`">
          <AdminTd first variant="muted">{{ entry.tenant_name }}</AdminTd>
          <AdminTd variant="primary">{{ entry.name }}</AdminTd>
          <AdminTd variant="muted">{{ entry.username }}</AdminTd>
          <AdminTd variant="muted">{{ entry.email }}</AdminTd>
          <AdminTd variant="muted">{{ entry.role_name }}</AdminTd>
          <AdminTd variant="muted">
            <StatusBadge :active="entry.active" active-text="Active" inactive-text="Inactive" />
          </AdminTd>
        </tr>
      </AdminsTable>
    </section>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useSuperAdmin } from '../composables/useSuperAdmin'
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

const vehicleColumns = [
  { key: 'tenant', label: 'Tenant' },
  { key: 'license_plate', label: 'Plate' },
  { key: 'brand', label: 'Brand' },
  { key: 'model', label: 'Model' },
  { key: 'active', label: 'Status' },
]

const userColumns = [
  { key: 'tenant', label: 'Tenant' },
  { key: 'name', label: 'Name' },
  { key: 'username', label: 'Username' },
  { key: 'email', label: 'Email' },
  { key: 'role', label: 'Role' },
  { key: 'active', label: 'Status' },
]

onMounted(() => {
  refreshOverview()
})
</script>
