import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Box, SxProps } from '@mui/material';
import Link from 'next/link';
import React from 'react';

import FMPTypography from './FMPTypography';

interface BackButtonProps {
  href: string;
  sx?: SxProps;
}

const BackButton: React.FC<BackButtonProps> = ({ href, sx }) => (
  <Link href={href} passHref>
    <Box
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        color: '#000',
        textDecoration: 'none',
        mb: 2,
        '&:hover .underline': { width: '100%' },
        ...sx,
      }}
    >
      <ArrowBackIcon sx={{ mr: 1 }} />
      <FMPTypography
        component="div"
        sx={{
          fontWeight: 'bold',
          fontSize: '1.1rem',
          position: 'relative',
          '& .underline': {
            content: '""',
            position: 'absolute',
            bottom: -2,
            left: 0,
            width: '0%',
            height: '2px',
            backgroundColor: '#000',
            transition: 'width 0.2s ease-in-out',
          },
        }}
      >
        Back
        <Box className="underline" sx={{ width: '0%' }} />
      </FMPTypography>
    </Box>
  </Link>
);

export default BackButton;
