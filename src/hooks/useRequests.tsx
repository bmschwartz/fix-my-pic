import { useEffect, useState } from 'react';

import { execute, GetPictureRequestsDocument } from '@/graphql/client';
import { Request } from '@/types/request';
import { mapPictureRequest } from '@/utils/mappers';
import { useIpfs } from './useIpfs';

export const useRequests = () => {
  const { fetchIPFSData } = useIpfs();
  const [requests, setRequests] = useState<Request[]>([]);

  useEffect(() => {
    const fetchAndTransformData = async () => {
      const result = await execute(GetPictureRequestsDocument, {});
      const pictureRequests = result?.data?.pictureRequests || [];

      const requestsWithIPFSData = await Promise.all(
        pictureRequests.map(async (request: any) => {
          const ipfsData = await fetchIPFSData(request.ipfsHash);
          const commentsWithIPFSData = await Promise.all(
            request.comments.map(async (comment: any) => {
              const commentIpfsData = await fetchIPFSData(comment.ipfsHash);
              return { ...comment, ...commentIpfsData };
            })
          );
          const submissionsWithIPFSData = await Promise.all(
            request.submissions.map(async (submission: any) => {
              const submissionIpfsData = await fetchIPFSData(submission.ipfsHash);
              return { ...submission, ...submissionIpfsData };
            })
          );

          return mapPictureRequest({
            ...request,
            ...ipfsData,
            comments: commentsWithIPFSData,
            submissions: submissionsWithIPFSData,
          });
        })
      );

      setRequests(requestsWithIPFSData);
    };

    fetchAndTransformData();
  }, []);

  function getRequest(id: string) {
    return requests.find((request) => request.id === id);
  }

  return { requests, getRequest };
};
