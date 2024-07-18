export function arrayToMap<T>(array: T[], key: string & keyof T): { [key: string]: T } {
  return array.reduce((acc: { [key: string]: T }, obj: T) => {
    const keyValue = obj[key]
    if (typeof keyValue === 'string') {
      acc[keyValue] = obj
    }
    return acc
  }, {})
}
