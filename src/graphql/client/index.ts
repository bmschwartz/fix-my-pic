// @ts-nocheck
import { GraphQLResolveInfo, SelectionSetNode, FieldNode, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
import { gql } from '@graphql-mesh/utils';

import type { GetMeshOptions } from '@graphql-mesh/runtime';
import type { YamlConfig } from '@graphql-mesh/types';
import { PubSub } from '@graphql-mesh/utils';
import { DefaultLogger } from '@graphql-mesh/utils';
import MeshCache from "@graphql-mesh/cache-localforage";
import { fetch as fetchFn } from '@whatwg-node/fetch';

import { MeshResolvedSource } from '@graphql-mesh/runtime';
import { MeshTransform, MeshPlugin } from '@graphql-mesh/types';
import GraphqlHandler from "@graphql-mesh/graphql"
import BareMerger from "@graphql-mesh/merger-bare";
import { printWithCache } from '@graphql-mesh/utils';
import { usePersistedOperations } from '@graphql-yoga/plugin-persisted-operations';
import { createMeshHTTPHandler, MeshHTTPHandler } from '@graphql-mesh/http';
import { getMesh, ExecuteMeshFn, SubscribeMeshFn, MeshContext as BaseMeshContext, MeshInstance } from '@graphql-mesh/runtime';
import { MeshStore, FsStoreStorageAdapter } from '@graphql-mesh/store';
import { path as pathModule } from '@graphql-mesh/cross-helpers';
import { ImportFn } from '@graphql-mesh/types';
import type { FixmypicGraphTypes } from './sources/fixmypic-graph/types';
import * as importedModule$0 from "./sources/fixmypic-graph/introspectionSchema";
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };



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

export type WithIndex<TObject> = TObject & Record<string, any>;
export type ResolversObject<TObject> = WithIndex<TObject>;

export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};

export type LegacyStitchingResolver<TResult, TParent, TContext, TArgs> = {
  fragment: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};

export type NewStitchingResolver<TResult, TParent, TContext, TArgs> = {
  selectionSet: string | ((fieldNode: FieldNode) => SelectionSetNode);
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type StitchingResolver<TResult, TParent, TContext, TArgs> = LegacyStitchingResolver<TResult, TParent, TContext, TArgs> | NewStitchingResolver<TResult, TParent, TContext, TArgs>;
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | ResolverWithResolve<TResult, TParent, TContext, TArgs>
  | StitchingResolver<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;



/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = ResolversObject<{
  Aggregation_interval: Aggregation_interval;
  BigDecimal: ResolverTypeWrapper<Scalars['BigDecimal']['output']>;
  BigInt: ResolverTypeWrapper<Scalars['BigInt']['output']>;
  BlockChangedFilter: BlockChangedFilter;
  Block_height: Block_height;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  Bytes: ResolverTypeWrapper<Scalars['Bytes']['output']>;
  Float: ResolverTypeWrapper<Scalars['Float']['output']>;
  ID: ResolverTypeWrapper<Scalars['ID']['output']>;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  Int8: ResolverTypeWrapper<Scalars['Int8']['output']>;
  OrderDirection: OrderDirection;
  PictureRequest: ResolverTypeWrapper<PictureRequest>;
  PictureRequest_filter: PictureRequest_filter;
  PictureRequest_orderBy: PictureRequest_orderBy;
  Query: ResolverTypeWrapper<{}>;
  RequestComment: ResolverTypeWrapper<RequestComment>;
  RequestComment_filter: RequestComment_filter;
  RequestComment_orderBy: RequestComment_orderBy;
  RequestSubmission: ResolverTypeWrapper<RequestSubmission>;
  RequestSubmission_filter: RequestSubmission_filter;
  RequestSubmission_orderBy: RequestSubmission_orderBy;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  SubmissionPurchase: ResolverTypeWrapper<SubmissionPurchase>;
  SubmissionPurchase_filter: SubmissionPurchase_filter;
  SubmissionPurchase_orderBy: SubmissionPurchase_orderBy;
  Subscription: ResolverTypeWrapper<{}>;
  Timestamp: ResolverTypeWrapper<Scalars['Timestamp']['output']>;
  _Block_: ResolverTypeWrapper<_Block_>;
  _Meta_: ResolverTypeWrapper<_Meta_>;
  _SubgraphErrorPolicy_: _SubgraphErrorPolicy_;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  BigDecimal: Scalars['BigDecimal']['output'];
  BigInt: Scalars['BigInt']['output'];
  BlockChangedFilter: BlockChangedFilter;
  Block_height: Block_height;
  Boolean: Scalars['Boolean']['output'];
  Bytes: Scalars['Bytes']['output'];
  Float: Scalars['Float']['output'];
  ID: Scalars['ID']['output'];
  Int: Scalars['Int']['output'];
  Int8: Scalars['Int8']['output'];
  PictureRequest: PictureRequest;
  PictureRequest_filter: PictureRequest_filter;
  Query: {};
  RequestComment: RequestComment;
  RequestComment_filter: RequestComment_filter;
  RequestSubmission: RequestSubmission;
  RequestSubmission_filter: RequestSubmission_filter;
  String: Scalars['String']['output'];
  SubmissionPurchase: SubmissionPurchase;
  SubmissionPurchase_filter: SubmissionPurchase_filter;
  Subscription: {};
  Timestamp: Scalars['Timestamp']['output'];
  _Block_: _Block_;
  _Meta_: _Meta_;
}>;

export type entityDirectiveArgs = { };

export type entityDirectiveResolver<Result, Parent, ContextType = MeshContext, Args = entityDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type subgraphIdDirectiveArgs = {
  id: Scalars['String']['input'];
};

export type subgraphIdDirectiveResolver<Result, Parent, ContextType = MeshContext, Args = subgraphIdDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type derivedFromDirectiveArgs = {
  field: Scalars['String']['input'];
};

export type derivedFromDirectiveResolver<Result, Parent, ContextType = MeshContext, Args = derivedFromDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export interface BigDecimalScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['BigDecimal'], any> {
  name: 'BigDecimal';
}

export interface BigIntScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['BigInt'], any> {
  name: 'BigInt';
}

export interface BytesScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Bytes'], any> {
  name: 'Bytes';
}

