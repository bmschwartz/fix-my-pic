import { useState } from 'react';

import { IpfsService } from '@/services/ipfsService';

interface UploadPictureRequestProps {
  title: string;
  description: string;
  imageId: string;
}

interface UploadRequestSubmissionProps {
  description: string;
  freeImageId?: string;
  encryptedImageId?: string;
  watermarkedImageId?: string;
}

interface UploadImageProps {
  file: File;
}

interface UploadRequestCommentProps {
  text: string;
}

export const useIpfs = () => {
  const ipfsService = new IpfsService();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchIPFSData = async (ipfsHash: string) => {
    setLoading(true);
    setError(null);
    try {
      const ipfsData = await ipfsService.fetchIPFSData(ipfsHash);
      return ipfsData;
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
      }
      throw e;
    } finally {
      setLoading(false);
    }
  };

  const uploadImage = async ({ file }: UploadImageProps) => {
    setLoading(true);
    setError(null);
    try {
      const ipfsHash = await ipfsService.uploadImage({ file });
      return ipfsHash;
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
      }
      throw e;
    } finally {
      setLoading(false);
    }
  };

  const uploadRequestComment = async ({ text }: UploadRequestCommentProps) => {
    setLoading(true);
    setError(null);
    try {
      const ipfsHash = await ipfsService.uploadRequestComment({ text });
      return ipfsHash;
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
      }
      throw e;
    } finally {
      setLoading(false);
    }
  };

  const uploadPictureRequest = async (data: UploadPictureRequestProps) => {
    setLoading(true);
    setError(null);
    try {
      const ipfsHash = await ipfsService.uploadPictureRequest(data);
      return ipfsHash;
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
      }
      throw e;
    } finally {
      setLoading(false);
    }
  };

  const uploadRequestSubmission = async (data: UploadRequestSubmissionProps) => {
    setLoading(true);
    setError(null);
    try {
      const ipfsHash = await ipfsService.uploadRequestSubmission(data);
      return ipfsHash;
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
      }
      throw e;
    } finally {
      setLoading(false);
    }
  };

  return {
    fetchIPFSData,
    uploadImage,
    uploadRequestComment,
    uploadPictureRequest,
    uploadRequestSubmission,
    loading,
    error,
  };
};
