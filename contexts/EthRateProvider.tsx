import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react'
import { getEthUsdRate } from '@/utils/currency'

export interface EthUsdRateContextType {
  ethToUsdRate?: number
}

interface EthUsdRateProviderProps {
  children: ReactNode
}

export const EthUsdRateContext = createContext<EthUsdRateContextType | undefined>(undefined)

export const EthUsdRateProvider = ({ children }: EthUsdRateProviderProps) => {
  const [ethToUsdRate, setEthToUsdRate] = useState<number>()

  useEffect(() => {
    let intervalId

    const fetchEthUsdRate = async () => {
      try {
        setEthToUsdRate(await getEthUsdRate())
      } catch (error) {
        console.error('Error fetching ETH to USD rate:', error)
      }
    }

    fetchEthUsdRate()
    intervalId = setInterval(fetchEthUsdRate, 30000)

    return () => clearInterval(intervalId)
  }, [])

  return (
    <EthUsdRateContext.Provider value={{ ethToUsdRate }}>{children}</EthUsdRateContext.Provider>
  )
}
