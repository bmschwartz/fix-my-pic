export const delay = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

interface PollWithRetryOptions<T> {
  callback: () => Promise<T | null>;
  retries?: number;
  delayTime?: number;
}

export const pollWithRetry = async <T>({
  callback,
  retries = 20,
  delayTime = 2000,
}: PollWithRetryOptions<T>): Promise<T | null> => {
  for (let i = 0; i < retries; i++) {
    await delay(delayTime); // Wait before retry

    const result = await callback();
    if (result) {
      return result;
    }
  }
  return null;
};
