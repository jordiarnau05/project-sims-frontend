<template>
  <div class="px-4 sm:px-6 lg:px-8">
    <!-- Header -->
    <PageHeading
      :title="m.adminUsersUi.title"
      :description="m.adminUsersUi.description"
    >
      <template #actions>
        <router-link
          to="/admin/users/create"
          class="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          {{ m.adminUsersUi.add }}
        </router-link>
      </template>
    </PageHeading>

    <!-- Filters -->
    <div class="mt-6">
      <input
        v-model="filters.search"
        @input="handleSearch"
        type="text"
        :placeholder="m.adminUsersUi.searchPlaceholder"
        class="block w-full max-w-md rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm dark:bg-gray-800 dark:text-white dark:ring-gray-700"
      />
    </div>

    <!-- Loading state -->
    <div v-if="loading" class="mt-8 text-center text-gray-500 dark:text-gray-400">
      {{ m.adminUsersUi.loading }}
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="mt-8 text-center text-red-500">
      {{ error }}
    </div>

    <!-- Table -->
    <AdminsTable
      v-else
      :columns="columns"
      :empty="!users"
    >
      <template #empty>
        {{ m.adminUsersUi.empty }}
      </template>

      <tr v-for="user in users" :key="user.id">
        <AdminTd first variant="muted">
          {{ user.id }}
        </AdminTd>
        <AdminTd variant="primary">
          {{ user.name }}
        </AdminTd>
        <AdminTd variant="muted">
          {{ user.username || '-' }}
        </AdminTd>
        <AdminTd variant="muted">
          {{ user.email }}
        </AdminTd>
        <AdminTd variant="muted">
          <span v-if="user.roles && user.roles.length > 0" class="inline-block">
            {{ user.roles[0]?.name }}
          </span>
          <span v-else class="text-gray-400">-</span>
        </AdminTd>
        <AdminTd variant="muted">
            <span
            :class="[
              'inline-flex rounded-full px-2 py-1 text-xs font-semibold',
              user.active 
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
            ]"
          >
            {{ user.active ? m.commonUi.active : m.commonUi.inactive }}
          </span>
        </AdminTd>
        <AdminTd variant="actions">
          <div class="flex gap-2">
            <button
              v-if="isCurrentUserAdmin"
              class="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors"
              @click="navigateToDetail(user)"
              :title="m.commonUi.view"
            >
              <span class="material-icons text-xl">visibility</span>
              <span class="sr-only">{{ m.commonUi.view }}, {{ user.name }}</span>
            </button>
            <button
              v-if="isCurrentUserAdmin"
              class="text-purple-600 hover:text-purple-900 dark:text-purple-400 dark:hover:text-purple-300 transition-colors"
              @click="navigateToEdit(user)"
              :title="m.commonUi.edit"
            >
              <span class="material-icons text-xl">edit</span>
              <span class="sr-only">{{ m.commonUi.edit }}, {{ user.name }}</span>
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

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUsers } from '../composables/useUsers'
import { useToast } from '@/modules/common/composables/useToast'
import { useI18n } from '@/i18n'
import type { User, UserFilters } from '../interfaces/user.interface'
import AdminsTable from '@/modules/admin/components/AdminsTable.vue'
import AdminTd from '@/modules/admin/components/AdminTd.vue'
import AdminPagination from '@/modules/admin/components/AdminPagination.vue'
import PageHeading from '@/modules/admin/components/PageHeading.vue'

const router = useRouter()
const { m } = useI18n()
const { users, loading, error, pagination, getUsers, isCurrentUserAdmin } = useUsers()
const toast = useToast()

const columns = [
  { key: 'id', label: m.value.adminUsersUi.id },
  { key: 'name', label: m.value.adminUsersUi.name },
  { key: 'username', label: m.value.adminUsersUi.username },
  { key: 'email', label: m.value.adminUsersUi.email },
  { key: 'roles', label: m.value.adminUsersUi.role },
  { key: 'active', label: m.value.commonUi.status },
  { key: 'actions', label: m.value.commonUi.actions, srOnly: true }
]

const filters = ref<UserFilters>({
  search: ''
})

let searchTimeout: ReturnType<typeof setTimeout> | null = null

onMounted(() => {
  loadUsers()
})

const loadUsers = () => {
  getUsers(pagination.value.current_page, filters.value)
}

const handleSearch = () => {
  if (searchTimeout) clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    pagination.value.current_page = 1
    loadUsers()
  }, 500)
}

const handlePageChange = (page: number) => {
  pagination.value.current_page = page
  loadUsers()
}

const navigateToDetail = (user: User) => {
  router.push(`/admin/users/${user.id}`)
}

const navigateToEdit = (user: User) => {
  router.push(`/admin/users/${user.id}/edit`)
}

</script>
