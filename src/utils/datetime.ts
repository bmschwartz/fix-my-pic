export function getUnixTimestampOneYearFromNow(): number {
  const oneYearInSeconds = 365 * 24 * 60 * 60; // Seconds in one year
  const currentTimestamp = Math.floor(Date.now() / 1000); // Current Unix timestamp in seconds
  return currentTimestamp + oneYearInSeconds;
}

export function getDateTimeFromUnixTimestamp(timestamp: number): string {
  const date = new Date(timestamp * 1000); // multiply by 1000 to convert from seconds to milliseconds
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function getTimeSince(timestamp: number): string {
  // get the seconds, minutes, hours, or days ago.
  // return 'just now' if the timestamp is less than 1 minute ago
  // return 'x minutes ago' if the timestamp is less than 1 hour ago
  // return 'x hours ago' if the timestamp is less than 1 day ago
  // return 'x days ago' if the timestamp is more than 1 day ago
  const seconds = Math.floor(Date.now() / 1000 - timestamp);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) {
    return 'just now';
  } else if (minutes < 60) {
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  } else if (hours < 24) {
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  } else {
    return `${days} day${days > 1 ? 's' : ''} ago`;
  }
}
