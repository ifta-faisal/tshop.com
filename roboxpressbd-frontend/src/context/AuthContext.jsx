import { createContext, useContext, useEffect, useState } from 'react'
import { Auth } from '../api/client'

const Ctx = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('rx_user')) } catch { return null }
  })
  const [token, setToken] = useState(() => localStorage.getItem('rx_token'))

  useEffect(() => {
    if (token) localStorage.setItem('rx_token', token)
    else localStorage.removeItem('rx_token')
  }, [token])

  useEffect(() => {
    if (user) localStorage.setItem('rx_user', JSON.stringify(user))
    else localStorage.removeItem('rx_user')
  }, [user])

  const signup = async (data) => {
    const res = await Auth.signup(data)
    setToken(res.token); setUser(res); return res
  }
  const login = async (data) => {
    const res = await Auth.login(data)
    setToken(res.token); setUser(res); return res
  }
  const logout = () => { setToken(null); setUser(null) }

  return (
    <Ctx.Provider value={{ user, token, signup, login, logout, isAuthed: !!token }}>
      {children}
    </Ctx.Provider>
  )
}

export const useAuth = () => useContext(Ctx)
