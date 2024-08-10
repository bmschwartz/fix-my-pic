import { Box, SxProps } from '@mui/material';
import Link from 'next/link';
import React from 'react';

import { FMPButton } from '@/components';

interface LinkButtonProps {
  sx?: SxProps;
  href: string;
  text: string;
}

const LinkButton: React.FC<LinkButtonProps> = ({ sx, href, text }) => {
  return (
    <Box sx={sx}>
      <Link href={href} passHref>
        <FMPButton type="button" variant="contained" color="primary">
          {text}
        </FMPButton>
      </Link>
    </Box>
  );
};

export default LinkButton;
