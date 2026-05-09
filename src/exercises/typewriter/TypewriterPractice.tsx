import { useState } from 'react'
import type { FormEvent } from 'react'
import { TypewriterEffect } from './TypewriterEffect'

export function TypewriterPractice() {
  const [draft, setDraft] = useState('React interviews reward clear effects.')
  const [sentence, setSentence] = useState('')

  const startTyping = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSentence(draft)
  }

  return (
    <div className="demo-surface" data-testid="typewriter-demo">
      <div className="demo-copy">
        <h3>Typewriter effect</h3>
        <p>
          The component currently renders the full sentence immediately. Replace
          that with one-character-at-a-time rendering.
        </p>
      </div>
      <form className="inline-form" onSubmit={startTyping}>
        <label htmlFor="typewriter-sentence">Sentence</label>
        <input
          id="typewriter-sentence"
          name="sentence"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
        />
        <button type="submit">Start typing</button>
      </form>
      <TypewriterEffect sentence={sentence} />
    </div>
  )
}
