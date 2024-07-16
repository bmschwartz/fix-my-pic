import { Bounty } from '@/types/bounty'
import { convertEthToUsd } from './currency'

export const rewardDisplayString = (bounty: Bounty, rate: number): string => {
  const eth = bounty.reward.toFixed(6)
  return `${eth} ETH / $${convertEthToUsd(bounty.reward, rate)}`
}
