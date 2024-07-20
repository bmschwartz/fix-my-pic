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
  Typography,
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
  const [originalPictureFile, setOriginalPictureFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  const [watermarkOption, setWatermarkOption] = useState<WatermarkOptions>(
    WatermarkOptions.AUTOMATIC
  )
  const [watermarkPictureFile, setWatermarkPictureFile] = useState<File | null>(null)
  const [watermarkPreview, setWatermarkPreview] = useState<string | null>(null)
  const [isFree, setIsFree] = useState<boolean>(false)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (
      !originalPictureFile ||
      !description ||
      (!isFree && !price) ||
      (watermarkOption === WatermarkOptions.UPLOAD && !watermarkPictureFile)
    ) {
      return
    }

    setLoading(true)

    const originalPictureId = await uploadImage({ file: originalPictureFile })

    let watermarkedPictureId = null
    if (!isFree) {
      if (watermarkOption === WatermarkOptions.UPLOAD && watermarkPictureFile) {
        watermarkedPictureId = await uploadImage({ file: watermarkPictureFile })
      } else if (watermarkOption === WatermarkOptions.AUTOMATIC) {
        watermarkedPictureId = await uploadImage({
          file: originalPictureFile,
          addWatermark: true,
        })
      }
    }

    try {
      await createSubmission({
        requestAddress,
        description,
        originalPictureId,
        watermarkedPictureId,
        price: isFree ? 0 : Number(price),
      })
    } catch (e) {
      setLoading(false)
      return
    }
    setLoading(false)

    setPrice('')
    setDescription('')
    setOriginalPictureFile(null)
    setPreview(null)
    setWatermarkOption(WatermarkOptions.AUTOMATIC)
    setWatermarkPictureFile(null)
    setWatermarkPreview(null)
    setIsFree(false)

    onCreated?.()
  }

  const onFileChange = (file: File | null, isWatermarked: boolean = false) => {
    if (isWatermarked) {
      setWatermarkPictureFile(file)
      setWatermarkPreview(file ? URL.createObjectURL(file) : null)
    } else {
      setOriginalPictureFile(file)
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
        label="This picture is free"
      />
      {!isFree && (
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
      )}
      <MuiFileInput
        value={originalPictureFile}
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
      {!isFree && (
        <FormControl component="fieldset" disabled={isFree}>
          <FormLabel component="legend">Watermark Options</FormLabel>
          <Typography variant="caption" color="textSecondary">
            Only the watermarked picture will be shown until the user pays to view the original
          </Typography>
          <RadioGroup
            aria-label="watermark"
            name="watermarkOptions"
            value={watermarkOption}
            onChange={(e) => setWatermarkOption(e.target.value as WatermarkOptions)}
          >
            <FormControlLabel
              value={WatermarkOptions.AUTOMATIC}
              control={<Radio />}
              label="Automatically Add Watermark"
            />
            <FormControlLabel
              value={WatermarkOptions.UPLOAD}
              control={<Radio />}
              label="Upload Watermarked Picture"
            />
          </RadioGroup>
        </FormControl>
      )}
      {watermarkOption === WatermarkOptions.UPLOAD && !isFree && (
        <>
          <MuiFileInput
            value={watermarkPictureFile}
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
          {watermarkPreview && (
            <Box mt={2} sx={{ textAlign: 'center' }}>
              <img
                src={watermarkPreview}
                alt="Watermarked Preview"
                style={{ maxWidth: '100%', maxHeight: '300px' }}
              />
            </Box>
          )}
        </>
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
