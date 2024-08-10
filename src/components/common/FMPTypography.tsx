import { Typography, TypographyProps } from '@mui/material';
import React from 'react';

const FMPTypography: React.FC<TypographyProps> = ({ children, sx, ...props }) => {
  return (
    <Typography
      {...props}
      sx={{
        color: '#000000',
        fontWeight: 500,
        ...sx,
      }}
    >
      {children}
    </Typography>
  );
};

export default FMPTypography;
