'use client'

import { FormEvent, useState } from 'react'
import { MuiFileInput } from 'mui-file-input'
import CloseIcon from '@mui/icons-material/Close'
import ImageIcon from '@mui/icons-material/Image'
import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  TextField,
  FormControlLabel,
  Radio,
  RadioGroup,
  FormControl,
  FormLabel,
  Checkbox,
} from '@mui/material'

import { useImageStore } from '@/hooks/useImageStore'
import { useRequestSubmissions } from '@/hooks/useRequestSubmissions'

enum WatermarkOptions {
  UPLOAD = 'upload',
  AUTOMATIC = 'automatic',
}

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
  const [watermarkOption, setWatermarkOption] = useState<WatermarkOptions>(
    WatermarkOptions.AUTOMATIC
  )
  const [watermarkedFile, setWatermarkedFile] = useState<File | null>(null)
  const [isFree, setIsFree] = useState<boolean>(false)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!file || !description || (!isFree && !price)) {
      return
    }

    setLoading(true)

    const originalImageId = await uploadImage(file)

    let watermarkedImageId = null
    if (watermarkOption === WatermarkOptions.UPLOAD && watermarkedFile) {
      watermarkedImageId = await uploadImage(watermarkedFile)
    } else if (watermarkOption === WatermarkOptions.AUTOMATIC) {
      // Handle automatic watermarking logic here
      // For example, you could call an API to add the watermark and get the new image ID
      watermarkedImageId = await addSystemWatermark(originalImageId)
    }

    try {
      await createSubmission({
        requestAddress,
        description,
        originalImageId,
        watermarkedImageId,
        price: isFree ? 0 : Number(price),
      })
    } catch (e) {
      setLoading(false)
      return
    }
    setLoading(false)

    setPrice('')
    setDescription('')
    setFile(null)
    setPreview(null)
    setWatermarkOption(WatermarkOptions.AUTOMATIC)
    setWatermarkedFile(null)
    setIsFree(false)

    onCreated?.()
  }

  const onFileChange = (file: File | null, isWatermarked: boolean = false) => {
    if (isWatermarked) {
      setWatermarkedFile(file)
    } else {
      setFile(file)
      setPreview(file ? URL.createObjectURL(file) : null)
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
      <FormControlLabel
        control={
          <Checkbox
            checked={isFree}
            onChange={(e) => setIsFree(e.target.checked)}
            disabled={loading}
          />
        }
        label="Make this image free"
      />
      <TextField
        label="Price (USD)"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        variant="outlined"
        fullWidth
        required
        type="number"
        disabled={loading || isFree}
        InputProps={{ inputProps: { min: 0, step: '0.01' } }}
      />
      <MuiFileInput
        value={file}
        label="Edited Picture"
        placeholder="Click to upload your edited picture"
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
        onChange={(file) => onFileChange(file)}
      />
      {preview && (
        <Box mt={2} sx={{ textAlign: 'center' }}>
          <img src={preview} alt="Preview" style={{ maxWidth: '100%', maxHeight: '300px' }} />
        </Box>
      )}
      <FormControl component="fieldset" disabled={isFree}>
        <FormLabel component="legend">Watermark Options</FormLabel>
        <RadioGroup
          aria-label="watermark"
          name="watermarkOptions"
          value={watermarkOption}
          onChange={(e) => setWatermarkOption(e.target.value as WatermarkOptions)}
        >
          <FormControlLabel
            value={WatermarkOptions.AUTOMATIC}
            control={<Radio />}
            label="FixMyPic Watermark"
          />
          <FormControlLabel
            value={WatermarkOptions.UPLOAD}
            control={<Radio />}
            label="Upload Watermarked Picture"
          />
        </RadioGroup>
      </FormControl>
      {watermarkOption === 'upload' && !isFree && (
        <MuiFileInput
          value={watermarkedFile}
          label="Watermarked Picture"
          placeholder="Click to upload your watermarked picture"
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
          onChange={(file) => onFileChange(file, true)}
        />
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

// Example function to handle system watermarking
async function addSystemWatermark(imageId: string): Promise<string> {
  // Implement your logic to add a watermark and return the new image ID
  return 'new_watermarked_image_id'
}
