import { useBounty } from '@/hooks/useBounty'
import { useImageStore } from '@/hooks/useImageStore'
import { Box, Button, TextField } from '@mui/material'
import { ChangeEvent, FormEvent, useState } from 'react'

interface NewSubmissionFormProps {
  onCreated?: () => void
  bountyAddress: string
}

export default function NewSubmissionForm({ onCreated, bountyAddress }: NewSubmissionFormProps) {
  const { createSubmission } = useBounty()
  const { uploadImage } = useImageStore()
  const [description, setDescription] = useState<string>('')
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if ([file, description].includes(null)) {
      return
    }

    setLoading(true)

    const imageId = await uploadImage(file!)
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

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]
      setFile(file)
      setPreview(URL.createObjectURL(file))
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
      <Button variant="contained" component="label" disabled={loading}>
        Upload Image
        <input type="file" hidden onChange={handleFileChange} />
      </Button>
      {preview && (
        <Box mt={2} sx={{ textAlign: 'center' }}>
          <img src={preview} alt="Preview" style={{ maxWidth: '100%', maxHeight: '300px' }} />
        </Box>
      )}
      <Button type="submit" variant="contained" color="primary" disabled={loading}>
        Create Submission
      </Button>
    </Box>
  )
}
