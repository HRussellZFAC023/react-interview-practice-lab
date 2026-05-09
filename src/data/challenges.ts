type Reference = {
  label: string
  url: string
}

type SolutionFile = {
  path: string
  code: string
}

type Example = {
  label: string
  input: string
  output: string
  explanation: string
}

type Complexity = {
  time: string
  space: string
}

export type Challenge = {
  slug: string
  title: string
  shortTitle: string
  topic: string
  summary: string
  brief: string
  acceptance: string[]
  files: string[]
  examples: Example[]
  foundation: string[]
  mentalModel: string[]
  bruteForce: string
  optimalApproach: string[]
  edgeCases: string[]
  interviewQuestions: string[]
  walkthrough: string[]
  complexity: Complexity
  solutionFiles: SolutionFile[]
  sourceUrl: string
  references: Reference[]
}

const sharedReferences: Reference[] = [
  {
    label: 'React docs: Reusing logic with custom Hooks',
    url: 'https://react.dev/learn/reusing-logic-with-custom-hooks',
  },
  {
    label: 'React docs: useEffect',
    url: 'https://react.dev/reference/react/useEffect',
  },
  {
    label: 'Playwright docs: Writing tests',
    url: 'https://playwright.dev/docs/writing-tests',
  },
]

export const challenges: Challenge[] = [
  {
    slug: 'use-fetch',
    title: 'Build a custom useFetch hook',
    shortTitle: 'useFetch',
    topic: 'Custom hooks and async effects',
    summary:
      'Create a typed hook that wraps fetch, exposes data/loading/error state, and avoids stale updates.',
    brief:
      'Write a reusable data-fetching hook for components that need a consistent loading, error, and data shape. The hook should accept a URL, support standard RequestInit options, parse JSON, surface non-OK responses, and clean up when the component unmounts.',
    acceptance: [
      'Returns parsed response data through a stable result shape.',
      'Reports loading state while the request is in flight.',
      'Reports a useful error state for rejected or non-OK responses.',
      'Accepts the standard RequestInit options object for headers and HTTP methods.',
      'Avoids updating state after the component unmounts or the request is obsolete.',
    ],
    files: [
      'src/exercises/use-fetch/useFetch.ts',
      'src/exercises/use-fetch/PokemonList.tsx',
    ],
    examples: [
      {
        label: 'Successful request',
        input: 'useFetch<PokemonResponse>("https://pokeapi.co/api/v2/pokemon?limit=10")',
        output: '{ data: { results: [...] }, isLoading: false, error: null }',
        explanation:
          'The component starts in a loading state, then renders the parsed JSON once the request completes.',
      },
      {
        label: 'HTTP failure',
        input: 'Server returns status 500',
        output: '{ data: null, isLoading: false, error: "Request failed with status 500" }',
        explanation:
          'fetch only rejects for network-level failures. A good hook checks response.ok and creates its own error for bad statuses.',
      },
    ],
    foundation: [
      'A custom hook is a function that uses React hooks to package stateful behavior. The component should not care whether the data came from fetch, cache, or a test mock; it should only care about the result shape.',
      'An effect is the right place to synchronize with the network because rendering must stay pure. Rendering decides what should appear; effects connect that decision to external systems.',
      'Async UI has at least three states: pending, fulfilled, and rejected. If the hook does not model all three, the component will eventually show stale data, hide failures, or flicker.',
      'The hardest part is not calling fetch. The hard part is controlling which request is allowed to update state when components unmount or inputs change quickly.',
    ],
    mentalModel: [
      'Treat each effect run like a numbered request. Only the most recent request should be allowed to update React state.',
      'State returned from the hook is a small state machine: loading begins true, success fills data, failure fills error, and cleanup prevents obsolete transitions.',
      'AbortController is the browser primitive for canceling fetch. A local boolean guard is still useful because it protects the state update path even if a promise resolves after cleanup.',
    ],
    bruteForce:
      'The naive solution puts fetch directly in every component. That works once, but it duplicates loading and error logic, makes tests harder, and spreads cleanup bugs across the app. Another weak solution is a hook that only handles the happy path; it will pass a demo but fail under real interview follow-up questions.',
    optimalApproach: [
      'Define a generic return type first so the component gets typed data without casting everywhere.',
      'Initialize data, loading, and error explicitly. This makes the first render predictable.',
      'Start fetch inside useEffect, pass through RequestInit options, and combine them with AbortController.signal.',
      'Check response.ok before parsing JSON. Convert failures into a message that the UI can render.',
      'In cleanup, abort the request and mark the effect run as obsolete before any late promise can set state.',
    ],
    edgeCases: [
      'The component unmounts before the request completes.',
      'The URL changes quickly and an older request resolves after the newer one.',
      'The server returns a non-2xx response that fetch would otherwise treat as a successful promise.',
      'JSON parsing fails because the response is empty or malformed.',
      'The options object is recreated on every render, causing repeated effects. In production you might memoize options or accept simpler primitive arguments.',
    ],
    interviewQuestions: [
      'Why does fetch not reject on HTTP 404 or 500?',
      'How would you prevent race conditions when the URL changes quickly?',
      'Should a hook throw, return an error string, or expose the original Error object?',
      'Where would AbortController fit into the cleanup path?',
      'How would you test loading state without relying on a real network?',
    ],
    walkthrough: [
      'Start by writing the return type: data is either typed data or null, isLoading is boolean, and error is either string or null.',
      'Inside the effect, create an AbortController and a local isCurrentRequest flag.',
      'Set loading true and error null before starting the request. This resets the state machine for the new URL.',
      'Await fetch, check response.ok, parse JSON, and only call setData if this effect run is still current.',
      'In catch, ignore AbortError but report real failures. In finally, turn loading off only for the current request.',
      'Return cleanup that flips the guard and aborts the request.',
    ],
    complexity: {
      time: 'O(1) React work per request, plus O(n) to parse a response body of size n.',
      space: 'O(n) for the parsed response body held in state.',
    },
    solutionFiles: [
      {
        path: 'src/exercises/use-fetch/useFetch.ts',
        code: String.raw`import { useEffect, useState } from 'react'

export type UseFetchResult<TData> = {
  data: TData | null
  isLoading: boolean
  error: string | null
}

export function useFetch<TData>(
  url: string,
  options?: RequestInit,
): UseFetchResult<TData> {
  const [data, setData] = useState<TData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const controller = new AbortController()
    let isCurrentRequest = true

    async function load() {
      setIsLoading(true)
      setError(null)

      try {
        const response = await fetch(url, {
          ...options,
          signal: controller.signal,
        })

        if (!response.ok) {
          throw new Error('Request failed with status ' + response.status)
        }

        const json = (await response.json()) as TData

        if (isCurrentRequest) {
          setData(json)
        }
      } catch (caughtError) {
        if (!isCurrentRequest) {
          return
        }

        if (caughtError instanceof DOMException && caughtError.name === 'AbortError') {
          return
        }

        setError(caughtError instanceof Error ? caughtError.message : 'Unknown error')
      } finally {
        if (isCurrentRequest) {
          setIsLoading(false)
        }
      }
    }

    load()

    return () => {
      isCurrentRequest = false
      controller.abort()
    }
  }, [url, options])

  return { data, isLoading, error }
}
`,
      },
    ],
    sourceUrl: 'https://reactpractice.dev/exercise/build-a-custom-usefetch-hook/',
    references: [
      ...sharedReferences,
      {
        label: 'MDN: Using the Fetch API',
        url: 'https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch',
      },
      {
        label: 'MDN: AbortController',
        url: 'https://developer.mozilla.org/en-US/docs/Web/API/AbortController',
      },
    ],
  },
  {
    slug: 'local-storage-hook',
    title: 'Create a custom hook for local storage',
    shortTitle: 'Storage hook',
    topic: 'Custom hooks and browser persistence',
    summary:
      'Extract localStorage persistence into a hook that behaves like useState and survives reloads.',
    brief:
      'Start from a working todo list. Preserve the list between browser sessions by moving storage reads and writes into a reusable custom hook.',
    acceptance: [
      'Reads the initial value from localStorage when the hook mounts.',
      'Falls back to the provided initial value when no stored value exists.',
      'Writes updates to localStorage whenever the value changes.',
      'Keeps the component API close to useState so it is easy to adopt.',
      'Handles JSON parse failures without crashing the app.',
    ],
    files: [
      'src/exercises/local-storage-hook/useLocalStorage.ts',
      'src/exercises/local-storage-hook/TodoList.tsx',
    ],
    examples: [
      {
        label: 'First visit',
        input: 'useLocalStorage("practice.todos", [])',
        output: '[[], setTodos]',
        explanation:
          'No stored value exists, so the hook returns the initial value and the UI starts empty.',
      },
      {
        label: 'Reload after adding an item',
        input: 'localStorage contains [{"id":"1","label":"Read React docs"}]',
        output: '[[{ id: "1", label: "Read React docs" }], setTodos]',
        explanation:
          'The lazy initializer reads storage once and hydrates React state before the first useful render.',
      },
    ],
    foundation: [
      'localStorage is a small synchronous key-value store owned by the browser origin. It stores strings, not JavaScript objects.',
      'Because objects must be serialized, the hook needs JSON.stringify on write and JSON.parse on read.',
      'The hook should feel like useState. If callers can write const [value, setValue] = useLocalStorage(...), they can adopt it without learning a new component pattern.',
      'Reading storage during every render is wasteful and can cause surprising behavior. A lazy useState initializer reads once when React creates the state.',
    ],
    mentalModel: [
      'React state is the source of truth while the page is open. localStorage is the backup copy used to restore state after reload.',
      'The initial read pulls the backup into React. The effect writes React state back out after changes.',
      'Malformed storage is like a corrupted cache: ignore it and fall back rather than crashing the screen.',
    ],
    bruteForce:
      'A brute force implementation calls localStorage.getItem and localStorage.setItem inside every event handler. That solves one component but does not teach reuse, duplicates JSON handling, and makes failure cases easy to forget.',
    optimalApproach: [
      'Return the same tuple shape as useState: value and setter.',
      'Use lazy initialization to read from localStorage once.',
      'If the key is absent, return the initial value.',
      'If parsing fails, return the initial value rather than throwing during render.',
      'Use an effect to write JSON whenever key or value changes.',
    ],
    edgeCases: [
      'The stored value is invalid JSON.',
      'The storage key changes.',
      'The browser blocks storage access.',
      'The value contains Date, Map, Set, or functions that JSON cannot faithfully round-trip.',
      'Another tab changes the same key. This exercise does not require cross-tab synchronization.',
    ],
    interviewQuestions: [
      'Why is localStorage access a side effect?',
      'Why use a lazy initializer instead of reading storage before useState?',
      'What happens if JSON.parse fails?',
      'How would this change for server rendering?',
      'When would you listen for the storage event across tabs?',
    ],
    walkthrough: [
      'Write the hook signature with a generic TValue and a tuple return type.',
      'Inside useState, provide a function initializer that reads localStorage.',
      'Use getItem. If it returns null, return the initial value.',
      'Wrap JSON.parse in try/catch. Bad storage should not crash the app.',
      'Use useEffect to setItem whenever key or value changes.',
      'Return [value, setValue] so the component can keep using functional updates.',
    ],
    complexity: {
      time: 'O(n) to serialize or parse a value of size n whenever it is read or written.',
      space: 'O(n) in React state and O(n) in localStorage for the serialized copy.',
    },
    solutionFiles: [
      {
        path: 'src/exercises/local-storage-hook/useLocalStorage.ts',
        code: String.raw`import { useEffect, useState } from 'react'
import type { Dispatch, SetStateAction } from 'react'

export function useLocalStorage<TValue>(
  key: string,
  initialValue: TValue,
): [TValue, Dispatch<SetStateAction<TValue>>] {
  const [value, setValue] = useState<TValue>(() => {
    try {
      const storedValue = window.localStorage.getItem(key)
      return storedValue === null ? initialValue : (JSON.parse(storedValue) as TValue)
    } catch {
      return initialValue
    }
  })

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // Keep component behavior state-like even if persistence fails.
    }
  }, [key, value])

  return [value, setValue]
}
`,
      },
    ],
    sourceUrl:
      'https://reactpractice.dev/exercise/create-a-custom-hook-that-allows-saving-items-to-the-local-storage/',
    references: [
      ...sharedReferences,
      {
        label: 'MDN: Window.localStorage',
        url: 'https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage',
      },
      {
        label: 'MDN: Web Storage API',
        url: 'https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API',
      },
    ],
  },
  {
    slug: 'shopping-list-persistence',
    title: 'Add local storage persistence to an existing app',
    shortTitle: 'Shopping list',
    topic: 'State persistence in an existing component',
    summary:
      'Enhance an existing shopping list so edits are saved and restored after refresh.',
    brief:
      'The shopping list already lets a user add and remove items. Persist the list to localStorage without changing the visible workflow.',
    acceptance: [
      'Stores the current shopping list whenever items are added or removed.',
      'Restores the saved list after the page reloads.',
      'Does not require cross-tab synchronization.',
      'Keeps the UI responsive while storage updates happen.',
    ],
    files: ['src/exercises/shopping-list/ShoppingList.tsx'],
    examples: [
      {
        label: 'Add then refresh',
        input: 'User adds "Coffee beans" and reloads the page',
        output: 'The list still shows "Coffee beans"',
        explanation:
          'The add action updates React state; the effect mirrors that state to storage; the next page load reads it back.',
      },
      {
        label: 'Remove then refresh',
        input: 'User removes "Coffee beans" and reloads',
        output: 'The item stays removed',
        explanation:
          'Persistence must represent the current list, not only append new items.',
      },
    ],
    foundation: [
      'This is not primarily a custom hook problem. It is a state ownership problem: find the state that represents the user-visible list, then persist exactly that state.',
      'Existing-app tasks are common in interviews because they test whether you can change behavior without rewriting the component.',
      'The important boundary is the storage key. It should be stable, specific to this feature, and not collide with unrelated exercises.',
      'The UI should remain responsive because localStorage writes are small here. For larger data, synchronous storage would become a performance concern.',
    ],
    mentalModel: [
      'Think of the list as a table. Add inserts a row, remove deletes a row, and persistence snapshots the table after each change.',
      'On startup, the component asks storage for a previous snapshot. If none exists, it starts from an empty table.',
      'After startup, React state is authoritative. Storage follows state; event handlers should not each invent separate persistence logic.',
    ],
    bruteForce:
      'The tempting solution is to call localStorage.setItem inside addItem and removeItem. That works, but it couples each event handler to persistence and makes it easier for future state-changing code to forget storage.',
    optimalApproach: [
      'Create a storage key constant outside the component.',
      'Create a helper that reads and parses the saved list, returning [] on missing or invalid data.',
      'Use that helper as the lazy initializer for useState.',
      'Use one effect to write the entire current list whenever items changes.',
      'Leave the add/remove UI flow untouched so the feature remains a persistence enhancement, not a rewrite.',
    ],
    edgeCases: [
      'The saved JSON is malformed.',
      'An old saved shape does not match the current item type.',
      'The list is empty. Should storage contain [] or should the key be removed?',
      'crypto.randomUUID is unavailable in older environments.',
      'Future code adds another way to edit items. A single persistence effect still covers it.',
    ],
    interviewQuestions: [
      'When is a custom hook worth extracting, and when is component-local logic enough?',
      'How would you migrate old storage data if the item shape changes?',
      'What belongs in localStorage versus a backend?',
      'How would you test a reload-driven persistence requirement?',
      'Why is a single effect often better than writing storage in every event handler?',
    ],
    walkthrough: [
      'Identify items as the only state that needs persistence. The input draft should not survive reload.',
      'Write readInitialItems outside the component so the initializer stays readable.',
      'Pass readInitialItems to useState, not readInitialItems(), so React can lazily call it.',
      'Add an effect that writes JSON.stringify(items) to the storage key.',
      'Keep addItem and removeItem focused on state updates. The effect handles persistence afterward.',
    ],
    complexity: {
      time: 'O(n) per write because the whole list is serialized, where n is the number of items.',
      space: 'O(n) for the list in React state and O(n) for the stored JSON.',
    },
    solutionFiles: [
      {
        path: 'src/exercises/shopping-list/ShoppingList.tsx',
        code: String.raw`import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'

type ShoppingItem = {
  id: string
  label: string
}

const storageKey = 'practice.shopping-items'

function readInitialItems() {
  try {
    const storedItems = window.localStorage.getItem(storageKey)
    return storedItems === null ? [] : (JSON.parse(storedItems) as ShoppingItem[])
  } catch {
    return []
  }
}

export function ShoppingList() {
  const [items, setItems] = useState<ShoppingItem[]>(readInitialItems)
  const [draft, setDraft] = useState('')

  useEffect(() => {
    window.localStorage.setItem(storageKey, JSON.stringify(items))
  }, [items])

  const addItem = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const label = draft.trim()

    if (!label) {
      return
    }

    setItems((current) => [
      ...current,
      {
        id: crypto.randomUUID(),
        label,
      },
    ])
    setDraft('')
  }

  const removeItem = (id: string) => {
    setItems((current) => current.filter((item) => item.id !== id))
  }

  return (
    <div className="demo-surface" data-testid="shopping-list-demo">
      <div className="demo-copy">
        <h3>Shopping list</h3>
        <p>
          This existing app intentionally loses data on refresh. Add localStorage
          persistence while keeping the interaction the same.
        </p>
      </div>
      <form className="inline-form" onSubmit={addItem}>
        <label htmlFor="shopping-item">Shopping item</label>
        <input
          id="shopping-item"
          name="item"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="Coffee beans"
        />
        <button type="submit">Add item</button>
      </form>
      {items.length > 0 ? (
        <ul className="interactive-list" aria-label="Shopping items">
          {items.map((item) => (
            <li key={item.id}>
              <span>{item.label}</span>
              <button type="button" onClick={() => removeItem(item.id)}>
                Remove
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="empty-state">No shopping items yet.</p>
      )}
    </div>
  )
}
`,
      },
    ],
    sourceUrl:
      'https://reactpractice.dev/exercise/add-persistence-to-local-storage-for-an-existing-app/',
    references: [
      ...sharedReferences,
      {
        label: 'MDN: Window.localStorage',
        url: 'https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage',
      },
      {
        label: 'MDN: Web Storage API',
        url: 'https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API',
      },
    ],
  },
  {
    slug: 'typewriter',
    title: 'Build a Typewriter effect component',
    shortTitle: 'Typewriter',
    topic: 'Timers and effect cleanup',
    summary:
      'Render a sentence one character at a time with a half-second delay between characters.',
    brief:
      'Given a sentence from a form, show nothing at first and then reveal each character in order until the full sentence is visible.',
    acceptance: [
      'Starts with an empty output after the user submits a sentence.',
      'Adds one character every 500 milliseconds.',
      'Stops scheduling work after the full sentence is shown.',
      'Resets correctly when the user submits a new sentence.',
      'Cleans up timers when the component unmounts or the sentence changes.',
    ],
    files: [
      'src/exercises/typewriter/TypewriterEffect.tsx',
      'src/exercises/typewriter/TypewriterPractice.tsx',
    ],
    examples: [
      {
        label: 'Single word',
        input: 'sentence = "React"',
        output: '"" -> "R" -> "Re" -> "Rea" -> "Reac" -> "React"',
        explanation:
          'The displayed text starts empty and grows by one character every 500ms.',
      },
      {
        label: 'New sentence before old one completes',
        input: 'User submits "Hooks" while "React" is still typing',
        output: 'The output resets, then types "Hooks"',
        explanation:
          'A sentence change invalidates the old timer chain. Cleanup prevents duplicate typing.',
      },
    ],
    foundation: [
      'A timer is an external system. It keeps running even if React re-renders, so React needs explicit cleanup to avoid duplicate scheduled work.',
      'The displayed substring is state because it changes over time. The full sentence is input because it is supplied by the parent component.',
      'The effect should describe one step of progress: if more characters remain, schedule one update. After the update, React re-renders and the effect schedules the next step.',
      'React Strict Mode may run setup and cleanup more than once in development. Correct cleanup makes that harmless.',
    ],
    mentalModel: [
      'This is a controlled animation state machine. The state is the number of characters currently shown.',
      'The invariant is: displayedText is always a prefix of sentence.',
      'When displayedText.length equals sentence.length, the machine is complete and no more timers should be scheduled.',
    ],
    bruteForce:
      'A quick setInterval solution can work for a demo, but it often forgets to clear the interval, captures stale indexes, or continues running after the sentence changes. Recursive setTimeout or an effect-per-character approach is easier to reason about.',
    optimalApproach: [
      'Keep displayedText in local state.',
      'Reset displayedText to an empty string whenever sentence changes.',
      'Use an effect that checks whether more characters remain.',
      'Schedule one timeout to reveal the next prefix.',
      'Clear the timeout in cleanup so old scheduled work cannot update the new sentence.',
    ],
    edgeCases: [
      'The sentence is empty.',
      'A new sentence is submitted before the old one finishes typing.',
      'The component unmounts while a timeout is pending.',
      'The typing speed changes while text is in progress.',
      'The sentence contains spaces or punctuation. The prefix logic should preserve them.',
    ],
    interviewQuestions: [
      'Would you use setInterval or recursive setTimeout, and why?',
      'How does effect cleanup prevent duplicate timers in React Strict Mode?',
      'What state should be derived from props, and what should be stored?',
      'How would you make the typing speed configurable without breaking tests?',
      'Why is displayedText.length enough to know the next character?',
    ],
    walkthrough: [
      'Store displayedText with useState("").',
      'When sentence changes, reset displayedText to empty so the animation starts over.',
      'In a second effect, return early if displayedText is already the full sentence.',
      'Schedule a timeout for delayMs that sets displayedText to sentence.slice(0, displayedText.length + 1).',
      'Return cleanup that clears the timeout.',
      'Render displayedText inside the output element used by the tests.',
    ],
    complexity: {
      time: 'O(n) updates for a sentence of length n. Each update creates the next prefix.',
      space: 'O(n) for the displayed string.',
    },
    solutionFiles: [
      {
        path: 'src/exercises/typewriter/TypewriterEffect.tsx',
        code: String.raw`import { useEffect, useState } from 'react'

type TypewriterEffectProps = {
  sentence: string
  delayMs?: number
}

export function TypewriterEffect({
  sentence,
  delayMs = 500,
}: TypewriterEffectProps) {
  const [displayedText, setDisplayedText] = useState('')

  useEffect(() => {
    setDisplayedText('')
  }, [sentence])

  useEffect(() => {
    if (displayedText.length >= sentence.length) {
      return
    }

    const timeoutId = window.setTimeout(() => {
      setDisplayedText(sentence.slice(0, displayedText.length + 1))
    }, delayMs)

    return () => window.clearTimeout(timeoutId)
  }, [delayMs, displayedText, sentence])

  return (
    <output className="typewriter-output" data-testid="typewriter-output">
      {displayedText}
    </output>
  )
}
`,
      },
    ],
    sourceUrl: 'https://reactpractice.dev/exercise/build-a-typewriter-effect-component/',
    references: [
      ...sharedReferences,
      {
        label: 'MDN: Window.setTimeout',
        url: 'https://developer.mozilla.org/en-US/docs/Web/API/Window/setTimeout',
      },
      {
        label: 'MDN: Window.setInterval',
        url: 'https://developer.mozilla.org/en-US/docs/Web/API/Window/setInterval',
      },
    ],
  },
]