export interface Int8ScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Int8'], any> {
  name: 'Int8';
}

export type PictureRequestResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['PictureRequest'] = ResolversParentTypes['PictureRequest']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  address?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
  budget?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  creator?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  expiresAt?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  ipfsHash?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  comments?: Resolver<Array<ResolversTypes['RequestComment']>, ParentType, ContextType, RequireFields<PictureRequestcommentsArgs, 'skip' | 'first'>>;
  submissions?: Resolver<Array<ResolversTypes['RequestSubmission']>, ParentType, ContextType, RequireFields<PictureRequestsubmissionsArgs, 'skip' | 'first'>>;
  blockNumber?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  blockTimestamp?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  transactionHash?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type QueryResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  pictureRequest?: Resolver<Maybe<ResolversTypes['PictureRequest']>, ParentType, ContextType, RequireFields<QuerypictureRequestArgs, 'id' | 'subgraphError'>>;
  pictureRequests?: Resolver<Array<ResolversTypes['PictureRequest']>, ParentType, ContextType, RequireFields<QuerypictureRequestsArgs, 'skip' | 'first' | 'subgraphError'>>;
  requestSubmission?: Resolver<Maybe<ResolversTypes['RequestSubmission']>, ParentType, ContextType, RequireFields<QueryrequestSubmissionArgs, 'id' | 'subgraphError'>>;
  requestSubmissions?: Resolver<Array<ResolversTypes['RequestSubmission']>, ParentType, ContextType, RequireFields<QueryrequestSubmissionsArgs, 'skip' | 'first' | 'subgraphError'>>;
  requestComment?: Resolver<Maybe<ResolversTypes['RequestComment']>, ParentType, ContextType, RequireFields<QueryrequestCommentArgs, 'id' | 'subgraphError'>>;
  requestComments?: Resolver<Array<ResolversTypes['RequestComment']>, ParentType, ContextType, RequireFields<QueryrequestCommentsArgs, 'skip' | 'first' | 'subgraphError'>>;
  submissionPurchase?: Resolver<Maybe<ResolversTypes['SubmissionPurchase']>, ParentType, ContextType, RequireFields<QuerysubmissionPurchaseArgs, 'id' | 'subgraphError'>>;
  submissionPurchases?: Resolver<Array<ResolversTypes['SubmissionPurchase']>, ParentType, ContextType, RequireFields<QuerysubmissionPurchasesArgs, 'skip' | 'first' | 'subgraphError'>>;
  _meta?: Resolver<Maybe<ResolversTypes['_Meta_']>, ParentType, ContextType, Partial<Query_metaArgs>>;
}>;

