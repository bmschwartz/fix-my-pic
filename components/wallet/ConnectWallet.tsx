import { useWallet } from '@/hooks/useWallet'
import { EIP6963ProviderDetail } from '@/types/eip6963'
import styles from './ConnectWallet.module.css'

export const ConnectWallet = () => {
  const { wallets, connectWallet } = useWallet()
  return (
    <>
      <h2 className={styles.userAccount}>Please select a wallet</h2>
      <div className={styles.walletList}>
        {Object.keys(wallets).length > 0 ? (
          Object.values(wallets).map((provider: EIP6963ProviderDetail) => (
            <button key={provider.info.uuid} onClick={() => connectWallet(provider.info.rdns)}>
              <img src={provider.info.icon} alt={provider.info.name} />
              <div>{provider.info.name}</div>
            </button>
          ))
        ) : (
          <div>there are no Announced Providers</div>
        )}
      </div>
    </>
  )
}
