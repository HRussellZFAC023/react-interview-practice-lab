import { useState } from 'react'
import type { Dispatch, SetStateAction } from 'react'

export function useLocalStorage<TValue>(
  _key: string,
  initialValue: TValue,
): [TValue, Dispatch<SetStateAction<TValue>>] {
  const [value, setValue] = useState(initialValue)

  return [value, setValue]
}
