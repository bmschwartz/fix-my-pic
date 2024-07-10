import { BountyList, NewBountyForm } from '@/components/bounty'
import { SelectedWallet } from '@/components/wallet'

export default function Home() {
  return (
    <div className="ml-5 mt-10">
      <SelectedWallet />
      <BountyList />
      <NewBountyForm />
    </div>
  )
}
