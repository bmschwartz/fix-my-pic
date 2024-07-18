export function arrayToMap<T>(array: T[], key: string & keyof T): { [key: string]: T } {
  return array.reduce((acc: { [key: string]: T }, obj: T) => {
    acc[key] = obj
    return acc
  }, {})
}
