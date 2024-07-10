'use client'

import React, { useState, ChangeEvent, FormEvent } from 'react'
import { TextField, Button, Box } from '@mui/material'
import { useBounty } from '@/hooks/useBounty'
import { useImageStore } from '@/hooks/useImageStore'

export const NewBountyForm: React.FC = () => {
  const { createBounty } = useBounty()
  const { uploadImage } = useImageStore()
  const [title, setTitle] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [reward, setReward] = useState<string>('')
  const [file, setFile] = useState<File | null>(null)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if ([file, title, description, reward].includes(null)) {
      return
    }

    const imageId = await uploadImage(file!)
    const newBounty = { title, description, reward: Number(reward), imageId }
    await createBounty(newBounty)

    setTitle('')
    setDescription('')
    setReward('')
    setFile(null)
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0])
    }
  }

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
    >
      <TextField
        label="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        variant="outlined"
        fullWidth
        required
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
      />
      <TextField
        label="Reward (USD)"
        value={reward}
        onChange={(e) => setReward(e.target.value)}
        variant="outlined"
        fullWidth
        required
        type="number"
        InputProps={{ inputProps: { min: 0, step: '0.01' } }}
      />
      <Button variant="contained" component="label">
        Upload Image
        <input type="file" hidden onChange={handleFileChange} />
      </Button>
      {file && <Box mt={2}>{file.name}</Box>}
      <Button type="submit" variant="contained" color="primary">
        Create Bounty
      </Button>
    </Box>
  )
}
