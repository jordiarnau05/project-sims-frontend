<template>
  <div class="p-6">
    <PageHeading
      title="Empreses pendents"
      description="Revisa, aprova i consulta el subdomini que tindrà cada empresa"
    />

    <div v-if="loading" class="text-[var(--app-muted-text)]">Carregant...</div>
    <div v-if="error" class="text-red-600">{{ error }}</div>

    <div v-if="!loading && requests.length === 0" class="text-[var(--app-muted-text)]">No hi ha sol·licituds d'empreses.</div>

    <div v-for="r in requests" :key="r.id" class="mb-4 rounded-xl border border-[var(--app-border)] bg-[var(--app-surface)] p-5 shadow-sm">
      <div class="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div class="space-y-2">
          <div class="flex flex-wrap items-center gap-2">
            <h3 class="text-base font-semibold text-[var(--app-text)]">{{ r.name }}</h3>
            <span class="rounded-full px-2 py-0.5 text-xs font-semibold"
              :class="r.status === 'approved'
                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200'
                : 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-200'"
            >
              {{ r.status === 'approved' ? 'Aprovada' : 'Pendent' }}
            </span>
          </div>

          <div class="text-sm text-[var(--app-muted-text)]">Slug: <span class="font-mono text-[var(--app-text)]">{{ r.slug }}</span></div>
          <div class="text-sm text-[var(--app-muted-text)]">Email de contacte: <span class="text-[var(--app-text)]">{{ r.email }}</span></div>
          <div class="text-xs text-[var(--app-muted-text)]">
            Sol·licitada: {{ formatDate(r.requested_at) }}
          </div>

          <div class="rounded-lg border border-dashed border-[var(--app-border)] bg-[var(--app-bg)] p-3 text-sm">
            <div class="font-medium text-[var(--app-text)]">Link / subdomini previst</div>
            <a
              v-if="companyUrl(r)"
              :href="companyUrl(r)"
              target="_blank"
              rel="noreferrer"
              class="mt-1 block break-all font-mono text-[var(--fleetly-baltic-blue)] hover:underline"
            >
              {{ companyUrl(r) }}
            </a>
            <div v-else class="mt-1 text-[var(--app-muted-text)]">No s'ha pogut calcular el subdomini</div>
          </div>

          <div v-if="r.domain" class="text-xs text-[var(--app-muted-text)]">
            Dominio creat: <span class="font-mono text-[var(--app-text)]">{{ r.domain }}</span>
          </div>

          <div v-if="r.notes" class="text-sm text-[var(--app-text)]">
            <span class="font-medium">Notes:</span> {{ r.notes }}
          </div>
        </div>

        <div class="flex items-start gap-2">
          <button
            class="rounded-md border border-[var(--app-border)] bg-[var(--app-bg)] px-3 py-2 text-sm font-semibold text-[var(--app-text)] shadow-sm hover:bg-[var(--app-surface-alt)]"
            @click="copyCompanyUrl(r)"
          >
            Copiar link
          </button>
          <button
            v-if="r.status !== 'approved'"
            class="rounded-md bg-[var(--fleetly-baltic-blue)] px-3 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-90"
            @click="approveReq(r.id)"
          >
            Aprovar empresa
          </button>
          <button
            v-else
            class="rounded-md bg-emerald-600 px-3 py-2 text-sm font-semibold text-white shadow-sm cursor-default"
            disabled
          >
            Ja aprovada
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import PageHeading from '@/modules/admin/components/PageHeading.vue'
import { useTenantRequests } from '../composables/useTenantRequests'

const { loading, error, requests, load, approve } = useTenantRequests()

const approveReq = async (id: number) => {
  try {
    await approve(id)
    alert('Empresa aprovada')
  } catch (e: any) {
    alert(e?.response?.data?.message || 'No s\'ha pogut aprovar')
  }
}

const formatDate = (value: string | null | undefined): string => {
  if (!value) return '-'
  const date = new Date(value)
  return new Intl.DateTimeFormat('ca-ES', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}

const companyUrl = (request: { slug: string; domain?: string | null }): string => {
  const host = window.location.hostname
  const port = window.location.port ? `:${window.location.port}` : ''
  const domain = request.domain || `${request.slug}.${host}`
  return `${window.location.protocol}//${domain}${port}`
}

const copyCompanyUrl = async (request: { slug: string; domain?: string | null }) => {
  const url = companyUrl(request)

  try {
    await navigator.clipboard.writeText(url)
    alert('Link copiat al porta-retalls')
  } catch {
    alert(url)
  }
}

onMounted(async () => {
  await load()
})
</script>

<style scoped>
</style>
