import { Button, ButtonProps } from '@mui/material';
import React from 'react';

const FMPButton: React.FC<ButtonProps> = ({ children, sx, ...props }) => {
  return (
    <Button
      {...props}
      sx={{
        color: '#000000',
        backgroundColor: '#FFFFFF',
        border: '2px solid #000000',
        borderRadius: '8px',
        '&:hover': {
          backgroundColor: '#f0f0f0',
        },
        padding: '8px 16px',
        fontWeight: 600,
        ...sx,
      }}
    >
      {children}
    </Button>
  );
};

export default FMPButton;
