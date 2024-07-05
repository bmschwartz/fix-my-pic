'use client'

import { useBounty } from '@/hooks/useBounty'
import { Bounty } from '@/types/bounty'

interface BountyListProps {
  className: string
}

export const BountyList = ({ className }: BountyListProps) => {
  const { bounties } = useBounty()

  return (
    <div className={className}>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="px-6 py-3 border-b border-gray-200">Title</th>
              <th className="px-6 py-3 border-b border-gray-200">Reward</th>
              <th className="px-6 py-3 border-b border-gray-200">Status</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(bounties) &&
              bounties.map((bounty: Bounty) => (
                <tr key={bounty.address}>
                  <td className="px-6 py-4 border-b border-gray-200">{bounty.title}</td>
                  <td className="px-6 py-4 border-b border-gray-200">{bounty.reward}</td>
                  <td className="px-6 py-4 border-b border-gray-200">{bounty.status}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
