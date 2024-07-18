'use client'
import React, { useState, FormEvent } from 'react'

import { MuiFileInput } from 'mui-file-input'
import CloseIcon from '@mui/icons-material/Close'
import ImageIcon from '@mui/icons-material/Image'
import { TextField, Button, Box, Backdrop, CircularProgress } from '@mui/material'

import { useImageStore } from '@/hooks/useImageStore'
import { usePictureRequest } from '@/hooks/usePictureRequest'

interface NewRequestFormProps {
  onCreated?: () => void
}

export const NewRequestForm: React.FC<NewRequestFormProps> = ({
  onCreated,
}: NewRequestFormProps) => {
  const { createPictureRequest } = usePictureRequest()
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
      await createPictureRequest(request)
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
      <MuiFileInput
        value={file}
        placeholder="Click to upload an image"
        inputProps={{ accept: 'image/*' }}
        clearIconButtonProps={{
          title: 'Remove',
          children: <CloseIcon fontSize="small" />,
        }}
        InputProps={{
          inputProps: {
            accept: 'image/*',
          },
          startAdornment: <ImageIcon />,
        }}
        onChange={onFileChange}
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
