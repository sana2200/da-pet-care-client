import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'

const CartContext = createContext(null)

const STORAGE_KEY = 'cart.v1'

export function CartProvider({ children }){
  const [items, setItems] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      return raw ? JSON.parse(raw) : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)) } catch {}
  }, [items])

  function addToCart(product, qty = 1){
    setItems(prev => {
      const idx = prev.findIndex(i => i.id === product.id)
      if(idx >= 0){
        const next = [...prev]
        next[idx] = { ...next[idx], quantity: Math.min((next[idx].quantity || 0) + qty, product.stock ?? 9999) }
        return next
      }
      return [...prev, {
        id: product.id,
        code: product.code,
        name: product.name,
        price: Number(product.price) || 0,
        stock: product.stock ?? 0,
        quantity: Math.min(qty, product.stock ?? qty)
      }]
    })
  }

  function removeFromCart(id){
    setItems(prev => prev.filter(i => i.id !== id))
  }

  function updateQty(id, qty){
    setItems(prev => prev.map(i => i.id === id ? { ...i, quantity: Math.max(1, Math.min(qty, i.stock ?? 9999)) } : i))
  }

  function clearCart(){ setItems([]) }

  const totals = useMemo(() => {
    const subtotal = items.reduce((sum, i) => sum + (i.price * i.quantity), 0)
    const shipping = items.length > 0 ? 0 : 0
    const total = subtotal + shipping
    return { subtotal, shipping, total }
  }, [items])

  const value = { items, addToCart, removeFromCart, updateQty, clearCart, totals }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart(){
  const ctx = useContext(CartContext)
  if(!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
