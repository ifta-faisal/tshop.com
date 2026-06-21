import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { Cart as CartApi } from '../api/client'
import { useAuth } from './AuthContext'

const Ctx = createContext(null)

export function CartProvider({ children }) {
  const { isAuthed } = useAuth()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)

  const refresh = useCallback(async () => {
    if (!isAuthed) {
      const local = localStorage.getItem('rx_cart')
      setItems(local ? JSON.parse(local) : [])
      return
    }
    setLoading(true)
    try {
      let backendItems = await CartApi.list()
      const local = localStorage.getItem('rx_cart')
      if (local) {
        const localItems = JSON.parse(local)
        for (const item of localItems) {
           await CartApi.add(item.productId, item.quantity).catch(()=>{})
        }
        localStorage.removeItem('rx_cart')
        backendItems = await CartApi.list()
      }
      setItems(backendItems)
    } finally { setLoading(false) }
  }, [isAuthed])

  useEffect(() => { refresh() }, [refresh])

  const add = async (productId, qty = 1, product = null) => {
    if (isAuthed) {
      setItems(await CartApi.add(productId, qty))
    } else {
      const currentItems = [...items]
      const existing = currentItems.find(i => i.productId === productId)
      if (existing) {
        existing.quantity += qty
        existing.lineTotal = existing.quantity * existing.unitPrice
      } else if (product) {
        currentItems.push({
          id: 'local_' + Date.now(),
          productId: product.id,
          productName: product.name,
          productSlug: product.slug,
          productImage: product.images?.[0] || product.imageUrl || '',
          unitPrice: product.price,
          quantity: qty,
          lineTotal: product.price * qty
        })
      }
      setItems(currentItems)
      localStorage.setItem('rx_cart', JSON.stringify(currentItems))
    }
  }

  const update = async (productId, qty) => {
    if (isAuthed) {
      setItems(await CartApi.update(productId, qty))
    } else {
      const currentItems = [...items]
      const existing = currentItems.find(i => i.productId === productId)
      if (existing) {
        existing.quantity = qty
        existing.lineTotal = existing.quantity * existing.unitPrice
      }
      setItems(currentItems)
      localStorage.setItem('rx_cart', JSON.stringify(currentItems))
    }
  }

  const remove = async (productId) => {
    if (isAuthed) {
      setItems(await CartApi.remove(productId))
    } else {
      const currentItems = items.filter(i => i.productId !== productId)
      setItems(currentItems)
      localStorage.setItem('rx_cart', JSON.stringify(currentItems))
    }
  }

  const clear = async () => {
    if (isAuthed) await CartApi.clear()
    localStorage.removeItem('rx_cart')
    setItems([])
  }

  const count = items.reduce((s, i) => s + i.quantity, 0)
  const subtotal = items.reduce((s, i) => s + Number(i.lineTotal), 0)

  return (
    <Ctx.Provider value={{ items, count, subtotal, loading, refresh, add, update, remove, clear }}>
      {children}
    </Ctx.Provider>
  )
}

export const useCart = () => useContext(Ctx)
