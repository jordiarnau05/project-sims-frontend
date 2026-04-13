export interface SuperAdminTenant {
  id: string
  name: string
  slug: string
  email: string | null
  active: boolean
}

export interface SuperAdminVehicle {
  id: number
  tenant_id: string | null
  tenant_name: string
  license_plate: string
  brand: string | null
  model: string | null
  active: boolean
}

export interface SuperAdminUser {
  id: number
  tenant_id: string | null
  tenant_name: string
  name: string
  username: string
  email: string
  active: boolean
  role_name: string
}

export interface SuperAdminSummary {
  tenants: number
  activeTenants: number
  totalVehicles: number
  activeVehicles: number
  totalUsers: number
  activeUsers: number
}
