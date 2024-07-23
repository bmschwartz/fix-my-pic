import { useContext } from 'react'
import {
  PurchaseManagerContext,
  PurchaseManagerContextType,
} from '@/contexts/PurchaseManagerContext'

export const usePurchases = (): PurchaseManagerContextType => {
  const context = useContext(PurchaseManagerContext)
  if (!context) {
    throw new Error('usePurchases must be used within a PurchaseManagerProvider')
  }
  return context
}
