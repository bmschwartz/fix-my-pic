import { Box, Divider, TextField, Typography } from '@mui/material';
import { useState } from 'react';

import { FMPButton, LoadingOverlay } from '@/components';
import { useRequestDetail } from '@/hooks/useRequestDetail';
import { useWallet } from '@/hooks/useWallet';
import { RequestComment } from '@/types/comment';
import { getTimeSince } from '@/utils/datetime';

interface RequestDetailCommentTabProps {
  requestId: string;
  comments: RequestComment[];
}

const RequestDetailCommentTab: React.FC<RequestDetailCommentTabProps> = ({ requestId }) => {
  const { selectedAccount: account, selectedWallet, connectWallet } = useWallet();
  const { createComment, comments } = useRequestDetail();
  const [commentText, setCommentText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [loadingLabel, setLoadingLabel] = useState('');

  const handleCommentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCommentText(event.target.value);
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
      await createComment({
        account,
        text: commentText,
        requestId: requestId,
        wallet: selectedWallet,
        setStatus: setLoadingLabel,
      });
      setCommentText('');
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
          <Typography variant="body2">
            {comment.commenter.slice(0, 8)}... - {getTimeSince(comment.createdAt)}
          </Typography>
          <Typography variant="body1">{comment.text}</Typography>
          <Divider sx={{ mt: 2 }} />
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
      <LoadingOverlay loading={submitting} label={loadingLabel} />
    </Box>
  );
};

export default RequestDetailCommentTab;
