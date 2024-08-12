import { PhotoCamera } from '@mui/icons-material';
import {
  Box,
  Checkbox,
  Divider,
  FormControl,
  FormControlLabel,
  FormLabel,
  InputAdornment,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from '@mui/material';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { useState } from 'react';

import { FMPButton, FMPTypography, LoadingOverlay } from '@/components';
import { useImageStore } from '@/hooks/useImageStore';
import { useIpfs } from '@/hooks/useIpfs';
import { useSubmissions } from '@/hooks/useSubmissions';
import { useWallet } from '@/hooks/useWallet';

enum WatermarkOptions {
  UPLOAD = 'upload',
  AUTOMATIC = 'automatic',
}

interface NewSubmissionFormProps {
  requestId: string;
}

const NewSubmissionForm: React.FC<NewSubmissionFormProps> = ({ requestId }) => {
  const router = useRouter();
  const [description, setDescription] = useState<string>('');
  const [price, setPrice] = useState<string>('');
  const [originalPictureFile, setOriginalPictureFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [watermarkOption, setWatermarkOption] = useState<WatermarkOptions>(WatermarkOptions.AUTOMATIC);
  const [watermarkPictureFile, setWatermarkPictureFile] = useState<File | null>(null);
  const [watermarkPreview, setWatermarkPreview] = useState<string | null>(null);
  const [isFree, setIsFree] = useState<boolean>(false);
  const [loadingLabel, setLoadingLabel] = useState('');

  const { uploadImage } = useIpfs();
  const { createRequestSubmission } = useSubmissions();
  const { createWatermarkedImage, encryptPictureId } = useImageStore();
  const { selectedAccount: account, selectedWallet: wallet } = useWallet();

  if (!account || !wallet) {
    return null;
  }

  const resetState = () => {
    setDescription('');
    setPrice('');
    setOriginalPictureFile(null);
    setPreview(null);
    setWatermarkOption(WatermarkOptions.AUTOMATIC);
    setWatermarkPictureFile(null);
    setWatermarkPreview(null);
    setIsFree(false);
    setLoading(false);
    setLoadingLabel('');
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>, isWatermarked: boolean = false) => {
    const file = event.target.files?.[0] || null;
    if (file) {
      if (isWatermarked) {
        setWatermarkPictureFile(file);
      } else {
        setOriginalPictureFile(file);
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        if (isWatermarked) {
          setWatermarkPreview(reader.result as string);
        } else {
          setPreview(reader.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (
      !originalPictureFile ||
      !description ||
      (!isFree && !price) ||
      (watermarkOption === WatermarkOptions.UPLOAD && !watermarkPictureFile)
    ) {
      return;
    }

    setLoading(true);

    try {
      setLoadingLabel(`Uploading image${!isFree ? 's' : ''}...`);
      const originalImageId = await uploadImage({ file: originalPictureFile });
      let watermarkedImageId: string | undefined;
      const freeImageId: string | undefined = isFree ? originalImageId : undefined;
      const encryptedImageId: string | undefined = !isFree ? await encryptPictureId(originalImageId) : undefined;

      if (!isFree) {
        if (watermarkOption === WatermarkOptions.UPLOAD && watermarkPictureFile) {
          watermarkedImageId = await uploadImage({ file: watermarkPictureFile });
        } else if (watermarkOption === WatermarkOptions.AUTOMATIC) {
          const watermarkedImage = await createWatermarkedImage(originalPictureFile);
          watermarkedImageId = await uploadImage({ file: watermarkedImage });
        }
      }

      setLoadingLabel('Creating smart contract...');

      await createRequestSubmission({
        description,
        wallet,
        account,
        requestId,
        freeImageId: freeImageId || '',
        encryptedImageId: encryptedImageId || '',
        watermarkedImageId: watermarkedImageId || '',
        price: isFree ? 0 : parseFloat(price || '0'),
      });

      router.push(`/request/${requestId}`);
      return;
    } catch (e) {
      console.error(e);
      return;
    } finally {
      resetState();
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: '800px', mx: 'auto', p: 3 }}>
      <FMPTypography
        variant="h6"
        gutterBottom
        sx={{
          textAlign: 'center',
          marginBottom: 3,
          position: 'relative',
          paddingBottom: 1,
          '&::after': {
            content: '""',
            position: 'absolute',
            left: '50%',
            bottom: 0,
            transform: 'translateX(-50%)',
            width: '50%',
            height: '2px',
            backgroundColor: '#000000',
            borderRadius: '2px',
          },
          fontWeight: 'bold',
          letterSpacing: '0.1em',
        }}
      >
        New Submission
      </FMPTypography>
      <Divider sx={{ my: 3 }} />
      <TextField
        fullWidth
        label="Description"
        multiline
        rows={4}
        value={description}
        disabled={loading}
        onChange={(e) => setDescription(e.target.value)}
        required
        sx={{
          backgroundColor: '#f9f9f9',
          borderRadius: 1,
          marginBottom: 3,
          '& .MuiOutlinedInput-root': {
            '&.Mui-focused fieldset': {
              borderColor: '#000000',
            },
          },
          '& .MuiInputLabel-root': {
            '&.Mui-focused': {
              color: '#000000',
            },
          },
        }}
      />
      <FormControlLabel
        control={
          <Checkbox
            checked={isFree}
            onChange={(e) => {
              setPrice('');
              setIsFree(e.target.checked);
            }}
            name="isFree"
            color="primary"
          />
        }
        label="This picture is free"
        sx={{ marginBottom: 3 }}
      />
      {!isFree && (
        <TextField
          fullWidth
          label="Price"
          value={price}
          disabled={loading || isFree}
          onChange={(e) => setPrice(e.target.value)}
          required={!isFree}
          InputProps={{
            startAdornment: <InputAdornment position="start">$</InputAdornment>,
            inputProps: { step: '0.01' },
            type: 'number',
          }}
          sx={{
            backgroundColor: '#f9f9f9',
            borderRadius: 1,
            marginBottom: 3,
            '& .MuiOutlinedInput-root': {
              '&.Mui-focused fieldset': {
                borderColor: '#000000',
              },
            },
            '& .MuiInputLabel-root': {
              '&.Mui-focused': {
                color: '#000000',
              },
            },
          }}
        />
      )}
      <Divider sx={{ my: 3 }} />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          border: '1px dashed #ccc',
          borderRadius: 2,
          padding: 2,
          bgcolor: 'background.paper',
          mb: 3,
        }}
      >
        {preview ? (
          <Box
            sx={{
              width: '100%',
              height: 0,
              paddingBottom: '56.25%', // 16:9 aspect ratio
              position: 'relative',
            }}
          >
            <Image src={preview} alt="Image preview" layout="fill" objectFit="contain" />
          </Box>
        ) : (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <PhotoCamera sx={{ fontSize: 40, mb: 1, color: '#ccc' }} />
            <FMPTypography variant="body2" color="textSecondary">
              No image selected
            </FMPTypography>
          </Box>
        )}
        <FMPButton variant="contained" component="label" sx={{ mt: 2 }} disabled={loading}>
          Upload Edited Image
          <input type="file" hidden accept="image/*" onChange={(event) => handleImageUpload(event)} />
        </FMPButton>
      </Box>
      {!isFree && (
        <FormControl component="fieldset" disabled={isFree} sx={{ mb: 3 }}>
          <FormLabel component="legend">Watermark Options</FormLabel>
          <Typography variant="caption" color="textSecondary" sx={{ mb: 1 }}>
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
            <FormControlLabel value={WatermarkOptions.UPLOAD} control={<Radio />} label="Upload Watermarked Picture" />
          </RadioGroup>
        </FormControl>
      )}
      {watermarkOption === WatermarkOptions.UPLOAD && !isFree && (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px dashed #ccc',
            borderRadius: 2,
            padding: 2,
            bgcolor: 'background.paper',
          }}
        >
          {watermarkPreview ? (
            <Box
              sx={{
                width: '100%',
                height: 0,
                paddingBottom: '56.25%', // 16:9 aspect ratio
                position: 'relative',
              }}
            >
              <Image src={watermarkPreview} alt="Watermarked image preview" layout="fill" objectFit="contain" />
            </Box>
          ) : (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <PhotoCamera sx={{ fontSize: 40, mb: 1, color: '#ccc' }} />
              <FMPTypography variant="body2" color="textSecondary">
                No watermarked image selected
              </FMPTypography>
            </Box>
          )}
          <FMPButton variant="contained" component="label" sx={{ mt: 2 }} disabled={loading}>
            Upload Watermarked Image
            <input type="file" hidden accept="image/*" onChange={(event) => handleImageUpload(event, true)} />
          </FMPButton>
        </Box>
      )}
      <Divider sx={{ my: 3 }} />
      <Box sx={{ textAlign: 'center' }}>
        <FMPButton type="submit" variant="contained" color="primary" disabled={loading}>
          Create Submission
        </FMPButton>
      </Box>
      <LoadingOverlay loading={loading} label={loadingLabel} />
    </Box>
  );
};

export default NewSubmissionForm;
