type Reference = {
  label: string
  url: string
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
  interviewQuestions: string[]
  walkthrough: string[]
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
    topic: 'Custom hooks',
    summary:
      'Create a typed hook that wraps fetch, exposes data/loading/error state, and accepts request options.',
    brief:
      'Build a reusable data-fetching hook for components that need a consistent loading, error, and data shape. It should work with GET and non-GET requests, and should support request options such as headers.',
    acceptance: [
      'Returns parsed response data through a stable result shape.',
      'Reports loading state while the request is in flight.',
      'Reports a useful error state for rejected or non-OK responses.',
      'Accepts the standard RequestInit options object for headers and HTTP methods.',
      'Avoids updating state after the component unmounts.',
    ],
    files: [
      'src/exercises/use-fetch/useFetch.ts',
      'src/exercises/use-fetch/PokemonList.tsx',
    ],
    interviewQuestions: [
      'How would you prevent race conditions when the URL changes quickly?',
      'Should a hook throw, return an error string, or expose the original Error object?',
      'How would you test loading state without relying on a real network?',
      'Where would AbortController fit into the cleanup path?',
    ],
    walkthrough: [
      'Define the generic return type before writing any effect logic.',
      'Initialize loading and error state in a way that makes the first render predictable.',
      'Start the request inside an effect and include the reactive inputs in the dependency list.',
      'Parse the response only after checking status, then update data and loading state.',
      'Return a cleanup function that cancels the request or ignores stale responses.',
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
    topic: 'Custom hooks',
    summary:
      'Extract localStorage persistence into a hook that can keep a todo list across reloads.',
    brief:
      'Start from a working todo list. Your job is to preserve the list between browser sessions by moving the storage reads and writes into a custom hook.',
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
    interviewQuestions: [
      'Why is localStorage access a side effect?',
      'What happens if JSON.parse fails?',
      'How would this change for server rendering?',
      'When would you listen for the storage event across tabs?',
    ],
    walkthrough: [
      'Design the hook signature so a component can treat it like useState.',
      'Use a lazy initial state function to read storage once on mount.',
      'Serialize values with JSON.stringify before writing.',
      'Keep storage writes in an effect tied to the key and value.',
      'Decide how the hook should behave when storage is unavailable or malformed.',
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
    topic: 'Local storage',
    summary:
      'Enhance an existing shopping list so edits are saved and restored after refresh.',
    brief:
      'The shopping list already lets a user add and remove items. Improve it by persisting the list to localStorage without changing the visible workflow.',
    acceptance: [
      'Stores the current shopping list whenever items are added or removed.',
      'Restores the saved list after the page reloads.',
      'Does not require cross-tab synchronization.',
      'Keeps the UI responsive while storage updates happen.',
    ],
    files: ['src/exercises/shopping-list/ShoppingList.tsx'],
    interviewQuestions: [
      'When is a custom hook worth extracting, and when is component-local logic enough?',
      'How would you migrate old storage data if the item shape changes?',
      'What belongs in localStorage versus a backend?',
      'How would you test a reload-driven persistence requirement?',
    ],
    walkthrough: [
      'Identify the state that must survive reloads.',
      'Load that state from localStorage before the first useful render.',
      'Write the updated list after add and remove actions.',
      'Keep the storage key stable and scoped to this exercise.',
      'Add a test that proves a full page reload still shows the saved items.',
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
    topic: 'Timers',
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
    interviewQuestions: [
      'Would you use setInterval or recursive setTimeout, and why?',
      'How does effect cleanup prevent duplicate timers in React Strict Mode?',
      'What state should be derived from props, and what should be stored?',
      'How would you make the typing speed configurable without breaking tests?',
    ],
    walkthrough: [
      'Track the displayed substring separately from the full sentence prop.',
      'Reset the displayed text whenever a new sentence is submitted.',
      'Schedule the next character from an effect that can clean itself up.',
      'Stop scheduling once the displayed length matches the target sentence.',
      'Keep timer IDs out of rendered output and clear them during cleanup.',
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
