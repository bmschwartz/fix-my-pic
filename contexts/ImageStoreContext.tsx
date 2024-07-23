import { useWallet } from '@/hooks/useWallet'
import { PictureRequestSubmission } from '@/types/submission'
import axios from 'axios'
import React, { ReactNode, createContext } from 'react'

interface UploadImageProps {
  file: File
  addWatermark?: boolean
}

export interface ImageStoreContextType {
  uploadImage: (props: UploadImageProps) => Promise<string>
  getFreeImageUrl: (submission: PictureRequestSubmission) => string
  getDecryptedImageUrl: (submission: PictureRequestSubmission) => Promise<string>
}

interface ImageStoreProviderProps {
  children: ReactNode
}

const IMAGE_URL_ROOT = process.env.NEXT_PUBLIC_PINATA_GATEWAY || ''
if (!IMAGE_URL_ROOT) {
  process.exit('No image url root provided')
}

export const ImageStoreContext = createContext<ImageStoreContextType | undefined>(undefined)

export const ImageStoreProvider = ({ children }: ImageStoreProviderProps) => {
  const { selectedAccount: account } = useWallet()
  const uploadImage = async ({ file, addWatermark }: UploadImageProps): Promise<string> => {
    const fileToUpload: File = addWatermark ? await createWatermarkedImage(file) : file

    try {
      const jwtRes = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/pinata/jwt`, {
        method: 'POST',
      })
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
    try {
      const formData = new FormData()
      formData.append('file', file)
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/watermark`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          responseType: 'arraybuffer',
        }
      )
      const blob = new Blob([response.data], { type: 'image/png' })
      return new File([blob], `${file.name.slice(0, 10)}-watermarked.png`, { type: 'image/png' })
    } catch (e) {
      console.error(e)
      throw new Error('Error creating a watermarked image!')
    }
  }

  const getFreeImageUrl = (submission: PictureRequestSubmission): string => {
    const pictureId = submission.freePictureId || (submission.watermarkedPictureId as string)
    return `${IMAGE_URL_ROOT}/${pictureId}`
  }

  const getDecryptedImageUrl = async (submission: PictureRequestSubmission): Promise<string> => {
    const { address: submissionAddress, encryptedPictureId } = submission

    if (!account || !encryptedPictureId) {
      return ''
    }

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/pinata/decrypt`, {
        submissionAddress,
        encryptedPictureId,
        userAddress: account,
      })
      const { decryptedImageId } = response.data
      return `${IMAGE_URL_ROOT}/${decryptedImageId}`
    } catch (e) {
      throw new Error('Error decrypting picture id!')
    }
  }

  return (
    <ImageStoreContext.Provider value={{ uploadImage, getFreeImageUrl, getDecryptedImageUrl }}>
      {children}
    </ImageStoreContext.Provider>
  )
}
