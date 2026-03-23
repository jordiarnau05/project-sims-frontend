export interface Vehicle {
  id: number
  license_plate: string
  brand: string | null
  model: string | null
  latitude?: number | null
  longitude?: number | null
  active: boolean
  created_at: string
  updated_at: string
}

export interface VehicleForm {
  license_plate: string
  brand: string
  model: string
  latitude?: number | null
  longitude?: number | null
  active: boolean
}

export interface VehicleFilters {
  search?: string
  active?: boolean
}

export interface VehiclePagination {
  data: Vehicle[]
  current_page: number
  last_page: number
  per_page: number
  total: number
}
