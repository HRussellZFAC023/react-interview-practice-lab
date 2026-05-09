import { useState } from 'react'
import type { Dispatch, SetStateAction } from 'react'

export function useLocalStorage<TValue>(
  _key: string,
  initialValue: TValue,
): [TValue, Dispatch<SetStateAction<TValue>>] {
  /*
   * Interview target:
   * - Match useState's tuple API so callers can use functional updates.
   * - Read localStorage once during initial state creation.
   * - Write JSON whenever the value changes.
   * - Fall back to initialValue if storage is missing or corrupted.
   */
  const [value, setValue] = useState(initialValue)

  return [value, setValue]
}
