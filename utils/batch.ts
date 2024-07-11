const DEFAULT_BATCH_SIZE = 50

interface BatchTasksAsyncParams<T> {
  batchSize?: number
  tasks: any[]
  mapFunction: (task: any) => Promise<T>
}

export async function batchTasksAsync<T>({
  tasks,
  mapFunction,
  batchSize = DEFAULT_BATCH_SIZE,
}: BatchTasksAsyncParams<T>): Promise<T[]> {
  let results: T[] = []

  for (let i = 0; i < tasks.length; i += batchSize) {
    const batch = tasks.slice(i, i + batchSize)
    const batchResults = await Promise.all(batch.map(mapFunction))
    results = results.concat(batchResults)
    await new Promise((resolve) => setTimeout(resolve, 1000)) // 1 second delay
  }

  return results
}
