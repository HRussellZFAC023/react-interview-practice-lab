import { useState } from 'react'
import type { FormEvent } from 'react'

type ShoppingItem = {
  id: string
  label: string
}

export function ShoppingList() {
  const [items, setItems] = useState<ShoppingItem[]>([])
  const [draft, setDraft] = useState('')

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
