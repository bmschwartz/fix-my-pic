export const getImageUrl = (imageId: string) => {
  return `${process.env.NEXT_PUBLIC_IPFS_ENDPOINT}/${imageId}`;
};
