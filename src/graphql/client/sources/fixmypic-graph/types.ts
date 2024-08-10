// @ts-nocheck

import { InContextSdkMethod } from '@graphql-mesh/types';
import { MeshContext } from '@graphql-mesh/runtime';

export namespace FixmypicGraphTypes {
  export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  BigDecimal: { input: any; output: any; }
  BigInt: { input: any; output: any; }
  Bytes: { input: any; output: any; }
  Int8: { input: any; output: any; }
  Timestamp: { input: any; output: any; }
};

export type Aggregation_interval =
  | 'hour'
  | 'day';

export type BlockChangedFilter = {
  number_gte: Scalars['Int']['input'];
};

export type Block_height = {
  hash?: InputMaybe<Scalars['Bytes']['input']>;
  number?: InputMaybe<Scalars['Int']['input']>;
  number_gte?: InputMaybe<Scalars['Int']['input']>;
};

/** Defines the order direction, either ascending or descending */
export type OrderDirection =
  | 'asc'
  | 'desc';

export type PictureRequest = {
  id: Scalars['ID']['output'];
  address: Scalars['Bytes']['output'];
  budget: Scalars['BigInt']['output'];
  creator: Scalars['Bytes']['output'];
  createdAt: Scalars['BigInt']['output'];
  expiresAt: Scalars['BigInt']['output'];
  ipfsHash: Scalars['String']['output'];
  comments: Array<RequestComment>;
  submissions: Array<RequestSubmission>;
  blockNumber: Scalars['BigInt']['output'];
  blockTimestamp: Scalars['BigInt']['output'];
  transactionHash: Scalars['Bytes']['output'];
};


export type PictureRequestcommentsArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<RequestComment_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<RequestComment_filter>;
};


export type PictureRequestsubmissionsArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<RequestSubmission_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<RequestSubmission_filter>;
};

export type PictureRequest_filter = {
  id?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  address?: InputMaybe<Scalars['Bytes']['input']>;
  address_not?: InputMaybe<Scalars['Bytes']['input']>;
  address_gt?: InputMaybe<Scalars['Bytes']['input']>;
  address_lt?: InputMaybe<Scalars['Bytes']['input']>;
  address_gte?: InputMaybe<Scalars['Bytes']['input']>;
  address_lte?: InputMaybe<Scalars['Bytes']['input']>;
  address_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  address_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  address_contains?: InputMaybe<Scalars['Bytes']['input']>;
  address_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  budget?: InputMaybe<Scalars['BigInt']['input']>;
  budget_not?: InputMaybe<Scalars['BigInt']['input']>;
  budget_gt?: InputMaybe<Scalars['BigInt']['input']>;
  budget_lt?: InputMaybe<Scalars['BigInt']['input']>;
  budget_gte?: InputMaybe<Scalars['BigInt']['input']>;
  budget_lte?: InputMaybe<Scalars['BigInt']['input']>;
  budget_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  budget_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  creator?: InputMaybe<Scalars['Bytes']['input']>;
  creator_not?: InputMaybe<Scalars['Bytes']['input']>;
  creator_gt?: InputMaybe<Scalars['Bytes']['input']>;
  creator_lt?: InputMaybe<Scalars['Bytes']['input']>;
  creator_gte?: InputMaybe<Scalars['Bytes']['input']>;
  creator_lte?: InputMaybe<Scalars['Bytes']['input']>;
  creator_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  creator_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  creator_contains?: InputMaybe<Scalars['Bytes']['input']>;
  creator_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  createdAt?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_not?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_gt?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_lt?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_gte?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_lte?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  createdAt_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  expiresAt?: InputMaybe<Scalars['BigInt']['input']>;
  expiresAt_not?: InputMaybe<Scalars['BigInt']['input']>;
  expiresAt_gt?: InputMaybe<Scalars['BigInt']['input']>;
  expiresAt_lt?: InputMaybe<Scalars['BigInt']['input']>;
  expiresAt_gte?: InputMaybe<Scalars['BigInt']['input']>;
  expiresAt_lte?: InputMaybe<Scalars['BigInt']['input']>;
  expiresAt_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  expiresAt_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  ipfsHash?: InputMaybe<Scalars['String']['input']>;
  ipfsHash_not?: InputMaybe<Scalars['String']['input']>;
  ipfsHash_gt?: InputMaybe<Scalars['String']['input']>;
  ipfsHash_lt?: InputMaybe<Scalars['String']['input']>;
  ipfsHash_gte?: InputMaybe<Scalars['String']['input']>;
  ipfsHash_lte?: InputMaybe<Scalars['String']['input']>;
  ipfsHash_in?: InputMaybe<Array<Scalars['String']['input']>>;
  ipfsHash_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  ipfsHash_contains?: InputMaybe<Scalars['String']['input']>;
  ipfsHash_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  ipfsHash_not_contains?: InputMaybe<Scalars['String']['input']>;
  ipfsHash_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  ipfsHash_starts_with?: InputMaybe<Scalars['String']['input']>;
  ipfsHash_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  ipfsHash_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  ipfsHash_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  ipfsHash_ends_with?: InputMaybe<Scalars['String']['input']>;
  ipfsHash_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  ipfsHash_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  ipfsHash_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  comments_?: InputMaybe<RequestComment_filter>;
  submissions_?: InputMaybe<RequestSubmission_filter>;
  blockNumber?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_lt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_lte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockTimestamp?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  transactionHash?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_not?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_gt?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_lt?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_gte?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_lte?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  transactionHash_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  transactionHash_contains?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<PictureRequest_filter>>>;
  or?: InputMaybe<Array<InputMaybe<PictureRequest_filter>>>;
};

