import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

import { FullScreenLoader } from '@/components';
import { useRequests } from '@/hooks/useRequests';
import { Request } from '@/types/request';
import RequestDetailView from '@/views/request/RequestDetailView';

const RequestDetailsPage: React.FC = () => {
  const router = useRouter();
  const { fetchRequest } = useRequests();

  const [request, setRequest] = useState<Request | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const requestId = router.query.id as string;

  useEffect(() => {
    if (requestId) {
      const loadRequest = async () => {
        setLoading(true); // Set loading to true when starting to load the request
        const fetchedRequest = await fetchRequest(requestId);
        if (fetchedRequest) {
          setRequest(fetchedRequest);
        }
        setLoading(false); // Set loading to false after fetching the request
      };

      loadRequest();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requestId]);

  if (loading) {
    return <FullScreenLoader />;
  }

  if (!request) {
    return <div>Request not found</div>;
  }

  return <RequestDetailView request={request} />;
};

export default RequestDetailsPage;
