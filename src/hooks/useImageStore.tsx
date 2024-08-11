import axios from 'axios';

import { RequestSubmission } from '@/types/submission';
import { useWallet } from './useWallet';

const IMAGE_URL_ROOT = process.env.NEXT_PUBLIC_IPFS_ENDPOINT || '';
if (!IMAGE_URL_ROOT) {
  process.exit(1);
}

export const useImageStore = () => {
  const { selectedAccount: account } = useWallet();

  const createWatermarkedImage = async (file: File): Promise<File> => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/watermark`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        responseType: 'arraybuffer',
      });
      const blob = new Blob([response.data], { type: 'image/png' });
      return new File([blob], `${file.name.slice(0, 10)}-watermarked.png`, { type: 'image/png' });
    } catch (e) {
      console.error(e);
      throw new Error('Error creating a watermarked image!');
    }
  };

  const encryptPictureId = async (pictureId: string): Promise<string> => {
    if (!pictureId) {
      return '';
    }

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/encrypt`, {
        pictureId,
      });
      return response.data.encryptedPictureId;
    } catch (e) {
      throw new Error('Error encrypting picture id!');
    }
  };

  const getDecryptedImageUrl = async (submission: RequestSubmission): Promise<string> => {
    const { id: submissionAddress, encryptedPictureId } = submission;

    if (!account || !encryptedPictureId) {
      return '';
    }

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/decrypt`, {
        submissionAddress,
        encryptedPictureId,
        userAddress: account,
      });
      const { decryptedImageId } = response.data;
      return `${IMAGE_URL_ROOT}/${decryptedImageId}`;
    } catch (e) {
      throw new Error('Error decrypting picture id!');
    }
  };

  const getImageUrlToShow = (submission: RequestSubmission): Promise<string> => {
    const purchased = submission.purchases.some((purchase) => purchase.buyer === account);

    if (submission.price === 0 || !purchased) {
      const pictureId = submission.freePictureId || (submission.watermarkedPictureId as string);
      return Promise.resolve(`${IMAGE_URL_ROOT}/${pictureId}`);
    }

    return getDecryptedImageUrl(submission);
  };

  return { createWatermarkedImage, getImageUrlToShow, getDecryptedImageUrl, encryptPictureId };
};
