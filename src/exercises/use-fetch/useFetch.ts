export type UseFetchResult<TData> = {
  data: TData | null
  isLoading: boolean
  error: string | null
}

export function useFetch<TData>(
  url: string,
  options?: RequestInit,
): UseFetchResult<TData> {
  void url
  void options

  return {
    data: null,
    isLoading: false,
    error: 'TODO: implement useFetch in src/exercises/use-fetch/useFetch.ts',
  }
}
