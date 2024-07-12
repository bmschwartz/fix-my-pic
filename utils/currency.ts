const getEthUsdRate = async (): Promise<number> => {
  const response = await fetch(
    'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd'
  )
  const data = await response.json()
  return data.ethereum.usd
}

export const convertUsdToEth = async (usdAmount: number | string): Promise<string> => {
  const rate = await getEthUsdRate()
  const ethAmount = Number(usdAmount) / rate
  const ethString = String(ethAmount)
  const [integer, fraction] = ethString.split('.')
  return integer + '.' + fraction.substring(0, 18)
}
