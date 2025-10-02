'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { CartItem, Service } from '@/lib/types/database'
import { createContext, useContext, ReactNode } from 'react'

interface CartStore {
  items: CartItem[]
  isOpen: boolean
  addItem: (service: Service, quantity?: number, customizations?: Record<string, any>) => void
  removeItem: (serviceId: string) => void
  updateQuantity: (serviceId: string, quantity: number) => void
  clearCart: () => void
  toggleCart: () => void
  getTotalItems: () => number
  getTotalPrice: () => number
}

const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      
      addItem: (service, quantity = 1, customizations = {}) => {
        const items = get().items
        const existingItemIndex = items.findIndex(item => item.service.id === service.id)
        
        if (existingItemIndex > -1) {
          const updatedItems = [...items]
          updatedItems[existingItemIndex].quantity += quantity
          set({ items: updatedItems })
        } else {
          set({ items: [...items, { service, quantity, customizations }] })
        }
      },
      
      removeItem: (serviceId) => {
        set({ items: get().items.filter(item => item.service.id !== serviceId) })
      },
      
      updateQuantity: (serviceId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(serviceId)
          return
        }
        
        const items = get().items
        const updatedItems = items.map(item =>
          item.service.id === serviceId ? { ...item, quantity } : item
        )
        set({ items: updatedItems })
      },
      
      clearCart: () => {
        set({ items: [] })
      },
      
      toggleCart: () => {
        set({ isOpen: !get().isOpen })
      },
      
      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0)
      },
      
      getTotalPrice: () => {
        return get().items.reduce((total, item) => total + (item.service.price * item.quantity), 0)
      },
    }),
    {
      name: 'cart-storage',
    }
  )
)

const CartContext = createContext<CartStore | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const store = useCartStore()
  
  return (
    <CartContext.Provider value={store}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
