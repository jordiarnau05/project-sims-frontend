<template>
  <div class="px-4 sm:px-6 lg:px-8">
    <PageHeading
      title="Editar tenant"
      description="Modifica los datos de la organización"
    >
      <template #actions>
        <router-link
          to="/admin/tenants"
          class="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50
                 dark:bg-white/10 dark:text-white dark:ring-white/5 dark:hover:bg-white/20"
        >
          Volver
        </router-link>
      </template>
    </PageHeading>

    <div v-if="loadingTenant" class="mt-8 text-center text-gray-500 dark:text-gray-400">
      Cargando tenant...
    </div>

    <form v-else @submit.prevent="handleSubmit" class="mt-8 max-w-lg space-y-1">
      <FormInput
        v-model="form.name"
        label="Nombre"
        placeholder="Ej: Fleetly Corp"
        :error="errors.name"
      />

      <FormInput
        v-model="form.slug"
        label="Slug"
        placeholder="ej: fleetly-corp (solo letras, números y guiones)"
        :error="errors.slug"
      />

      <FormInput
        v-model="form.tax_id"
        label="CIF/NIF (opcional)"
        placeholder="Ej: B12345678"
        :error="errors.tax_id"
      />

      <FormInput
        v-model="form.email"
        label="Email de contacto (opcional)"
        placeholder="Ej: info@empresa.com"
        type="email"
        :error="errors.email"
      />

      <FormInput
        v-model="form.phone"
        label="Teléfono (opcional)"
        placeholder="Ej: +34 600 000 000"
        :error="errors.phone"
      />

      <FormInput
        v-model="form.address"
        label="Dirección (opcional)"
        placeholder="Ej: Calle Principal 1, Barcelona"
        :error="errors.address"
      />

      <FormCheckbox
        v-model="form.active"
        label="Activo"
      />

      <div class="flex gap-3 pt-4">
        <button
          type="submit"
          :disabled="loading"
          class="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500
                 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ loading ? 'Guardando...' : 'Guardar cambios' }}
        </button>
        <router-link
          to="/admin/tenants"
          class="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50
                 dark:bg-white/10 dark:text-white dark:ring-white/5 dark:hover:bg-white/20"
        >
          Cancelar
        </router-link>
      </div>

      <p v-if="error" class="mt-4 text-sm text-red-600">{{ error }}</p>
    </form>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTenants } from '../composables/useTenants'
import type { TenantForm } from '../interfaces/tenant.interface'
import PageHeading from '@/modules/admin/components/PageHeading.vue'
import FormInput from '@/modules/admin/components/FormInput.vue'
import FormCheckbox from '@/modules/admin/components/FormCheckbox.vue'

const route = useRoute()
const router = useRouter()
const { getTenant, updateTenant, loading, error } = useTenants()

const loadingTenant = ref(true)
const tenantId = String(route.params.id)

const form = reactive<TenantForm>({
  name: '',
  slug: '',
  tax_id: '',
  email: '',
  phone: '',
  address: '',
  active: true
})

const errors = reactive<Record<string, string | null>>({
  name: null,
  slug: null,
  tax_id: null,
  email: null,
  phone: null,
  address: null
})

onMounted(async () => {
  try {
    const tenant = await getTenant(tenantId)
    form.name = tenant.name
    form.slug = tenant.slug
    form.tax_id = tenant.tax_id || ''
    form.email = tenant.email || ''
    form.phone = tenant.phone || ''
    form.address = tenant.address || ''
    form.active = tenant.active
  } catch {
    router.push('/admin/tenants')
  } finally {
    loadingTenant.value = false
  }
})

function validate(): boolean {
  let valid = true
  Object.keys(errors).forEach(k => errors[k] = null)

  if (!form.name.trim()) {
    errors.name = 'El nombre es obligatorio'
    valid = false
  }

  if (!form.slug.trim()) {
    errors.slug = 'El slug es obligatorio'
    valid = false
  } else if (!/^[a-z0-9_-]+$/i.test(form.slug.trim())) {
    errors.slug = 'Solo letras, números, guiones y guiones bajos'
    valid = false
  }

  if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = 'Email no válido'
    valid = false
  }

  return valid
}

async function handleSubmit() {
  if (!validate()) return

  try {
    await updateTenant(tenantId, { ...form })
    router.push('/admin/tenants')
  } catch (err: any) {
    if (err.response?.status === 422) {
      const backendErrors = err.response.data.errors || {}
      for (const key of Object.keys(backendErrors)) {
        if (key in errors) {
          errors[key] = backendErrors[key][0]
        }
      }
    }
  }
}
</script>
