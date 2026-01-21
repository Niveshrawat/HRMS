import { create } from 'zustand'
import type { AuthUser, Role } from '../types'
import { seedUsers } from '../data/seed'

interface AuthState {
  user: AuthUser | null
  login: (email: string, password: string) => Promise<AuthUser>
  logout: () => void
  isAuthorized: (roles?: Role[]) => boolean
}

const TOKEN = 'hrms-demo-token'

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  async login(email, password) {
    const match = seedUsers.find((u) => u.email === email && u.password === password)
    if (!match) {
      return Promise.reject(new Error('Invalid credentials'))
    }
    const authUser: AuthUser = { ...match, token: TOKEN }
    set({ user: authUser })
    return authUser
  },
  logout() {
    set({ user: null })
  },
  isAuthorized(roles) {
    const current = get().user
    if (!roles || roles.length === 0) return !!current
    return !!current && roles.includes(current.role)
  },
}))
