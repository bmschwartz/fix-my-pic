import React, { ReactNode, createContext, useContext } from 'react'

export interface ImageStoreContextType {
  uploadImage: (fileToUpload: File) => Promise<string>
}

interface ImageStoreProviderProps {
  children: ReactNode
}

export const ImageStoreContext = createContext<ImageStoreContextType | undefined>(undefined)

export const ImageStoreProvider = ({ children }: ImageStoreProviderProps) => {
  const uploadImage = async (fileToUpload: File): Promise<string> => {
    try {
      const jwtRes = await fetch('/api/pinata/jwt', { method: 'POST' })
      const JWT = await jwtRes.text()

      const formData = new FormData()
      formData.append('file', fileToUpload, fileToUpload.name)

      const res = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${JWT}`,
        },
        body: formData,
      })

      const json = await res.json()
      return json.IpfsHash
    } catch (e) {
      throw new Error(`Could not upload image file ${e}`)
    }
  }

  return <ImageStoreContext.Provider value={{ uploadImage }}>{children}</ImageStoreContext.Provider>
}
