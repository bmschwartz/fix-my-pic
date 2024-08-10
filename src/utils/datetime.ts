export function getUnixTimestampOneYearFromNow(): number {
  const oneYearInSeconds = 365 * 24 * 60 * 60; // Seconds in one year
  const currentTimestamp = Math.floor(Date.now() / 1000); // Current Unix timestamp in seconds
  return currentTimestamp + oneYearInSeconds;
}
