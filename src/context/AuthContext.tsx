import { createContext, useState, useContext, type ReactNode } from 'react'
import api from '../api/axios'
import type { LoginResponse, User } from '../types'

interface AuthContextType {
  user: { id: number; username: string; email: string } | null
  token: string | null
  login: (email: string, password: string) => Promise<void>
  register: (data: User) => Promise<void>
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType>(null!)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<{ id: number; username: string; email: string } | null>(null)
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'))

  const login = async (email: string, password: string) => {
    const { data } = await api.post<LoginResponse>('/auth/login', { email, password })
    localStorage.setItem('token', data.token)
    setToken(data.token)
    setUser(data.user)
  }

  const register = async (data: User) => {
    await api.post('/auth/register', data)
  }

  const logout = () => {
    localStorage.removeItem('token')
    setToken(null)
    setUser(null)
  }

  const isAuthenticated = !!token

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
