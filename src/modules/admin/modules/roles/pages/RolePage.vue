<template>
  <div class="px-4 sm:px-6 lg:px-8">
    <!-- Header -->
    <PageHeading
      :title="m.adminRolesUi.title"
      :description="m.adminRolesUi.description"
    >
      <template #actions>
        <router-link
          to="/admin/roles/create"
          class="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          {{ m.adminRolesUi.add }}
        </router-link>
      </template>
    </PageHeading>

    <!-- Filters -->
    <div class="mt-6">
      <input
        v-model="filters.search"
        @input="handleSearch"
        type="text"
        :placeholder="m.adminRolesUi.searchPlaceholder"
        class="block w-full max-w-md rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm dark:bg-gray-800 dark:text-white dark:ring-gray-700"
      />
    </div>

    <!-- Loading state -->
    <div v-if="loading" class="mt-8 text-center text-gray-500 dark:text-gray-400">
      {{ m.adminRolesUi.loading }}
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="mt-8 text-center text-red-500">
      {{ error }}
    </div>

    <!-- Table -->
    <AdminsTable
      v-else
      :columns="columns"
      :empty="!roles"
    >
      <template #empty>
        {{ m.adminRolesUi.empty }}
      </template>

      <tr v-for="role in roles" :key="role.id">
        <AdminTd first variant="primary">
          {{ role.name }}
        </AdminTd>
        <AdminTd variant="muted">
          {{ role.permissions?.length || 0 }}
        </AdminTd>
        <AdminTd variant="muted">
          {{ formatDate(role.created_at) }}
        </AdminTd>
        <AdminTd variant="muted">
          {{ formatDate(role.updated_at) }}
        </AdminTd>
        <AdminTd variant="actions">
          <div class="flex gap-2">
            <button
              class="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors"
              @click="navigateToDetail(role)"
              :title="m.commonUi.view"
            >
              <span class="material-icons text-xl">visibility</span>
              <span class="sr-only">{{ m.commonUi.view }}, {{ role.name }}</span>
            </button>
            <button
              v-if="role.name.toLowerCase() !== 'admin'"
              class="text-purple-600 hover:text-purple-900 dark:text-purple-400 dark:hover:text-purple-300 transition-colors"
              @click="navigateToEdit(role)"
              :title="m.commonUi.edit"
            >
              <span class="material-icons text-xl">edit</span>
              <span class="sr-only">{{ m.commonUi.edit }}, {{ role.name }}</span>
            </button>
            <button
              v-if="role.name.toLowerCase() !== 'admin'"
              class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 transition-colors"
              @click="openDeleteModal(role)"
              :title="m.commonUi.delete"
            >
              <span class="material-icons text-xl">delete</span>
              <span class="sr-only">{{ m.commonUi.delete }}, {{ role.name }}</span>
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

    <!-- Delete Modal -->
    <RoleDeleteModal
      v-if="roleToDelete"
      :role="roleToDelete"
      @confirmed="handleDeleteConfirmed"
      @cancel="roleToDelete = null"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from '@/i18n'
import PageHeading from '@/modules/admin/components/PageHeading.vue'
import AdminsTable from '@/modules/admin/components/AdminsTable.vue'
import AdminTd from '@/modules/admin/components/AdminTd.vue'
import AdminPagination from '@/modules/admin/components/AdminPagination.vue'
import RoleDeleteModal from '../components/RoleDeleteModal.vue'
import { useRoles } from '../composables/useRoles'
import type { Role, RoleFilters } from '../interfaces/role.interface'

const router = useRouter()
const { m } = useI18n()
const { roles, loading, error, pagination, getRoles } = useRoles()
const roleToDelete = ref<Role | null>(null)

const columns = [
  { key: 'name', label: m.value.adminRolesUi.name },
  { key: 'permissions', label: m.value.adminRolesUi.permissions },
  { key: 'created_at', label: m.value.adminRolesUi.createdAt },
  { key: 'updated_at', label: m.value.adminRolesUi.updatedAt },
  { key: 'actions', label: m.value.commonUi.actions, srOnly: true },
]

const filters = ref<RoleFilters>({
  search: '',
})

let searchTimeout: ReturnType<typeof setTimeout> | null = null

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('es-ES')
}

const loadRoles = () => {
  getRoles(pagination.value.current_page, filters.value)
}

const handleSearch = () => {
  if (searchTimeout) clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    pagination.value.current_page = 1
    loadRoles()
  }, 500)
}

const handlePageChange = (page: number) => {
  pagination.value.current_page = page
  loadRoles()
}

const navigateToDetail = (role: Role) => {
  router.push(`/admin/roles/${role.id}`)
}

const navigateToEdit = (role: Role) => {
  router.push(`/admin/roles/${role.id}/edit`)
}

const openDeleteModal = (role: Role) => {
  roleToDelete.value = role
}

const handleDeleteConfirmed = () => {
  roleToDelete.value = null
  loadRoles()
}

onMounted(() => {
  loadRoles()
})
</script>
