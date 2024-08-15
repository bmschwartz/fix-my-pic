import { useRouter } from 'next/router';
import React from 'react';

import { FullScreenLoader } from '@/components';
import { RequestDetailProvider } from '@/contexts/RequestDetailContext';
import { useRequestDetail } from '@/hooks/useRequestDetail';
import RequestDetailView from '@/views/request/RequestDetailView';

const RequestDetailPageContainer: React.FC = () => {
  const { loading, request } = useRequestDetail();
  if (loading) {
    return <FullScreenLoader />;
  }

  if (!request) {
    return <div>Request not found</div>;
  }

  return <RequestDetailView request={request} />;
};

const RequestDetailPage: React.FC = () => {
  const router = useRouter();

  return (
    <RequestDetailProvider requestId={router.query.id as string}>
      <RequestDetailPageContainer />
    </RequestDetailProvider>
  );
};

export default RequestDetailPage;
