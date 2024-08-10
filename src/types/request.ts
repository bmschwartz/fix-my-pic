import { RequestComment } from './comment';
import { RequestSubmission } from './submission';

export interface Request {
  id: string;
  title: string;
  budget: number;
  imageId: string;
  description: string;
  comments: RequestComment[];
  submissions: RequestSubmission[];
}

export type PartialRequest = Partial<Request>;
