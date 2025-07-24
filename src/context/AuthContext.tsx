import React, { createContext, useContext, useState, useEffect } from 'react'

type User = {
  id: string
  name: string
  email: string
  role: string
}

type AuthContextType = {
  user: User | null
  token: string | null
  setUser: (user: User | null) => void
  setToken: (token: string | null) => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    const storedToken = localStorage.getItem('token')

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser))
      setToken(storedToken)
    }
  }, [])

  const handleSetUser = (user: User | null) => {
    setUser(user)
    if (user) localStorage.setItem('user', JSON.stringify(user))
    else localStorage.removeItem('user')
  }

  const handleSetToken = (token: string | null) => {
    setToken(token)
    if (token) localStorage.setItem('token', token)
    else localStorage.removeItem('token')
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        setUser: handleSetUser,
        setToken: handleSetToken,
        isAuthenticated: !!user && !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