export type RequestCommentResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['RequestComment'] = ResolversParentTypes['RequestComment']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  address?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
  request?: Resolver<ResolversTypes['PictureRequest'], ParentType, ContextType>;
  commenter?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  ipfsHash?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  blockNumber?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  blockTimestamp?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  transactionHash?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type RequestSubmissionResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['RequestSubmission'] = ResolversParentTypes['RequestSubmission']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  address?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
  request?: Resolver<ResolversTypes['PictureRequest'], ParentType, ContextType>;
  submitter?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
  price?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  ipfsHash?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  purchases?: Resolver<Array<ResolversTypes['SubmissionPurchase']>, ParentType, ContextType, RequireFields<RequestSubmissionpurchasesArgs, 'skip' | 'first'>>;
  blockNumber?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  blockTimestamp?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  transactionHash?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type SubmissionPurchaseResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['SubmissionPurchase'] = ResolversParentTypes['SubmissionPurchase']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  submission?: Resolver<ResolversTypes['RequestSubmission'], ParentType, ContextType>;
  price?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  purchaser?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
  purchaseDate?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  blockNumber?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  blockTimestamp?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  transactionHash?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type SubscriptionResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['Subscription'] = ResolversParentTypes['Subscription']> = ResolversObject<{
  pictureRequest?: SubscriptionResolver<Maybe<ResolversTypes['PictureRequest']>, "pictureRequest", ParentType, ContextType, RequireFields<SubscriptionpictureRequestArgs, 'id' | 'subgraphError'>>;
  pictureRequests?: SubscriptionResolver<Array<ResolversTypes['PictureRequest']>, "pictureRequests", ParentType, ContextType, RequireFields<SubscriptionpictureRequestsArgs, 'skip' | 'first' | 'subgraphError'>>;
  requestSubmission?: SubscriptionResolver<Maybe<ResolversTypes['RequestSubmission']>, "requestSubmission", ParentType, ContextType, RequireFields<SubscriptionrequestSubmissionArgs, 'id' | 'subgraphError'>>;
  requestSubmissions?: SubscriptionResolver<Array<ResolversTypes['RequestSubmission']>, "requestSubmissions", ParentType, ContextType, RequireFields<SubscriptionrequestSubmissionsArgs, 'skip' | 'first' | 'subgraphError'>>;
  requestComment?: SubscriptionResolver<Maybe<ResolversTypes['RequestComment']>, "requestComment", ParentType, ContextType, RequireFields<SubscriptionrequestCommentArgs, 'id' | 'subgraphError'>>;
  requestComments?: SubscriptionResolver<Array<ResolversTypes['RequestComment']>, "requestComments", ParentType, ContextType, RequireFields<SubscriptionrequestCommentsArgs, 'skip' | 'first' | 'subgraphError'>>;
  submissionPurchase?: SubscriptionResolver<Maybe<ResolversTypes['SubmissionPurchase']>, "submissionPurchase", ParentType, ContextType, RequireFields<SubscriptionsubmissionPurchaseArgs, 'id' | 'subgraphError'>>;
  submissionPurchases?: SubscriptionResolver<Array<ResolversTypes['SubmissionPurchase']>, "submissionPurchases", ParentType, ContextType, RequireFields<SubscriptionsubmissionPurchasesArgs, 'skip' | 'first' | 'subgraphError'>>;
  _meta?: SubscriptionResolver<Maybe<ResolversTypes['_Meta_']>, "_meta", ParentType, ContextType, Partial<Subscription_metaArgs>>;
}>;

export interface TimestampScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Timestamp'], any> {
  name: 'Timestamp';
}

