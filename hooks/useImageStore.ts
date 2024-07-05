import { useContext } from 'react'
import { ImageStoreContext, ImageStoreContextType } from '@/contexts/ImageStoreContext'

export const useImageStore = (): ImageStoreContextType => {
  const context = useContext(ImageStoreContext)
  if (!context) {
    throw new Error('useImageStore must be used within an ImageStoreProvider')
  }
  return context
}
