import { useWallet } from '@/hooks/useWallet'
import styles from './SelectedWallet.module.css'
import { ConnectWallet } from './ConnectWallet'

export const SelectedWallet = () => {
  const { selectedWallet, selectedAccount, disconnectWallet } = useWallet()

  return (
    <div className={styles.container}>
      {!selectedAccount && <ConnectWallet />}
      {selectedAccount && selectedWallet && (
        <>
          <button onClick={disconnectWallet}>Disconnect {selectedWallet.info.name}</button>
        </>
      )}
    </div>
  )
}