export type _Block_Resolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['_Block_'] = ResolversParentTypes['_Block_']> = ResolversObject<{
  hash?: Resolver<Maybe<ResolversTypes['Bytes']>, ParentType, ContextType>;
  number?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  timestamp?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  parentHash?: Resolver<Maybe<ResolversTypes['Bytes']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type _Meta_Resolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['_Meta_'] = ResolversParentTypes['_Meta_']> = ResolversObject<{
  block?: Resolver<ResolversTypes['_Block_'], ParentType, ContextType>;
  deployment?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  hasIndexingErrors?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type Resolvers<ContextType = MeshContext> = ResolversObject<{
  BigDecimal?: GraphQLScalarType;
  BigInt?: GraphQLScalarType;
  Bytes?: GraphQLScalarType;
  Int8?: GraphQLScalarType;
  PictureRequest?: PictureRequestResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  RequestComment?: RequestCommentResolvers<ContextType>;
  RequestSubmission?: RequestSubmissionResolvers<ContextType>;
  SubmissionPurchase?: SubmissionPurchaseResolvers<ContextType>;
  Subscription?: SubscriptionResolvers<ContextType>;
  Timestamp?: GraphQLScalarType;
  _Block_?: _Block_Resolvers<ContextType>;
  _Meta_?: _Meta_Resolvers<ContextType>;
}>;

export type DirectiveResolvers<ContextType = MeshContext> = ResolversObject<{
  entity?: entityDirectiveResolver<any, any, ContextType>;
  subgraphId?: subgraphIdDirectiveResolver<any, any, ContextType>;
  derivedFrom?: derivedFromDirectiveResolver<any, any, ContextType>;
}>;

export type MeshContext = FixmypicGraphTypes.Context & BaseMeshContext;


const baseDir = pathModule.join(typeof __dirname === 'string' ? __dirname : '/', '..');

const importFn: ImportFn = <T>(moduleId: string) => {
  const relativeModuleId = (pathModule.isAbsolute(moduleId) ? pathModule.relative(baseDir, moduleId) : moduleId).split('\\').join('/').replace(baseDir + '/', '');
  switch(relativeModuleId) {
    case ".graphclient/sources/fixmypic-graph/introspectionSchema":
      return Promise.resolve(importedModule$0) as T;
    
    default:
      return Promise.reject(new Error(`Cannot find module '${relativeModuleId}'.`));
  }
};

const rootStore = new MeshStore('.graphclient', new FsStoreStorageAdapter({
  cwd: baseDir,
  importFn,
  fileType: "ts",
}), {
  readonly: true,
  validate: false
});

export const rawServeConfig: YamlConfig.Config['serve'] = undefined as any
export async function getMeshOptions(): Promise<GetMeshOptions> {
const pubsub = new PubSub();
const sourcesStore = rootStore.child('sources');
const logger = new DefaultLogger("GraphClient");
const cache = new (MeshCache as any)({
      ...({} as any),
      importFn,
      store: rootStore.child('cache'),
      pubsub,
      logger,
    } as any)

const sources: MeshResolvedSource[] = [];
const transforms: MeshTransform[] = [];
const additionalEnvelopPlugins: MeshPlugin<any>[] = [];
const fixmypicGraphTransforms = [];
const additionalTypeDefs = [] as any[];
const fixmypicGraphHandler = new GraphqlHandler({
              name: "fixmypic-graph",
              config: {"endpoint":"http://localhost:8000/subgraphs/name/fixmypic-graph"},
              baseDir,
              cache,
              pubsub,
              store: sourcesStore.child("fixmypic-graph"),
              logger: logger.child("fixmypic-graph"),
              importFn,
            });
sources[0] = {
          name: 'fixmypic-graph',
          handler: fixmypicGraphHandler,
          transforms: fixmypicGraphTransforms
        }
const additionalResolvers = [] as any[]
const merger = new(BareMerger as any)({
        cache,
        pubsub,
        logger: logger.child('bareMerger'),
        store: rootStore.child('bareMerger')
      })
const documentHashMap = {
        "7d4ffd17e47b5e3852df435c39e0ff8a8d26888fff65e54ab3a97cce4938e3ac": GetPictureRequestDocument,
"8ac9617e059b57499d218e773b34cc906da473324ff1f386219b6eb557491108": GetPictureRequestsDocument
      }
additionalEnvelopPlugins.push(usePersistedOperations({
        getPersistedOperation(key) {
          return documentHashMap[key];
        },
        ...{}
      }))

  return {
    sources,
    transforms,
    additionalTypeDefs,
    additionalResolvers,
    cache,
    pubsub,
    merger,
    logger,
    additionalEnvelopPlugins,
    get documents() {
      return [
      {
        document: GetPictureRequestDocument,
        get rawSDL() {
          return printWithCache(GetPictureRequestDocument);
        },
        location: 'GetPictureRequestDocument.graphql',
        sha256Hash: '7d4ffd17e47b5e3852df435c39e0ff8a8d26888fff65e54ab3a97cce4938e3ac'
      },{
        document: GetPictureRequestsDocument,
        get rawSDL() {
          return printWithCache(GetPictureRequestsDocument);
        },
        location: 'GetPictureRequestsDocument.graphql',
        sha256Hash: '8ac9617e059b57499d218e773b34cc906da473324ff1f386219b6eb557491108'
      }
    ];
    },
    fetchFn,
  };
}

export function createBuiltMeshHTTPHandler<TServerContext = {}>(): MeshHTTPHandler<TServerContext> {
  return createMeshHTTPHandler<TServerContext>({
    baseDir,
    getBuiltMesh: getBuiltGraphClient,
    rawServeConfig: undefined,
  })
}


let meshInstance$: Promise<MeshInstance> | undefined;

export const pollingInterval = null;

export function getBuiltGraphClient(): Promise<MeshInstance> {
  if (meshInstance$ == null) {
    if (pollingInterval) {
      setInterval(() => {
        getMeshOptions()
        .then(meshOptions => getMesh(meshOptions))
        .then(newMesh =>
          meshInstance$.then(oldMesh => {
            oldMesh.destroy()
            meshInstance$ = Promise.resolve(newMesh)
          })
        ).catch(err => {
          console.error("Mesh polling failed so the existing version will be used:", err);
        });
      }, pollingInterval)
    }
    meshInstance$ = getMeshOptions().then(meshOptions => getMesh(meshOptions)).then(mesh => {
      const id = mesh.pubsub.subscribe('destroy', () => {
        meshInstance$ = undefined;
        mesh.pubsub.unsubscribe(id);
      });
      return mesh;
    });
  }
  return meshInstance$;
}

export const execute: ExecuteMeshFn = (...args) => getBuiltGraphClient().then(({ execute }) => execute(...args));

export const subscribe: SubscribeMeshFn = (...args) => getBuiltGraphClient().then(({ subscribe }) => subscribe(...args));
export function getBuiltGraphSDK<TGlobalContext = any, TOperationContext = any>(globalContext?: TGlobalContext) {
  const sdkRequester$ = getBuiltGraphClient().then(({ sdkRequesterFactory }) => sdkRequesterFactory(globalContext));
  return getSdk<TOperationContext, TGlobalContext>((...args) => sdkRequester$.then(sdkRequester => sdkRequester(...args)));
}
export type CommentFragmentFragment = Pick<RequestComment, 'id' | 'ipfsHash' | 'commenter' | 'createdAt'>;

export type PictureRequestFragmentFragment = (
  Pick<PictureRequest, 'id' | 'ipfsHash' | 'budget' | 'creator' | 'createdAt'>
  & { comments: Array<Pick<RequestComment, 'id' | 'ipfsHash' | 'commenter' | 'createdAt'>>, submissions: Array<(
    Pick<RequestSubmission, 'id' | 'price' | 'ipfsHash' | 'submitter' | 'createdAt'>
    & { purchases: Array<Pick<SubmissionPurchase, 'id' | 'purchaser' | 'purchaseDate'>> }
  )> }
);

export type RequestSubmissionFragmentFragment = Pick<RequestSubmission, 'id' | 'price' | 'ipfsHash' | 'submitter' | 'createdAt'>;

export type SubmissionPurchaseFragmentFragment = { purchases: Array<Pick<SubmissionPurchase, 'id' | 'purchaser' | 'purchaseDate'>> };

export type GetPictureRequestQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetPictureRequestQuery = { pictureRequest?: Maybe<(
    Pick<PictureRequest, 'id' | 'ipfsHash' | 'budget' | 'creator' | 'createdAt'>
    & { comments: Array<Pick<RequestComment, 'id' | 'ipfsHash' | 'commenter' | 'createdAt'>>, submissions: Array<(
      Pick<RequestSubmission, 'id' | 'price' | 'ipfsHash' | 'submitter' | 'createdAt'>
      & { purchases: Array<Pick<SubmissionPurchase, 'id' | 'purchaser' | 'purchaseDate'>> }
    )> }
  )> };

export type GetPictureRequestsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetPictureRequestsQuery = { pictureRequests: Array<(
    Pick<PictureRequest, 'id' | 'ipfsHash' | 'budget' | 'creator' | 'createdAt'>
    & { comments: Array<Pick<RequestComment, 'id' | 'ipfsHash' | 'commenter' | 'createdAt'>>, submissions: Array<(
      Pick<RequestSubmission, 'id' | 'price' | 'ipfsHash' | 'submitter' | 'createdAt'>
      & { purchases: Array<Pick<SubmissionPurchase, 'id' | 'purchaser' | 'purchaseDate'>> }
    )> }
  )> };

export const CommentFragmentFragmentDoc = gql`
    fragment CommentFragment on RequestComment {
  id
  ipfsHash
  commenter
  createdAt
}
    ` as unknown as DocumentNode<CommentFragmentFragment, unknown>;
export const RequestSubmissionFragmentFragmentDoc = gql`
    fragment RequestSubmissionFragment on RequestSubmission {
  id
  price
  ipfsHash
  submitter
  createdAt
}
    ` as unknown as DocumentNode<RequestSubmissionFragmentFragment, unknown>;
export const SubmissionPurchaseFragmentFragmentDoc = gql`
    fragment SubmissionPurchaseFragment on RequestSubmission {
  purchases {
    id
    purchaser
    purchaseDate
  }
}
    ` as unknown as DocumentNode<SubmissionPurchaseFragmentFragment, unknown>;
export const PictureRequestFragmentFragmentDoc = gql`
    fragment PictureRequestFragment on PictureRequest {
  id
  ipfsHash
  budget
  creator
  createdAt
  comments {
    ...CommentFragment
  }
  submissions {
    ...RequestSubmissionFragment
    ...SubmissionPurchaseFragment
  }
}
    ${CommentFragmentFragmentDoc}
${RequestSubmissionFragmentFragmentDoc}
${SubmissionPurchaseFragmentFragmentDoc}` as unknown as DocumentNode<PictureRequestFragmentFragment, unknown>;
export const GetPictureRequestDocument = gql`
    query GetPictureRequest($id: ID!) {
  pictureRequest(id: $id) {
    ...PictureRequestFragment
  }
}
    ${PictureRequestFragmentFragmentDoc}` as unknown as DocumentNode<GetPictureRequestQuery, GetPictureRequestQueryVariables>;
export const GetPictureRequestsDocument = gql`
    query GetPictureRequests {
  pictureRequests {
    ...PictureRequestFragment
  }
}
    ${PictureRequestFragmentFragmentDoc}` as unknown as DocumentNode<GetPictureRequestsQuery, GetPictureRequestsQueryVariables>;



export type Requester<C = {}, E = unknown> = <R, V>(doc: DocumentNode, vars?: V, options?: C) => Promise<R> | AsyncIterable<R>
export function getSdk<C, E>(requester: Requester<C, E>) {
  return {
    GetPictureRequest(variables: GetPictureRequestQueryVariables, options?: C): Promise<GetPictureRequestQuery> {
      return requester<GetPictureRequestQuery, GetPictureRequestQueryVariables>(GetPictureRequestDocument, variables, options) as Promise<GetPictureRequestQuery>;
    },
    GetPictureRequests(variables?: GetPictureRequestsQueryVariables, options?: C): Promise<GetPictureRequestsQuery> {
      return requester<GetPictureRequestsQuery, GetPictureRequestsQueryVariables>(GetPictureRequestsDocument, variables, options) as Promise<GetPictureRequestsQuery>;
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;