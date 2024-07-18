import { useContext } from 'react'
import { PictureRequestContext, PictureRequestContextType } from '@/contexts/PictureRequestContext'

export const usePictureRequest = (): PictureRequestContextType => {
  const context = useContext(PictureRequestContext)
  if (!context) {
    throw new Error('usePictureRequest must be used within an BountyProvider')
  }
  return context
}
