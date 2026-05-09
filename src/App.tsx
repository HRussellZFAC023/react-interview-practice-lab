import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import './App.css'
import { challenges } from './data/challenges'
import { TodoList } from './exercises/local-storage-hook/TodoList'
import { ShoppingList } from './exercises/shopping-list/ShoppingList'
import { TypewriterPractice } from './exercises/typewriter/TypewriterPractice'
import { PokemonList } from './exercises/use-fetch/PokemonList'

const exerciseCanvas = {
  'use-fetch': <PokemonList />,
  'local-storage-hook': <TodoList />,
  'shopping-list-persistence': <ShoppingList />,
  typewriter: <TypewriterPractice />,
} satisfies Record<string, ReactNode>

const getSlugFromHash = () => {
  const match = window.location.hash.match(/^#\/challenge\/([a-z0-9-]+)/)
  return match?.[1] ?? challenges[0].slug
}

function App() {
  const [activeSlug, setActiveSlug] = useState(getSlugFromHash)

  useEffect(() => {
    const syncRoute = () => setActiveSlug(getSlugFromHash())

    window.addEventListener('hashchange', syncRoute)
    window.addEventListener('popstate', syncRoute)
    return () => {
      window.removeEventListener('hashchange', syncRoute)
      window.removeEventListener('popstate', syncRoute)
    }
  }, [])

  const activeIndex = Math.max(
    0,
    challenges.findIndex((challenge) => challenge.slug === activeSlug),
  )
  const active = challenges[activeIndex]
  const previous = challenges[(activeIndex - 1 + challenges.length) % challenges.length]
  const next = challenges[(activeIndex + 1) % challenges.length]

  const goToChallenge = (slug: string) => {
    window.history.pushState(null, '', `#/challenge/${slug}`)
    setActiveSlug(slug)
    window.scrollTo({ top: 0 })
  }

  return (
    <main className="workbook">
      <header className="workbook-header">
        <div>
          <p>React Interview Workbook</p>
          <strong>Four practice problems. Learn the reasoning, then write the code.</strong>
        </div>
        <nav aria-label="Quick links">
          <a href="https://github.com/HRussellZFAC023/react-interview-practice-lab">Repository</a>
          <a href="https://reactpractice.dev/">Original prompts</a>
        </nav>
      </header>

      <div className="study-grid">
        <aside className="lesson-map" aria-label="Lessons">
          <p className="section-label">Lessons</p>
          {challenges.map((challenge, index) => (
            <button
              className={challenge.slug === active.slug ? 'active' : ''}
              key={challenge.slug}
              type="button"
              onClick={() => goToChallenge(challenge.slug)}
            >
              <span>{String(index + 1).padStart(2, '0')}</span>
              <strong>{challenge.shortTitle}</strong>
              <small>{challenge.topic}</small>
            </button>
          ))}
        </aside>

        <article className="lesson-panel" data-testid="challenge-page">
          <header className="lesson-hero">
            <p className="section-label">Lesson {activeIndex + 1} / {challenges.length}</p>
            <h1>{active.title}</h1>
            <p>{active.brief}</p>
          </header>

          <section className="chapter">
            <h2>Problem statement</h2>
            <p>{active.summary}</p>
            <div className="checklist">
              {active.acceptance.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
          </section>

          <section className="chapter">
            <h2>Examples</h2>
            <div className="example-grid">
              {active.examples.map((example) => (
                <figure className="example-card" key={example.label}>
                  <figcaption>{example.label}</figcaption>
                  <pre>{`Input:  ${example.input}\nOutput: ${example.output}`}</pre>
                  <p>{example.explanation}</p>
                </figure>
              ))}
            </div>
          </section>

          <section className="chapter">
            <h2>Foundation</h2>
            {active.foundation.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            <div className="note-box">
              <strong>Mental model</strong>
              <ul>
                {active.mentalModel.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </section>

          <section className="chapter">
            <h2>Reasoning path</h2>
            <div className="two-column">
              <div>
                <h3>Brute force</h3>
                <p>{active.bruteForce}</p>
              </div>
              <div>
                <h3>Recommended approach</h3>
                <ol>
                  {active.optimalApproach.map((step) => (
                    <li key={step}>{step}</li>
                  ))}
                </ol>
              </div>
            </div>
          </section>

          <section className="chapter">
            <h2>Edge cases and complexity</h2>
            <div className="two-column">
              <div>
                <h3>Edge cases</h3>
                <ul>
                  {active.edgeCases.map((edgeCase) => (
                    <li key={edgeCase}>{edgeCase}</li>
                  ))}
                </ul>
              </div>
              <div className="complexity-box">
                <h3>Recommended time and space complexity</h3>
                <dl>
                  <dt>Time</dt>
                  <dd>{active.complexity.time}</dd>
                  <dt>Space</dt>
                  <dd>{active.complexity.space}</dd>
                </dl>
              </div>
            </div>
          </section>

          <section className="chapter">
            <h2>Interviewer follow-ups</h2>
            <ul className="question-list">
              {active.interviewQuestions.map((question) => (
                <li key={question}>{question}</li>
              ))}
            </ul>
          </section>

          <section className="exercise-zone">
            <div className="exercise-intro">
              <div>
                <p className="section-label">Now code</p>
                <h2>Exercise workspace</h2>
              </div>
              <code>npm run test:submission</code>
            </div>
            {exerciseCanvas[active.slug as keyof typeof exerciseCanvas]}
            <details className="reveal">
              <summary>Hints</summary>
              <ol>
                {active.walkthrough.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
            </details>
            <details className="reveal solution">
              <summary>Show full solution</summary>
              <p>Use this after you have made a real attempt. The starter files are still intentionally unsolved.</p>
              {active.solutionFiles.map((file) => (
                <section key={file.path}>
                  <h3>{file.path}</h3>
                  <pre><code>{file.code}</code></pre>
                </section>
              ))}
            </details>
          </section>

          <footer className="lesson-nav">
            <button type="button" onClick={() => goToChallenge(previous.slug)}>
              Previous: {previous.shortTitle}
            </button>
            <button type="button" onClick={() => goToChallenge(next.slug)}>
              Next: {next.shortTitle}
            </button>
          </footer>
        </article>

        <aside className="practice-sidebar">
          <section>
            <p className="section-label">Edit these files</p>
            <ul className="file-list">
              {active.files.map((file) => (
                <li key={file}><code>{file}</code></li>
              ))}
            </ul>
          </section>
          <section>
            <p className="section-label">Run</p>
            <pre>{`npm install\nnpm run dev\nnpm run test:submission`}</pre>
          </section>
          <section>
            <p className="section-label">References</p>
            <ul className="reference-list">
              {active.references.map((reference) => (
                <li key={reference.url}>
                  <a href={reference.url} target="_blank" rel="noreferrer">{reference.label}</a>
                </li>
              ))}
            </ul>
          </section>
        </aside>
      </div>
    </main>
  )
}

export default App
