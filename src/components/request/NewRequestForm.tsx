import { PhotoCamera } from '@mui/icons-material';
import { Box, Divider, InputAdornment, TextField } from '@mui/material';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { useState } from 'react';

import { FMPButton, FMPTypography, LoadingOverlay } from '@/components';
import { useRequests } from '@/hooks/useRequests';
import { useWallet } from '@/hooks/useWallet';

const NewRequestForm: React.FC = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [budget, setBudget] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingLabel, setLoadingLabel] = useState('');

  const router = useRouter();
  const { createPictureRequest } = useRequests();
  const { selectedAccount: account, selectedWallet: wallet } = useWallet();

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!account || !wallet || !title || !image || !description || Number.isNaN(budget)) {
      return;
    }
    setLoading(true);

    try {
      setLoadingLabel('Uploading image...');

      await createPictureRequest({
        image,
        title,
        wallet,
        account,
        description,
        setStatus: setLoadingLabel,
        budget: parseFloat(budget),
      });
      router.push('/');
      return;
    } catch (e) {
      console.error(e);
      return;
    } finally {
      setLoading(false);
      setTitle('');
      setDescription('');
      setBudget('');
      setImage(null);
      setPreview(null);
      setLoadingLabel('');
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
        New Request
      </FMPTypography>
      <Divider sx={{ my: 3 }} />
      <TextField
        fullWidth
        label="Title"
        value={title}
        disabled={loading}
        onChange={(e) => setTitle(e.target.value)}
        required
        inputProps={{ maxLength: 100 }}
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
      <TextField
        fullWidth
        label="Description"
        multiline
        rows={4}
        value={description}
        disabled={loading}
        onChange={(e) => setDescription(e.target.value)}
        required
        inputProps={{ maxLength: 350 }}
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
      <TextField
        fullWidth
        label="Budget"
        value={budget}
        disabled={loading}
        onChange={(e) => setBudget(e.target.value)}
        required
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
          Upload Image
          <input type="file" hidden accept="image/*" onChange={handleImageUpload} />
        </FMPButton>
      </Box>
      <Divider sx={{ my: 3 }} />
      <Box sx={{ textAlign: 'center' }}>
        <FMPButton type="submit" variant="contained" color="primary" disabled={loading}>
          Create Request
        </FMPButton>
      </Box>
      <LoadingOverlay loading={loading} label={loadingLabel} />
    </Box>
  );
};

export default NewRequestForm;
