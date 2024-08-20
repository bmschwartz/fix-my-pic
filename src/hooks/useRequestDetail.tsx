import { useContext } from 'react';

import { RequestDetailContext, RequestDetailContextType } from '@/contexts/RequestDetailContext';

export const useRequestDetail = (): RequestDetailContextType => {
  const context = useContext(RequestDetailContext);
  if (!context) {
    throw new Error('useRequestDetail must be used within a RequestDetailProvider');
  }
  return context;
};
