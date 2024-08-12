export interface Request {
  id: string;
  title: string;
  budget: number;
  imageId: string;
  description: string;
}

export type PartialRequest = Partial<Request>;
