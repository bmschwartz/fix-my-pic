'use client'

import { useImageStore } from '@/hooks/useImageStore'
import { useSubmissions } from '@/hooks/useSubmissions'
import { Backdrop, Box, Button, CircularProgress, TextField } from '@mui/material'
import { DropzoneArea } from 'mui-file-dropzone'
import { FormEvent, useState } from 'react'

interface NewSubmissionFormProps {
  onCreated?: () => void
  bountyAddress: string
}

export default function NewSubmissionForm({ onCreated, bountyAddress }: NewSubmissionFormProps) {
  const { createSubmission } = useSubmissions()
  const { uploadImage } = useImageStore()
  const [description, setDescription] = useState<string>('')
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!file || !description) {
      return
    }

    setLoading(true)

    const imageId = await uploadImage(file)
    try {
      await createSubmission({ bountyAddress, description, imageId })
    } catch (e) {
      console.error(e)
      return
    }
    setLoading(false)

    setDescription('')
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
        Create Submission
      </Button>
      <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </Box>
  )
}
