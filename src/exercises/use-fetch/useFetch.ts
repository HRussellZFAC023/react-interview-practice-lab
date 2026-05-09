export type UseFetchResult<TData> = {
  data: TData | null
  isLoading: boolean
  error: string | null
}

export function useFetch<TData>(
  url: string,
  options?: RequestInit,
): UseFetchResult<TData> {
  /*
   * Interview target:
   * - Start loading for each request.
   * - Fetch and parse JSON into TData.
   * - Treat non-2xx responses as errors.
   * - Clean up so an obsolete request cannot update React state.
   *
   * Keep the public return shape unchanged. PokemonList is written against it,
   * and the submission tests exercise the hook through that component.
   */
  void url
  void options

  return {
    data: null,
    isLoading: false,
    error: 'TODO: implement useFetch in src/exercises/use-fetch/useFetch.ts',
  }
}
