import { Badge, Box, ButtonProps } from '@mui/material';
import React from 'react';

import FMPButton from './FMPButton';

interface TabButtonProps extends ButtonProps {
  text: string;
  badgeContent?: string;
  selected: boolean;
}

const TabButton: React.FC<TabButtonProps> = ({ text, badgeContent, selected, sx, ...props }) => {
  return (
    <FMPButton
      {...props}
      sx={{
        backgroundColor: selected ? '#000000' : '#FFFFFF',
        color: selected ? '#FFFFFF' : '#000000',
        '&:hover': {
          backgroundColor: selected ? '#333333' : '#f0f0f0',
        },
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '8px 16px',
        ...sx,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
        {text}
        {badgeContent && (
          <Badge
            badgeContent={badgeContent}
            color="info"
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          />
        )}
      </Box>
    </FMPButton>
  );
};

export default TabButton;
