export interface User {
  username: string
  fullName: string
  email: string
  password: string
}

export interface LoginResponse {
  token: string
  user: { id: number; username: string; email: string }
}

export type Estado = 'DISPONIBLE' | 'AGOTADO' | 'PRÓXIMAMENTE'

export interface Product {
  id: number
  nombre: string
  categoria: string
  precio: number
  stock: number
  estado: Estado
}

export interface ApiError {
  message: string
  status?: number
}
