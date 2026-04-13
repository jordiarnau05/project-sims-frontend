export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  token: string
}

export interface RegisterRequest {
  name: string
  username: string
  email: string
  password: string
  role_id: number
}

export interface RegisterResponse extends User {}

export interface Permission {
  id: number
  name: string
}

export interface Role {
  id: number
  name: string
  permissions: Permission[]
}

export interface User {
  id: number
  name: string
  username: string
  email: string
  active: boolean
  tenant_id: string | null  // tenant slug (string primary key)
  roles: Role[]
}

export interface UserResponse {
  user: User
}
