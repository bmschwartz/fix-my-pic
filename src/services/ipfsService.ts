type UploadImageProps = {
  file: File;
};

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

type UploadRequestCommentProps = {
  text: string;
};

export class IpfsService {
  private ipfsEndpoint = process.env.NEXT_PUBLIC_IPFS_ENDPOINT;

  private async getJWT(): Promise<string> {
    const jwtRes = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/pinata/jwt`, {
      method: 'POST',
    });
    const JWT = await jwtRes.text();
    return JWT;
  }

  private async uploadJsonData(data: object): Promise<string> {
    const JWT = await this.getJWT();

    const res = await fetch('https://api.pinata.cloud/pinning/pinJSONToIPFS', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${JWT}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const json = await res.json();
    return json.IpfsHash;
  }

  private async uploadFile(file: File): Promise<string> {
    const JWT = await this.getJWT();

    const formData = new FormData();
    formData.append('file', file, file.name);

    const res = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${JWT}`,
      },
      body: formData,
    });

    const json = await res.json();
    return json.IpfsHash;
  }

  public async fetchIPFSData(ipfsHash: string): Promise<any> {
    const res = await fetch(`${this.ipfsEndpoint}/${ipfsHash}`);
    if (!res.ok) {
      throw new Error(`Failed to fetch IPFS data for hash: ${ipfsHash}`);
    }
    return res.json();
  }

  public async uploadRequestSubmission({
    description,
    freeImageId,
    encryptedImageId,
    watermarkedImageId,
  }: UploadRequestSubmissionProps): Promise<string> {
    const isFree = Boolean(freeImageId);

    if (isFree && (watermarkedImageId || encryptedImageId)) {
      throw new Error('Free submission should not have watermarked or encrypted image');
    }

    if (!isFree && (!watermarkedImageId || !encryptedImageId)) {
      throw new Error('Encrypted submission should have watermarked and encrypted image');
    }

    if (!description) {
      throw new Error('Missing a description');
    }

    const data = { description, freeImageId, encryptedImageId, watermarkedImageId };
    return this.uploadJsonData(data);
  }

  public async uploadPictureRequest({ title, description, imageId }: UploadPictureRequestProps): Promise<string> {
    if (!title || !description || !imageId) {
      throw new Error('Missing required fields');
    }

    const data = { title, description, imageId };
    return this.uploadJsonData(data);
  }

  public async uploadImage({ file }: UploadImageProps): Promise<string> {
    if (!file) {
      throw new Error('No file provided');
    }

    return this.uploadFile(file);
  }

  public async uploadRequestComment({ text }: UploadRequestCommentProps): Promise<string> {
    if (!text) {
      throw new Error('No text provided');
    }

    const data = { text };
    return this.uploadJsonData(data);
  }
}
