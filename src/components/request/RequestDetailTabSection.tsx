import { Box, Divider } from '@mui/material';
import React, { useState } from 'react';

import { RequestDetailCommentTab, RequestDetailSubmissionTab, TabButton } from '@/components';
import { useRequestDetail } from '@/hooks/useRequestDetail';
import { Request } from '@/types/request';

interface RequestDetailTabSectionProps {
  request: Request;
}

enum RequestDetailTab {
  Submissions = 'submissions',
  Comments = 'comments',
}

const RequestDetailTabSection: React.FC<RequestDetailTabSectionProps> = ({ request }) => {
  const { comments, submissions } = useRequestDetail();

  const [selectedTab, setSelectedTab] = useState<RequestDetailTab>(RequestDetailTab.Submissions);

  const handleTabChange = (tab: RequestDetailTab) => {
    setSelectedTab(tab);
  };

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
      {selectedTab === RequestDetailTab.Submissions && <RequestDetailSubmissionTab submissions={submissions} />}
      {selectedTab === RequestDetailTab.Comments && (
        <RequestDetailCommentTab requestId={request.id} comments={comments} />
      )}
    </Box>
  );
};

export default RequestDetailTabSection;
