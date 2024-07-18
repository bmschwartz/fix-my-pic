'use client'

import { FormEvent, useState } from 'react'
import { MuiFileInput } from 'mui-file-input'
import CloseIcon from '@mui/icons-material/Close'
import ImageIcon from '@mui/icons-material/Image'
import { Backdrop, Box, Button, CircularProgress, TextField } from '@mui/material'

import { useImageStore } from '@/hooks/useImageStore'
import { useRequestSubmissions } from '@/hooks/useRequestSubmissions'

interface NewSubmissionFormProps {
  onCreated?: () => void
  requestAddress: string
}

export default function NewSubmissionForm({ onCreated, requestAddress }: NewSubmissionFormProps) {
  const { createSubmission } = useRequestSubmissions()
  const { uploadImage } = useImageStore()
  const [description, setDescription] = useState<string>('')
  const [price, setPrice] = useState<string>('')
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!file || !description || !price) {
      return
    }

    setLoading(true)

    const imageId = await uploadImage(file)
    try {
      await createSubmission({ requestAddress, description, imageId, price: Number(price) })
    } catch (e) {
      console.error(e)
      return
    }
    setLoading(false)

    setPrice('')
    setDescription('')
    setFile(null)
    setPreview(null)

    onCreated?.()
  }

  const onFileChange = (file: File | null) => {
    if (file) {
      setFile(file)
      setPreview(URL.createObjectURL(file))
    } else {
      setFile(null)
      setPreview(null)
    }
  }

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
    >
      <TextField
        label="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        variant="outlined"
        fullWidth
        multiline
        rows={4}
        required
        disabled={loading}
      />
      <TextField
        label="Price (USD)"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        variant="outlined"
        fullWidth
        required
        type="number"
        disabled={loading}
        InputProps={{ inputProps: { min: 0, step: '0.01' } }}
      />
      <MuiFileInput
        value={file}
        placeholder="Click to upload an image"
        InputProps={{
          inputProps: {
            accept: 'image/*',
          },
          startAdornment: <ImageIcon />,
        }}
        clearIconButtonProps={{
          title: 'Remove',
          children: <CloseIcon fontSize="small" />,
        }}
        onChange={onFileChange}
      />
      {preview && (
        <Box mt={2} sx={{ textAlign: 'center' }}>
          <img src={preview} alt="Preview" style={{ maxWidth: '100%', maxHeight: '300px' }} />
        </Box>
      )}
      <Button type="submit" variant="contained" color="primary" disabled={loading}>
        Create Submission
      </Button>
      <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </Box>
  )
}
