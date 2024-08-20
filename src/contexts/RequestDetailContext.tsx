import React, { createContext, ReactNode, useEffect, useState } from 'react';

import { execute, GetPictureRequestDocument } from '@/graphql/client';
import { CreateRequestCommentParams, useComments } from '@/hooks/useComments';
import { useIpfs } from '@/hooks/useIpfs';
import { CreateRequestSubmissionParams, useSubmissions } from '@/hooks/useSubmissions';
import { RequestComment } from '@/types/comment';
import { Request } from '@/types/request';
import { RequestSubmission } from '@/types/submission';
import { mapPictureRequest } from '@/utils/mappers';

export interface RequestDetailContextType {
  request: Request | null;
  comments: RequestComment[];
  submissions: RequestSubmission[];
  loading: boolean;
  isCreatingNewSubmission: boolean;
  fetchRequest: (id: string) => void;
  setIsCreatingNewSubmission: (isCreatingNewSubmission: boolean) => void;
  createComment: (params: CreateRequestCommentParams) => Promise<RequestComment>;
  createSubmission: (params: CreateRequestSubmissionParams) => Promise<RequestSubmission>;
}

interface RequestDetailProviderProps {
  children: ReactNode;
  requestId: string;
}

export const RequestDetailContext = createContext<RequestDetailContextType | undefined>(undefined);

export const RequestDetailProvider = ({ children, requestId }: RequestDetailProviderProps) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [request, setRequest] = useState<Request | null>(null);
  const [comments, setComments] = useState<RequestComment[]>([]);
  const [submissions, setSubmissions] = useState<RequestSubmission[]>([]);
  const [isCreatingNewSubmission, setIsCreatingNewSubmission] = useState<boolean>(false);

  const { fetchIPFSData } = useIpfs();
  const { createRequestComment, pollForNewComment, fetchComments } = useComments();
  const { createRequestSubmission, pollForNewSubmission, fetchSubmissions } = useSubmissions();

  const fetchRequest = async (id: string) => {
    try {
      const result = await execute(GetPictureRequestDocument, { id: id.toLowerCase() });
      const request = result?.data?.pictureRequest;
      if (request) {
        const ipfsData = await fetchIPFSData(request.ipfsHash);
        return mapPictureRequest({ ...request, ...ipfsData });
      }
    } catch (error) {
      console.error('Error fetching request:', error);
    }
  };

  useEffect(() => {
    const fetchAllRequestDetails = async () => {
      if (requestId) {
        setLoading(true);

        const [request, comments, submissions] = await Promise.all([
          fetchRequest(requestId),
          fetchComments(requestId),
          fetchSubmissions(requestId),
        ]);

        if (request) {
          setRequest(request);
        }
        setComments(comments);
        setSubmissions(submissions);
        setLoading(false);
      }
    };

    fetchAllRequestDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requestId]);

  const createSubmission = async (params: CreateRequestSubmissionParams): Promise<RequestSubmission> => {
    const optimisticSubmission = await createRequestSubmission(params);
    setSubmissions((prevSubmissions) => [...prevSubmissions, optimisticSubmission]);

    pollForNewSubmission(optimisticSubmission.id, (polledSubmission: RequestSubmission) => {
      setSubmissions((prevSubmissions) =>
        prevSubmissions.map((submission) => (submission.id === optimisticSubmission.id ? polledSubmission : submission))
      );
    });

    return optimisticSubmission;
  };

  const createComment = async (params: CreateRequestCommentParams): Promise<RequestComment> => {
    const optimisticComment = await createRequestComment(params);
    setComments((prevComments) => [...prevComments, optimisticComment]);

    pollForNewComment(optimisticComment.id, (polledComment: RequestComment) => {
      setComments((prevComments) =>
        prevComments.map((comment) => (comment.id === optimisticComment.id ? polledComment : comment))
      );
    });

    return optimisticComment;
  };

  return (
    <RequestDetailContext.Provider
      value={{
        request,
        loading,
        comments,
        submissions,
        isCreatingNewSubmission,
        fetchRequest,
        createComment,
        createSubmission,
        setIsCreatingNewSubmission,
      }}
    >
      {children}
    </RequestDetailContext.Provider>
  );
};
