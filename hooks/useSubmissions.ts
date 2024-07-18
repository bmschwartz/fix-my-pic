import { useContext } from 'react'
import { SubmissionContext, SubmissionContextType } from '@/contexts/SubmissionContext'
import {
  RequestSubmissionContext,
  RequestSubmissionContextType,
} from '@/contexts/RequestSubmissionContext'

export const useSubmissions = (): SubmissionContextType => {
  const context = useContext(SubmissionContext)
  if (!context) {
    throw new Error('useSubmissions must be used within an SubmissionProvider')
  }
  return context
}

export const useRequestSubmissions = (): RequestSubmissionContextType => {
  const context = useContext(RequestSubmissionContext)
  if (!context) {
    throw new Error('useRequestSubmissions must be used within a RequestSubmissionProvider')
  }
  return context
}
