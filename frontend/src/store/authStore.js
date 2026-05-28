import { create } from 'zustand'

export const useAuthStore = create((set) => ({
    token: localStorage.getItem('token') || null,
    user: JSON.parse(localStorage.getItem('user')) || null,
    rol: localStorage.getItem('rol') || null,
    isAuthenticated: !!localStorage.getItem('token'),

    setAuth: (token, user, rol) => {
        localStorage.setItem('token', token)
        localStorage.setItem('user', JSON.stringify(user))
        localStorage.setItem('rol', rol)
        set({ token, user, rol, isAuthenticated: true })
    },

    logout: () => {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        localStorage.removeItem('rol')
        set({ token: null, user: null, rol: null, isAuthenticated: false })
    }
}))