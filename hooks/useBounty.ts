import { useContext } from 'react'
import { BountyContext, BountyContextType } from '@/contexts/BountyContext'

export const useBounty = (): BountyContextType => {
  const context = useContext(BountyContext)
  if (!context) {
    throw new Error('useBounty must be used within an BountyProvider')
  }
  return context
}
