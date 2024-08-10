export interface RequestComment {
  id: string;
  text: string;
  commenter: string;
  createdAt: number;
}

export type PartialRequestComment = Partial<RequestComment>;
