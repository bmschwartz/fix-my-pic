'use client'

import React, { useState, FormEvent } from 'react'
import { TextField, Button, Box, Backdrop, CircularProgress } from '@mui/material'
import { useImageStore } from '@/hooks/useImageStore'
import { DropzoneArea } from 'mui-file-dropzone'
import { useImageRequest } from '@/hooks/useImageRequest'

interface NewRequestFormProps {
  onCreated?: () => void
}

export const NewRequestForm: React.FC<NewRequestFormProps> = ({
  onCreated,
}: NewRequestFormProps) => {
  const { createImageRequest } = useImageRequest()
  const { uploadImage } = useImageStore()
  const [title, setTitle] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [budget, setBudget] = useState<string>('')
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if ([file, title, description, budget].includes(null)) {
      return
    }

    setLoading(true)

    const imageId = await uploadImage(file!)
    const request = { title, description, budget: Number(budget), imageId }
    try {
      await createImageRequest(request)
    } catch (e) {
      console.error(e)
      return
    }
    setLoading(false)

    setTitle('')
    setDescription('')
    setBudget('')
    setFile(null)
    setPreview(null)

    onCreated?.()
  }

  const handleFileChange = (files: File[]) => {
    if (files && files.length > 0) {
      const file = files[0]
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
      sx={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 2 }}
    >
      <TextField
        label="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        variant="outlined"
        fullWidth
        required
        disabled={loading}
      />
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
        label="Budget (USD)"
        value={budget}
        onChange={(e) => setBudget(e.target.value)}
        variant="outlined"
        fullWidth
        required
        type="number"
        disabled={loading}
        InputProps={{ inputProps: { min: 0, step: '0.01' } }}
      />
      <DropzoneArea
        acceptedFiles={['image/*']}
        fileObjects={[]}
        dropzoneText={'Drag and drop an image here or click'}
        onChange={handleFileChange}
        showPreviewsInDropzone
      />
      {preview && (
        <Box mt={2} sx={{ textAlign: 'center' }}>
          <img src={preview} alt="Preview" style={{ maxWidth: '100%', maxHeight: '300px' }} />
        </Box>
      )}
      <Button type="submit" variant="contained" color="primary" disabled={loading}>
        Create Request
      </Button>
      <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </Box>
  )
}
