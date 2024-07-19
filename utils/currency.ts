export const getEthUsdRate = async (): Promise<number> => {
  const response = await fetch(
    'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd'
  )
  const data = await response.json()
  return data.ethereum.usd
}

export const convertUsdToEth = (usdAmount: number | string, rate: number): string => {
  if (usdAmount === 0) {
    return '0'
  }

  const ethAmount = Number(usdAmount) / rate
  const ethString = String(ethAmount)
  const [integer, fraction] = ethString.split('.')
  return integer + '.' + fraction.substring(0, 18)
}

export const convertUsdToEthWithoutRate = async (usdAmount: number | string): Promise<string> => {
  const ethUsdRate = await getEthUsdRate()
  return convertUsdToEth(usdAmount, ethUsdRate)
}

export const convertEthToUsd = (ethAmount: number | string, rate: number): string => {
  const usdAmount = Number(ethAmount) * rate
  return usdAmount.toFixed(2)
}

export const convertEthToUsdWithoutRate = async (ethAmount: number | string): Promise<string> => {
  const ethUsdRate = await getEthUsdRate()
  return convertEthToUsd(ethAmount, ethUsdRate)
}

export const ethDisplayString = (ethAmount: number): string => {
  console.log('DEBUG ethAmount', ethAmount)
  const eth = ethAmount.toFixed(6)
  return `${eth} ETH`
}

export const ethDisplayWithUSDString = (ethAmount: number, rate: number): string => {
  console.log('DEBUG ethAmount with usd', ethAmount)
  const eth = ethAmount.toFixed(6)
  return `${eth} ETH / $${convertEthToUsd(ethAmount, rate)}`
}
