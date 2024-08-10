import { Backdrop, CircularProgress, Typography } from '@mui/material';

interface LoadingOverlayProps {
  loading: boolean;
  label?: string;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ loading, label }) => {
  return (
    <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loading}>
      <div style={{ textAlign: 'center' }}>
        <CircularProgress color="inherit" />
        {label && (
          <Typography variant="h6" sx={{ mt: 2 }}>
            {label}
          </Typography>
        )}
      </div>
    </Backdrop>
  );
};

export default LoadingOverlay;
