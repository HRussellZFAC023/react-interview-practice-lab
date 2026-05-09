import { useState } from 'react'
import type { FormEvent } from 'react'
import { useLocalStorage } from './useLocalStorage'

type Todo = {
  id: string
  label: string
}

export function TodoList() {
  const [todos, setTodos] = useLocalStorage<Todo[]>('practice.todos', [])
  const [draft, setDraft] = useState('')

  const addTodo = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const label = draft.trim()

    if (!label) {
      return
    }

    setTodos((current) => [
      ...current,
      {
        id: crypto.randomUUID(),
        label,
      },
    ])
    setDraft('')
  }

  const removeTodo = (id: string) => {
    setTodos((current) => current.filter((todo) => todo.id !== id))
  }

  return (
    <div className="demo-surface" data-testid="local-storage-hook-demo">
      <div className="demo-copy">
        <h3>Todo list</h3>
        <p>
          The UI works, but the custom hook currently behaves like useState.
          Persist it without changing this component much.
        </p>
      </div>
      <form className="inline-form" onSubmit={addTodo}>
        <label htmlFor="todo-item">Todo item</label>
        <input
          id="todo-item"
          name="todo"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="Read React docs"
        />
        <button type="submit">Add item</button>
      </form>
      {todos.length > 0 ? (
        <ul className="interactive-list" aria-label="Todo items">
          {todos.map((todo) => (
            <li key={todo.id}>
              <span>{todo.label}</span>
              <button type="button" onClick={() => removeTodo(todo.id)}>
                Remove
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="empty-state">Add a todo, refresh, and make it survive.</p>
      )}
    </div>
  )
}
