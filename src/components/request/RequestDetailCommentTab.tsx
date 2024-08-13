import { Box, TextField, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { useState } from 'react';

import { ConnectWalletDialog, FMPButton, LoadingOverlay } from '@/components';
import { useComments } from '@/hooks/useComments';
import { useWallet } from '@/hooks/useWallet';
import { RequestComment } from '@/types/comment';
import { getDateTimeFromUnixTimestamp } from '@/utils/datetime';

interface RequestDetailCommentTabProps {
  requestId: string;
  comments: RequestComment[];
}

const RequestDetailCommentTab: React.FC<RequestDetailCommentTabProps> = ({ requestId, comments }) => {
  const router = useRouter();
  const { selectedAccount: account, selectedWallet } = useWallet();
  const { createRequestComment } = useComments();
  const [commentText, setCommentText] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [loadingLabel, setLoadingLabel] = useState('');

  const handleCommentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCommentText(event.target.value);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const connectWallet = () => {
    setDialogOpen(true);
  };

  const submitComment = async () => {
    if (!account || !selectedWallet) {
      return;
    }

    if (!commentText.trim()) {
      return;
    }

    setSubmitting(true);
    try {
      await createRequestComment({
        account,
        text: commentText,
        requestId: requestId,
        wallet: selectedWallet,
        setStatus: setLoadingLabel,
      });
      setCommentText('');
      router.reload();
    } catch (error) {
      console.error('Failed to submit comment:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box sx={{ mt: 3 }}>
      {comments.map((comment) => (
        <Box key={comment.id} sx={{ mb: 2 }}>
          <Typography variant="body2" fontWeight="bold">
            {comment.commenter} - {getDateTimeFromUnixTimestamp(comment.createdAt)}
          </Typography>
          <Typography variant="body2">{comment.text}</Typography>
        </Box>
      ))}
      <TextField
        fullWidth
        multiline
        rows={4}
        variant="outlined"
        placeholder="Add a comment"
        sx={{ mb: 2 }}
        value={commentText}
        onChange={handleCommentChange}
      />
      <FMPButton variant="contained" color="primary" onClick={account ? submitComment : connectWallet}>
        {account ? 'Submit' : 'Connect Wallet'}
      </FMPButton>
      <ConnectWalletDialog open={dialogOpen} onClose={handleCloseDialog} />
      <LoadingOverlay loading={submitting} label={loadingLabel} />
    </Box>
  );
};

export default RequestDetailCommentTab;
