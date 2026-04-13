export interface Tenant {
  id: string
  name: string
  slug: string
  tax_id: string | null
  email: string | null
  phone: string | null
  address: string | null
  active: boolean
  users_count?: number
  vehicles_count?: number
  created_at: string
  updated_at: string
}

export interface TenantDomain {
  id: number
  domain: string
  tenant_id: string
  created_at: string
  updated_at: string
}

export interface TenantForm {
  name: string
  slug: string
  tax_id: string
  email: string
  phone: string
  address: string
  active: boolean
}

export interface TenantFilters {
  search?: string
  active?: boolean
}

export interface TenantPagination {
  data: Tenant[]
  current_page: number
  last_page: number
  per_page: number
  total: number
}