export type PictureRequest_orderBy =
  | 'id'
  | 'address'
  | 'budget'
  | 'creator'
  | 'createdAt'
  | 'expiresAt'
  | 'ipfsHash'
  | 'comments'
  | 'submissions'
  | 'blockNumber'
  | 'blockTimestamp'
  | 'transactionHash';

export type Query = {
  pictureRequest?: Maybe<PictureRequest>;
  pictureRequests: Array<PictureRequest>;
  requestSubmission?: Maybe<RequestSubmission>;
  requestSubmissions: Array<RequestSubmission>;
  requestComment?: Maybe<RequestComment>;
  requestComments: Array<RequestComment>;
  submissionPurchase?: Maybe<SubmissionPurchase>;
  submissionPurchases: Array<SubmissionPurchase>;
  /** Access to subgraph metadata */
  _meta?: Maybe<_Meta_>;
};


export type QuerypictureRequestArgs = {
  id: Scalars['ID']['input'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QuerypictureRequestsArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<PictureRequest_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<PictureRequest_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryrequestSubmissionArgs = {
  id: Scalars['ID']['input'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryrequestSubmissionsArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<RequestSubmission_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<RequestSubmission_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryrequestCommentArgs = {
  id: Scalars['ID']['input'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryrequestCommentsArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<RequestComment_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<RequestComment_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QuerysubmissionPurchaseArgs = {
  id: Scalars['ID']['input'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QuerysubmissionPurchasesArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<SubmissionPurchase_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<SubmissionPurchase_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Query_metaArgs = {
  block?: InputMaybe<Block_height>;
};

export type RequestComment = {
  id: Scalars['ID']['output'];
  address: Scalars['Bytes']['output'];
  request: PictureRequest;
  commenter: Scalars['Bytes']['output'];
  createdAt: Scalars['BigInt']['output'];
  ipfsHash: Scalars['String']['output'];
  blockNumber: Scalars['BigInt']['output'];
  blockTimestamp: Scalars['BigInt']['output'];
  transactionHash: Scalars['Bytes']['output'];
};

export type RequestComment_filter = {
  id?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  address?: InputMaybe<Scalars['Bytes']['input']>;
  address_not?: InputMaybe<Scalars['Bytes']['input']>;
  address_gt?: InputMaybe<Scalars['Bytes']['input']>;
  address_lt?: InputMaybe<Scalars['Bytes']['input']>;
  address_gte?: InputMaybe<Scalars['Bytes']['input']>;
  address_lte?: InputMaybe<Scalars['Bytes']['input']>;
  address_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  address_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  address_contains?: InputMaybe<Scalars['Bytes']['input']>;
  address_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  request?: InputMaybe<Scalars['String']['input']>;
  request_not?: InputMaybe<Scalars['String']['input']>;
  request_gt?: InputMaybe<Scalars['String']['input']>;
  request_lt?: InputMaybe<Scalars['String']['input']>;
  request_gte?: InputMaybe<Scalars['String']['input']>;
  request_lte?: InputMaybe<Scalars['String']['input']>;
  request_in?: InputMaybe<Array<Scalars['String']['input']>>;
  request_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  request_contains?: InputMaybe<Scalars['String']['input']>;
  request_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  request_not_contains?: InputMaybe<Scalars['String']['input']>;
  request_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  request_starts_with?: InputMaybe<Scalars['String']['input']>;
  request_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  request_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  request_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  request_ends_with?: InputMaybe<Scalars['String']['input']>;
  request_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  request_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  request_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  request_?: InputMaybe<PictureRequest_filter>;
  commenter?: InputMaybe<Scalars['Bytes']['input']>;
  commenter_not?: InputMaybe<Scalars['Bytes']['input']>;
  commenter_gt?: InputMaybe<Scalars['Bytes']['input']>;
  commenter_lt?: InputMaybe<Scalars['Bytes']['input']>;
  commenter_gte?: InputMaybe<Scalars['Bytes']['input']>;
  commenter_lte?: InputMaybe<Scalars['Bytes']['input']>;
  commenter_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  commenter_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  commenter_contains?: InputMaybe<Scalars['Bytes']['input']>;
  commenter_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  createdAt?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_not?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_gt?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_lt?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_gte?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_lte?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  createdAt_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  ipfsHash?: InputMaybe<Scalars['String']['input']>;
  ipfsHash_not?: InputMaybe<Scalars['String']['input']>;
  ipfsHash_gt?: InputMaybe<Scalars['String']['input']>;
  ipfsHash_lt?: InputMaybe<Scalars['String']['input']>;
  ipfsHash_gte?: InputMaybe<Scalars['String']['input']>;
  ipfsHash_lte?: InputMaybe<Scalars['String']['input']>;
  ipfsHash_in?: InputMaybe<Array<Scalars['String']['input']>>;
  ipfsHash_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  ipfsHash_contains?: InputMaybe<Scalars['String']['input']>;
  ipfsHash_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  ipfsHash_not_contains?: InputMaybe<Scalars['String']['input']>;
  ipfsHash_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  ipfsHash_starts_with?: InputMaybe<Scalars['String']['input']>;
  ipfsHash_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  ipfsHash_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  ipfsHash_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  ipfsHash_ends_with?: InputMaybe<Scalars['String']['input']>;
  ipfsHash_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  ipfsHash_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  ipfsHash_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  blockNumber?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_lt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_lte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockTimestamp?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  transactionHash?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_not?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_gt?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_lt?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_gte?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_lte?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  transactionHash_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  transactionHash_contains?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<RequestComment_filter>>>;
  or?: InputMaybe<Array<InputMaybe<RequestComment_filter>>>;
};

export type RequestComment_orderBy =
  | 'id'
  | 'address'
  | 'request'
  | 'request__id'
  | 'request__address'
  | 'request__budget'
  | 'request__creator'
  | 'request__createdAt'
  | 'request__expiresAt'
  | 'request__ipfsHash'
  | 'request__blockNumber'
  | 'request__blockTimestamp'
  | 'request__transactionHash'
  | 'commenter'
  | 'createdAt'
  | 'ipfsHash'
  | 'blockNumber'
  | 'blockTimestamp'
  | 'transactionHash';

export type RequestSubmission = {
  id: Scalars['ID']['output'];
  address: Scalars['Bytes']['output'];
  request: PictureRequest;
  submitter: Scalars['Bytes']['output'];
  price: Scalars['BigInt']['output'];
  createdAt: Scalars['BigInt']['output'];
  ipfsHash: Scalars['String']['output'];
  purchases: Array<SubmissionPurchase>;
  blockNumber: Scalars['BigInt']['output'];
  blockTimestamp: Scalars['BigInt']['output'];
  transactionHash: Scalars['Bytes']['output'];
};


export type RequestSubmissionpurchasesArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<SubmissionPurchase_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<SubmissionPurchase_filter>;
};

export type RequestSubmission_filter = {
  id?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  address?: InputMaybe<Scalars['Bytes']['input']>;
  address_not?: InputMaybe<Scalars['Bytes']['input']>;
  address_gt?: InputMaybe<Scalars['Bytes']['input']>;
  address_lt?: InputMaybe<Scalars['Bytes']['input']>;
  address_gte?: InputMaybe<Scalars['Bytes']['input']>;
  address_lte?: InputMaybe<Scalars['Bytes']['input']>;
  address_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  address_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  address_contains?: InputMaybe<Scalars['Bytes']['input']>;
  address_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  request?: InputMaybe<Scalars['String']['input']>;
  request_not?: InputMaybe<Scalars['String']['input']>;
  request_gt?: InputMaybe<Scalars['String']['input']>;
  request_lt?: InputMaybe<Scalars['String']['input']>;
  request_gte?: InputMaybe<Scalars['String']['input']>;
  request_lte?: InputMaybe<Scalars['String']['input']>;
  request_in?: InputMaybe<Array<Scalars['String']['input']>>;
  request_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  request_contains?: InputMaybe<Scalars['String']['input']>;
  request_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  request_not_contains?: InputMaybe<Scalars['String']['input']>;
  request_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  request_starts_with?: InputMaybe<Scalars['String']['input']>;
  request_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  request_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  request_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  request_ends_with?: InputMaybe<Scalars['String']['input']>;
  request_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  request_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  request_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  request_?: InputMaybe<PictureRequest_filter>;
  submitter?: InputMaybe<Scalars['Bytes']['input']>;
  submitter_not?: InputMaybe<Scalars['Bytes']['input']>;
  submitter_gt?: InputMaybe<Scalars['Bytes']['input']>;
  submitter_lt?: InputMaybe<Scalars['Bytes']['input']>;
  submitter_gte?: InputMaybe<Scalars['Bytes']['input']>;
  submitter_lte?: InputMaybe<Scalars['Bytes']['input']>;
  submitter_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  submitter_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  submitter_contains?: InputMaybe<Scalars['Bytes']['input']>;
  submitter_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  price?: InputMaybe<Scalars['BigInt']['input']>;
  price_not?: InputMaybe<Scalars['BigInt']['input']>;
  price_gt?: InputMaybe<Scalars['BigInt']['input']>;
  price_lt?: InputMaybe<Scalars['BigInt']['input']>;
  price_gte?: InputMaybe<Scalars['BigInt']['input']>;
  price_lte?: InputMaybe<Scalars['BigInt']['input']>;
  price_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  price_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  createdAt?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_not?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_gt?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_lt?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_gte?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_lte?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  createdAt_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  ipfsHash?: InputMaybe<Scalars['String']['input']>;
  ipfsHash_not?: InputMaybe<Scalars['String']['input']>;
  ipfsHash_gt?: InputMaybe<Scalars['String']['input']>;
  ipfsHash_lt?: InputMaybe<Scalars['String']['input']>;
  ipfsHash_gte?: InputMaybe<Scalars['String']['input']>;
  ipfsHash_lte?: InputMaybe<Scalars['String']['input']>;
  ipfsHash_in?: InputMaybe<Array<Scalars['String']['input']>>;
  ipfsHash_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  ipfsHash_contains?: InputMaybe<Scalars['String']['input']>;
  ipfsHash_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  ipfsHash_not_contains?: InputMaybe<Scalars['String']['input']>;
  ipfsHash_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  ipfsHash_starts_with?: InputMaybe<Scalars['String']['input']>;
  ipfsHash_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  ipfsHash_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  ipfsHash_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  ipfsHash_ends_with?: InputMaybe<Scalars['String']['input']>;
  ipfsHash_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  ipfsHash_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  ipfsHash_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  purchases_?: InputMaybe<SubmissionPurchase_filter>;
  blockNumber?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_lt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_lte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockTimestamp?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  transactionHash?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_not?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_gt?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_lt?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_gte?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_lte?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  transactionHash_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  transactionHash_contains?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<RequestSubmission_filter>>>;
  or?: InputMaybe<Array<InputMaybe<RequestSubmission_filter>>>;
};

export type RequestSubmission_orderBy =
  | 'id'
  | 'address'
  | 'request'
  | 'request__id'
  | 'request__address'
  | 'request__budget'
  | 'request__creator'
  | 'request__createdAt'
  | 'request__expiresAt'
  | 'request__ipfsHash'
  | 'request__blockNumber'
  | 'request__blockTimestamp'
  | 'request__transactionHash'
  | 'submitter'
  | 'price'
  | 'createdAt'
  | 'ipfsHash'
  | 'purchases'
  | 'blockNumber'
  | 'blockTimestamp'
  | 'transactionHash';

export type SubmissionPurchase = {
  id: Scalars['ID']['output'];
  submission: RequestSubmission;
  price: Scalars['BigInt']['output'];
  purchaser: Scalars['Bytes']['output'];
  purchaseDate: Scalars['BigInt']['output'];
  blockNumber: Scalars['BigInt']['output'];
  blockTimestamp: Scalars['BigInt']['output'];
  transactionHash: Scalars['Bytes']['output'];
};

export type SubmissionPurchase_filter = {
  id?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  submission?: InputMaybe<Scalars['String']['input']>;
  submission_not?: InputMaybe<Scalars['String']['input']>;
  submission_gt?: InputMaybe<Scalars['String']['input']>;
  submission_lt?: InputMaybe<Scalars['String']['input']>;
  submission_gte?: InputMaybe<Scalars['String']['input']>;
  submission_lte?: InputMaybe<Scalars['String']['input']>;
  submission_in?: InputMaybe<Array<Scalars['String']['input']>>;
  submission_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  submission_contains?: InputMaybe<Scalars['String']['input']>;
  submission_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  submission_not_contains?: InputMaybe<Scalars['String']['input']>;
  submission_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  submission_starts_with?: InputMaybe<Scalars['String']['input']>;
  submission_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  submission_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  submission_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  submission_ends_with?: InputMaybe<Scalars['String']['input']>;
  submission_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  submission_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  submission_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  submission_?: InputMaybe<RequestSubmission_filter>;
  price?: InputMaybe<Scalars['BigInt']['input']>;
  price_not?: InputMaybe<Scalars['BigInt']['input']>;
  price_gt?: InputMaybe<Scalars['BigInt']['input']>;
  price_lt?: InputMaybe<Scalars['BigInt']['input']>;
  price_gte?: InputMaybe<Scalars['BigInt']['input']>;
  price_lte?: InputMaybe<Scalars['BigInt']['input']>;
  price_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  price_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  purchaser?: InputMaybe<Scalars['Bytes']['input']>;
  purchaser_not?: InputMaybe<Scalars['Bytes']['input']>;
  purchaser_gt?: InputMaybe<Scalars['Bytes']['input']>;
  purchaser_lt?: InputMaybe<Scalars['Bytes']['input']>;
  purchaser_gte?: InputMaybe<Scalars['Bytes']['input']>;
  purchaser_lte?: InputMaybe<Scalars['Bytes']['input']>;
  purchaser_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  purchaser_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  purchaser_contains?: InputMaybe<Scalars['Bytes']['input']>;
  purchaser_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  purchaseDate?: InputMaybe<Scalars['BigInt']['input']>;
  purchaseDate_not?: InputMaybe<Scalars['BigInt']['input']>;
  purchaseDate_gt?: InputMaybe<Scalars['BigInt']['input']>;
  purchaseDate_lt?: InputMaybe<Scalars['BigInt']['input']>;
  purchaseDate_gte?: InputMaybe<Scalars['BigInt']['input']>;
  purchaseDate_lte?: InputMaybe<Scalars['BigInt']['input']>;
  purchaseDate_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  purchaseDate_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockNumber?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_lt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_lte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockTimestamp?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  transactionHash?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_not?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_gt?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_lt?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_gte?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_lte?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  transactionHash_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  transactionHash_contains?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<SubmissionPurchase_filter>>>;
  or?: InputMaybe<Array<InputMaybe<SubmissionPurchase_filter>>>;
};

export type SubmissionPurchase_orderBy =
  | 'id'
  | 'submission'
  | 'submission__id'
  | 'submission__address'
  | 'submission__submitter'
  | 'submission__price'
  | 'submission__createdAt'
  | 'submission__ipfsHash'
  | 'submission__blockNumber'
  | 'submission__blockTimestamp'
  | 'submission__transactionHash'
  | 'price'
  | 'purchaser'
  | 'purchaseDate'
  | 'blockNumber'
  | 'blockTimestamp'
  | 'transactionHash';

export type Subscription = {
  pictureRequest?: Maybe<PictureRequest>;
  pictureRequests: Array<PictureRequest>;
  requestSubmission?: Maybe<RequestSubmission>;
  requestSubmissions: Array<RequestSubmission>;
  requestComment?: Maybe<RequestComment>;
  requestComments: Array<RequestComment>;
  submissionPurchase?: Maybe<SubmissionPurchase>;
  submissionPurchases: Array<SubmissionPurchase>;
  /** Access to subgraph metadata */
  _meta?: Maybe<_Meta_>;
};


export type SubscriptionpictureRequestArgs = {
  id: Scalars['ID']['input'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionpictureRequestsArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<PictureRequest_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<PictureRequest_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionrequestSubmissionArgs = {
  id: Scalars['ID']['input'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionrequestSubmissionsArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<RequestSubmission_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<RequestSubmission_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionrequestCommentArgs = {
  id: Scalars['ID']['input'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionrequestCommentsArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<RequestComment_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<RequestComment_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionsubmissionPurchaseArgs = {
  id: Scalars['ID']['input'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionsubmissionPurchasesArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<SubmissionPurchase_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<SubmissionPurchase_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Subscription_metaArgs = {
  block?: InputMaybe<Block_height>;
};

export type _Block_ = {
  /** The hash of the block */
  hash?: Maybe<Scalars['Bytes']['output']>;
  /** The block number */
  number: Scalars['Int']['output'];
  /** Integer representation of the timestamp stored in blocks for the chain */
  timestamp?: Maybe<Scalars['Int']['output']>;
  /** The hash of the parent block */
  parentHash?: Maybe<Scalars['Bytes']['output']>;
};

/** The type for the top-level _meta field */
export type _Meta_ = {
  /**
   * Information about a specific subgraph block. The hash of the block
   * will be null if the _meta field has a block constraint that asks for
   * a block number. It will be filled if the _meta field has no block constraint
   * and therefore asks for the latest  block
   *
   */
  block: _Block_;
  /** The deployment ID */
  deployment: Scalars['String']['output'];
  /** If `true`, the subgraph encountered indexing errors at some past block */
  hasIndexingErrors: Scalars['Boolean']['output'];
};

export type _SubgraphErrorPolicy_ =
  /** Data will be returned even if the subgraph has indexing errors */
  | 'allow'
  /** If the subgraph has indexing errors, data will be omitted. The default. */
  | 'deny';

  export type QuerySdk = {
      /** null **/
  pictureRequest: InContextSdkMethod<Query['pictureRequest'], QuerypictureRequestArgs, MeshContext>,
  /** null **/
  pictureRequests: InContextSdkMethod<Query['pictureRequests'], QuerypictureRequestsArgs, MeshContext>,
  /** null **/
  requestSubmission: InContextSdkMethod<Query['requestSubmission'], QueryrequestSubmissionArgs, MeshContext>,
  /** null **/
  requestSubmissions: InContextSdkMethod<Query['requestSubmissions'], QueryrequestSubmissionsArgs, MeshContext>,
  /** null **/
  requestComment: InContextSdkMethod<Query['requestComment'], QueryrequestCommentArgs, MeshContext>,
  /** null **/
  requestComments: InContextSdkMethod<Query['requestComments'], QueryrequestCommentsArgs, MeshContext>,
  /** null **/
  submissionPurchase: InContextSdkMethod<Query['submissionPurchase'], QuerysubmissionPurchaseArgs, MeshContext>,
  /** null **/
  submissionPurchases: InContextSdkMethod<Query['submissionPurchases'], QuerysubmissionPurchasesArgs, MeshContext>,
  /** Access to subgraph metadata **/
  _meta: InContextSdkMethod<Query['_meta'], Query_metaArgs, MeshContext>
  };

  export type MutationSdk = {
    
  };

  export type SubscriptionSdk = {
      /** null **/
  pictureRequest: InContextSdkMethod<Subscription['pictureRequest'], SubscriptionpictureRequestArgs, MeshContext>,
  /** null **/
  pictureRequests: InContextSdkMethod<Subscription['pictureRequests'], SubscriptionpictureRequestsArgs, MeshContext>,
  /** null **/
  requestSubmission: InContextSdkMethod<Subscription['requestSubmission'], SubscriptionrequestSubmissionArgs, MeshContext>,
  /** null **/
  requestSubmissions: InContextSdkMethod<Subscription['requestSubmissions'], SubscriptionrequestSubmissionsArgs, MeshContext>,
  /** null **/
  requestComment: InContextSdkMethod<Subscription['requestComment'], SubscriptionrequestCommentArgs, MeshContext>,
  /** null **/
  requestComments: InContextSdkMethod<Subscription['requestComments'], SubscriptionrequestCommentsArgs, MeshContext>,
  /** null **/
  submissionPurchase: InContextSdkMethod<Subscription['submissionPurchase'], SubscriptionsubmissionPurchaseArgs, MeshContext>,
  /** null **/
  submissionPurchases: InContextSdkMethod<Subscription['submissionPurchases'], SubscriptionsubmissionPurchasesArgs, MeshContext>,
  /** Access to subgraph metadata **/
  _meta: InContextSdkMethod<Subscription['_meta'], Subscription_metaArgs, MeshContext>
  };

  export type Context = {
      ["fixmypic-graph"]: { Query: QuerySdk, Mutation: MutationSdk, Subscription: SubscriptionSdk },
      
    };
}
