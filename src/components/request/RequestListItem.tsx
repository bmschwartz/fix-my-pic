import { Box, ImageListItem, Typography } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

import { Request } from '@/types/request';
import { getImageUrl } from '@/utils/getImage';

interface RequestListItemProps {
  pictureRequest: Request;
}

const RequestListItem: React.FC<RequestListItemProps> = ({ pictureRequest }) => {
  const imageUrl = getImageUrl(pictureRequest.imageId);

  return (
    <Link href={`/request/${pictureRequest.id}`} passHref prefetch={false}>
      <Box
        sx={{
          display: 'block',
          textDecoration: 'none',
          position: 'relative',
          '&:hover .overlay': {
            opacity: 1,
          },
          overflow: 'hidden',
        }}
      >
        <ImageListItem sx={{ width: '100%', height: 'auto' }}>
          <Box sx={{ position: 'relative', width: '100%', height: 'auto' }}>
            <Image
              src={imageUrl}
              alt={pictureRequest.title}
              layout="responsive"
              width={248}
              height={248}
              objectFit="contain"
              style={{ width: '100%', height: 'auto' }}
            />
          </Box>
          <Box
            className="overlay"
            sx={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.6)',
              color: 'white',
              opacity: 0,
              transition: 'opacity 0.3s ease',
              padding: '10px',
            }}
          >
            <Typography variant="h6">{pictureRequest.title}</Typography>
            <Typography variant="subtitle1">${pictureRequest.budget}</Typography>
          </Box>
        </ImageListItem>
      </Box>
    </Link>
  );
};

export default RequestListItem;
