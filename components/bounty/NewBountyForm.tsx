'use client'

import React, { useState, FormEvent } from 'react'
import { TextField, Button, Box, Backdrop, CircularProgress } from '@mui/material'
import { useBounty } from '@/hooks/useBounty'
import { useImageStore } from '@/hooks/useImageStore'
import { DropzoneArea } from 'mui-file-dropzone'

interface NewBountyFormProps {
  onCreated?: () => void
}

export const NewBountyForm: React.FC<NewBountyFormProps> = ({ onCreated }: NewBountyFormProps) => {
  const { createBounty } = useBounty()
  const { uploadImage } = useImageStore()
  const [title, setTitle] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [reward, setReward] = useState<string>('')
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if ([file, title, description, reward].includes(null)) {
      return
    }

    setLoading(true)

    const imageId = await uploadImage(file!)
    const newBounty = { title, description, reward: Number(reward), imageId }
    try {
      await createBounty(newBounty)
    } catch (e) {
      console.error(e)
      return
    }
    setLoading(false)

    setTitle('')
    setDescription('')
    setReward('')
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
        label="Reward (USD)"
        value={reward}
        onChange={(e) => setReward(e.target.value)}
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
        Create Bounty
      </Button>
      <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </Box>
  )
}
