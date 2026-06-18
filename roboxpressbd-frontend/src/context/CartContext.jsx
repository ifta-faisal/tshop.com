import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { Cart as CartApi } from '../api/client'
import { useAuth } from './AuthContext'

const Ctx = createContext(null)

export function CartProvider({ children }) {
  const { isAuthed } = useAuth()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)

  const refresh = useCallback(async () => {
    if (!isAuthed) { setItems([]); return }
    setLoading(true)
    try { setItems(await CartApi.list()) } finally { setLoading(false) }
  }, [isAuthed])

  useEffect(() => { refresh() }, [refresh])

  const add = async (productId, qty = 1) => { setItems(await CartApi.add(productId, qty)) }
  const update = async (productId, qty) => { setItems(await CartApi.update(productId, qty)) }
  const remove = async (productId) => { setItems(await CartApi.remove(productId)) }
  const clear = async () => { await CartApi.clear(); setItems([]) }

  const count = items.reduce((s, i) => s + i.quantity, 0)
  const subtotal = items.reduce((s, i) => s + Number(i.lineTotal), 0)

  return (
    <Ctx.Provider value={{ items, count, subtotal, loading, refresh, add, update, remove, clear }}>
      {children}
    </Ctx.Provider>
  )
}

export const useCart = () => useContext(Ctx)
