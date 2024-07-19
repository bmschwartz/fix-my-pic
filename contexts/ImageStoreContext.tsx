import axios from 'axios'
import React, { ReactNode, createContext } from 'react'

interface UploadImageProps {
  file: File
  addWatermark?: boolean
}

export interface ImageStoreContextType {
  uploadImage: (props: UploadImageProps) => Promise<string>
}

interface ImageStoreProviderProps {
  children: ReactNode
}

export const ImageStoreContext = createContext<ImageStoreContextType | undefined>(undefined)

export const ImageStoreProvider = ({ children }: ImageStoreProviderProps) => {
  const uploadImage = async ({ file, addWatermark }: UploadImageProps): Promise<string> => {
    console.log(addWatermark ? `Adding a watermark to ${file.name}` : 'Uploading file as is')
    const fileToUpload: File = addWatermark ? await createWatermarkedImage(file) : file

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

  const createWatermarkedImage = async (file: File): Promise<File> => {
    console.log('Creating watermarked image from ', file.name)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const response = await axios.post('/api/watermark', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        responseType: 'arraybuffer',
      })
      console.log('Received data from /api/watermark')
      const blob = new Blob([response.data], { type: 'image/png' })
      const fileName = 'watermark.png'
      return new File([blob], fileName, { type: 'image/png' })
    } catch (e) {
      console.error(e)
      throw new Error('Error creating a watermarked image!')
    }
  }

  return <ImageStoreContext.Provider value={{ uploadImage }}>{children}</ImageStoreContext.Provider>
}
