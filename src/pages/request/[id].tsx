import { useRouter } from 'next/router';
import React from 'react';

import { useRequests } from '@/hooks/useRequests';
import RequestDetailView from '@/views/request/RequestDetailView';

const RequestDetailsPage: React.FC = () => {
  const router = useRouter();
  const { getRequest } = useRequests();

  const requestId = router.query.id as string;
  const request = getRequest(requestId);

  if (!request) {
    return <div>Request not found</div>;
  }

  return <RequestDetailView request={request} />;
};

export default RequestDetailsPage;
