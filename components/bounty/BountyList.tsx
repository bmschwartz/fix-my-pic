'use client'

import { Bounty } from '@/types/bounty'
import { useBounty } from '@/hooks/useBounty'

export const BountyList = () => {
  const { bounties } = useBounty()

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="px-6 py-3 border-b border-gray-200">Title</th>
              <th className="px-6 py-3 border-b border-gray-200">Reward</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(bounties) &&
              bounties.map((bounty: Bounty) => (
                <tr key={bounty.address}>
                  <td className="px-6 py-4 border-b border-gray-200">{bounty.title}</td>
                  <td className="px-6 py-4 border-b border-gray-200">{bounty.reward}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
