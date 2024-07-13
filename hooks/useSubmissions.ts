import { useContext } from 'react'
import { SubmissionContext, SubmissionContextType } from '@/contexts/SubmissionContext'

export const useSubmissions = (): SubmissionContextType => {
  const context = useContext(SubmissionContext)
  if (!context) {
    throw new Error('useSubmissions must be used within an BountyProvider')
  }
  return context
}
