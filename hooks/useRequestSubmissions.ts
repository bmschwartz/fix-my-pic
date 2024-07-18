import { useContext } from 'react'
import {
  RequestSubmissionContext,
  RequestSubmissionContextType,
} from '@/contexts/RequestSubmissionContext'

export const useRequestSubmissions = (): RequestSubmissionContextType => {
  const context = useContext(RequestSubmissionContext)
  if (!context) {
    throw new Error('useRequestSubmissions must be used within a RequestSubmissionProvider')
  }
  return context
}
