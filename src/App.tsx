import { useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import './App.css'
import { challenges } from './data/challenges'
import { PokemonList } from './exercises/use-fetch/PokemonList'
import { TodoList } from './exercises/local-storage-hook/TodoList'
import { ShoppingList } from './exercises/shopping-list/ShoppingList'
import { TypewriterPractice } from './exercises/typewriter/TypewriterPractice'

const getSlugFromHash = () => {
  const match = window.location.hash.match(/^#\/challenge\/([a-z0-9-]+)/)
  return match?.[1] ?? challenges[0].slug
}

const getInitialView = () => {
  if (window.location.hash.startsWith('#/challenge/')) {
    return 'challenge'
  }
  return 'home'
}

const exerciseCanvas = {
  'use-fetch': <PokemonList />,
  'local-storage-hook': <TodoList />,
  'shopping-list-persistence': <ShoppingList />,
  typewriter: <TypewriterPractice />,
} satisfies Record<string, ReactNode>

function App() {
  const [view, setView] = useState(getInitialView)
  const [activeSlug, setActiveSlug] = useState(getSlugFromHash)

  useEffect(() => {
    const onHashChange = () => {
      setView(getInitialView())
      setActiveSlug(getSlugFromHash())
    }

    window.addEventListener('hashchange', onHashChange)
    window.addEventListener('popstate', onHashChange)
    return () => {
      window.removeEventListener('hashchange', onHashChange)
      window.removeEventListener('popstate', onHashChange)
    }
  }, [])

  const activeIndex = Math.max(
    0,
    challenges.findIndex((challenge) => challenge.slug === activeSlug),
  )
  const active = challenges[activeIndex]
  const previous = challenges[(activeIndex - 1 + challenges.length) % challenges.length]
  const next = challenges[(activeIndex + 1) % challenges.length]

  const progressLabel = useMemo(
    () => `${activeIndex + 1} of ${challenges.length}`,
    [activeIndex],
  )

  const goHome = () => {
    window.history.pushState(null, '', '#/')
    setView('home')
    window.scrollTo({ top: 0 })
  }

  const goToChallenge = (slug: string) => {
    window.history.pushState(null, '', `#/challenge/${slug}`)
    setView('challenge')
    setActiveSlug(slug)
    window.scrollTo({ top: 0 })
  }

  const showReferences = () => {
    const slug = view === 'challenge' ? active.slug : challenges[0].slug

    window.history.pushState(null, '', `#/challenge/${slug}`)
    setView('challenge')
    setActiveSlug(slug)
    window.setTimeout(() => {
      document.getElementById('references')?.scrollIntoView({ block: 'start' })
    }, 0)
  }

  return (
    <main>
      <header className="topbar">
        <button className="brand" type="button" onClick={goHome}>
          React Interview Practice Lab
        </button>
        <nav aria-label="Primary">
          <a href="#/">Home</a>
          <a href="#/challenge/use-fetch">Exercises</a>
          <button className="nav-button" type="button" onClick={showReferences}>
            References
          </button>
        </nav>
      </header>

      {view === 'home' ? (
        <>
          <section className="landing" data-testid="landing">
            <div className="landing-copy">
              <p className="eyebrow">Interview practice repo</p>
              <h1>Four React exercises, one clean practice loop.</h1>
              <p className="lede">
                Clone once and move through the behaviors interviewers actually probe:
                custom hook design, fetch state, localStorage persistence, and timer
                cleanup. Each exercise has a starter canvas, acceptance checks, and a
                submission test.
              </p>
              <div className="landing-actions">
                <button type="button" onClick={() => goToChallenge(challenges[0].slug)}>
                  Start first exercise
                </button>
                <a href="#how">How it works</a>
              </div>
            </div>
            <aside className="session-card" aria-label="Practice loop">
              <span>Practice loop</span>
              <ol>
                <li>
                  <strong>Read</strong>
                  <small>Prompt and acceptance checks</small>
                </li>
                <li>
                  <strong>Build</strong>
                  <small>Only in the listed starter files</small>
                </li>
                <li>
                  <strong>Check</strong>
                  <code>npm run test:submission</code>
                </li>
              </ol>
            </aside>
          </section>

          <section className="band" id="why">
            <div className="section-heading">
              <p className="eyebrow">What and why</p>
              <h2>A focused prep loop for React interviews</h2>
            </div>
            <div className="copy-grid">
              <p>
                Interview prompts rarely fail because the component is big. They fail when
                async state, effect cleanup, browser persistence, and time-based rendering
                are rushed under pressure. These exercises isolate those skills.
              </p>
              <p>
                The repo is intentionally compact. You get one React app, one set of scripts,
                one test runner, and starter files that mark exactly where your work should go.
              </p>
            </div>
          </section>

          <section className="challenge-grid" aria-label="Exercise list">
            {challenges.map((challenge, index) => (
              <article className="challenge-card" key={challenge.slug}>
                <div className="card-meta">
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <span>{challenge.topic}</span>
                </div>
                <h3>{challenge.title}</h3>
                <p>{challenge.summary}</p>
                <button type="button" onClick={() => goToChallenge(challenge.slug)}>
                  Open exercise
                </button>
              </article>
            ))}
          </section>

          <section className="band" id="how">
            <div className="section-heading">
              <p className="eyebrow">How</p>
              <h2>Use the same rhythm each time</h2>
            </div>
            <ol className="steps">
              <li>Read the prompt and acceptance checks before touching code.</li>
              <li>Open the starter file listed on the exercise page.</li>
              <li>Make the smallest implementation that satisfies the behavior.</li>
              <li>Run the Playwright submission checks and explain the tradeoffs out loud.</li>
            </ol>
          </section>
        </>
      ) : (
        <section className="exercise-layout" data-testid="challenge-page">
          <aside className="exercise-rail">
            <p className="eyebrow">Exercises</p>
            {challenges.map((challenge, index) => (
              <button
                className={challenge.slug === active.slug ? 'active' : ''}
                key={challenge.slug}
                type="button"
                onClick={() => goToChallenge(challenge.slug)}
              >
                <span>{index + 1}</span>
                {challenge.shortTitle}
              </button>
            ))}
          </aside>

          <article className="exercise-page">
            <div className="exercise-header">
              <div>
                <p className="eyebrow">{progressLabel} / {active.topic}</p>
                <h1>{active.title}</h1>
                <p className="lede">{active.summary}</p>
              </div>
              <a className="source-link" href={active.sourceUrl} target="_blank" rel="noreferrer">
                Open original prompt
              </a>
            </div>

            <div className="pager" aria-label="Exercise navigation">
              <button type="button" onClick={() => goToChallenge(previous.slug)}>
                Previous: {previous.shortTitle}
              </button>
              <button type="button" onClick={() => goToChallenge(next.slug)}>
                Next: {next.shortTitle}
              </button>
            </div>

            <section className="brief">
              <div>
                <h2>Prompt</h2>
                <p>{active.brief}</p>
              </div>
              <div>
                <h2>Acceptance checks</h2>
                <ul>
                  {active.acceptance.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h2>Work here</h2>
                <ul>
                  {active.files.map((file) => (
                    <li key={file}><code>{file}</code></li>
                  ))}
                </ul>
              </div>
            </section>

            <section className="practice-panel" aria-label={`${active.shortTitle} practice canvas`}>
              <div className="panel-heading">
                <p className="eyebrow">Starter canvas</p>
                <h2>Run it, then make it pass</h2>
              </div>
              {exerciseCanvas[active.slug as keyof typeof exerciseCanvas]}
            </section>

            <section className="learning-panel">
              <div>
                <h2>Interview angles</h2>
                <ul>
                  {active.interviewQuestions.map((question) => (
                    <li key={question}>{question}</li>
                  ))}
                </ul>
              </div>
              <details>
                <summary>Reveal guided walkthrough</summary>
                <ol>
                  {active.walkthrough.map((step) => (
                    <li key={step}>{step}</li>
                  ))}
                </ol>
                <p className="note">
                  This walkthrough is deliberately code-free. The starter files still need
                  your implementation.
                </p>
              </details>
            </section>

            <section className="references" id="references">
              <h2>Sources worth reading</h2>
              <ul>
                {active.references.map((reference) => (
                  <li key={reference.url}>
                    <a href={reference.url} target="_blank" rel="noreferrer">{reference.label}</a>
                  </li>
                ))}
              </ul>
            </section>
          </article>
        </section>
      )}

      <footer>
        <span>Built for interview practice. Original exercise inspiration by React Practice.</span>
        <a href="https://reactpractice.dev/" target="_blank" rel="noreferrer">reactpractice.dev</a>
      </footer>
    </main>
  )
}

export default App
