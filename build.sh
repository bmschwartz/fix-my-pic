#!/bin/bash

if [ "$VERCEL_ENV" == "production" ]; then
  echo "Running production GraphQL compilation"
  pnpm run compile-gql-prod
elif [ "$VERCEL_ENV" == "preview" ]; then
  echo "Running preview GraphQL compilation"
  pnpm run compile-gql-test
else
  echo "Running development GraphQL compilation"
  pnpm run compile-gql-dev
fi

echo "Running Next.js build"
pnpm run build
