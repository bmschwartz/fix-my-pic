import { useContext } from 'react'
import { ImageRequestContext, ImageRequestContextType } from '@/contexts/ImageRequestContext'

export const useImageRequest = (): ImageRequestContextType => {
  const context = useContext(ImageRequestContext)
  if (!context) {
    throw new Error('useImageRequest must be used within an BountyProvider')
  }
  return context
}
