export function getUnixTimestampOneYearFromNow(): number {
  const oneYearInSeconds = 365 * 24 * 60 * 60; // Seconds in one year
  const currentTimestamp = Math.floor(Date.now() / 1000); // Current Unix timestamp in seconds
  return currentTimestamp + oneYearInSeconds;
}

export function getDateTimeFromUnixTimestamp(timestamp: number): string {
  const date = new Date(timestamp * 1000); // multiply by 1000 to convert from seconds to milliseconds
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
