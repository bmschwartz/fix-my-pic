import { Box, Divider } from '@mui/material';
import React, { useEffect, useState } from 'react';

import { FullScreenLoader, RequestDetailCommentTab, RequestDetailSubmissionTab, TabButton } from '@/components';
import { useComments } from '@/hooks/useComments';
import { useSubmissions } from '@/hooks/useSubmissions';
import { RequestComment } from '@/types/comment';
import { Request } from '@/types/request';
import { RequestSubmission } from '@/types/submission';

interface RequestDetailTabSectionProps {
  request: Request;
}

enum RequestDetailTab {
  Submissions = 'submissions',
  Comments = 'comments',
}

const RequestDetailTabSection: React.FC<RequestDetailTabSectionProps> = ({ request }) => {
  const { fetchComments } = useComments();
  const { fetchSubmissions } = useSubmissions();

  const [loading, setLoading] = useState<boolean>(true);
  const [comments, setComments] = useState<RequestComment[]>([]);
  const [submissions, setSubmissions] = useState<RequestSubmission[]>([]);
  const [selectedTab, setSelectedTab] = useState<RequestDetailTab>(RequestDetailTab.Submissions);

  useEffect(() => {
    const loadCommentsAndSubmissions = async () => {
      const comments = await fetchComments(request.id);
      const submissions = await fetchSubmissions(request.id);

      setComments(comments);
      setSubmissions(submissions);

      setLoading(false);
    };

    loadCommentsAndSubmissions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [request.id]);

  const handleTabChange = (tab: RequestDetailTab) => {
    setSelectedTab(tab);
  };

  if (loading) {
    return <FullScreenLoader />;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, mb: 3 }}>
        <TabButton
          text="Submissions"
          selected={selectedTab === RequestDetailTab.Submissions}
          onClick={() => handleTabChange(RequestDetailTab.Submissions)}
          badgeContent={String(submissions.length)}
        />
        <TabButton
          text="Comments"
          selected={selectedTab === RequestDetailTab.Comments}
          onClick={() => handleTabChange(RequestDetailTab.Comments)}
          badgeContent={String(comments.length)}
        />
      </Box>
      <Divider sx={{ my: 3 }} />
      {selectedTab === RequestDetailTab.Submissions && (
        <RequestDetailSubmissionTab submissions={submissions} requestId={request.id} />
      )}
      {selectedTab === RequestDetailTab.Comments && (
        <RequestDetailCommentTab requestId={request.id} comments={comments} />
      )}
    </Box>
  );
};

export default RequestDetailTabSection;
