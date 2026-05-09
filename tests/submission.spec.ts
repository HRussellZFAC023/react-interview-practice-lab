import { expect, test } from '@playwright/test'

test.describe('submission checks', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.evaluate(() => window.localStorage.clear())
  })

  test('useFetch loads data from the mocked Pokemon API', async ({ page }) => {
    await page.route('https://pokeapi.co/api/v2/pokemon?**', async (route) => {
      await route.fulfill({
        contentType: 'application/json',
        body: JSON.stringify({
          results: [{ name: 'bulbasaur' }, { name: 'ivysaur' }, { name: 'venusaur' }],
        }),
      })
    })

    await page.goto('/#/challenge/use-fetch')

    await expect(page.getByRole('list', { name: 'Pokemon results' })).toContainText(
      'bulbasaur',
    )
    await expect(page.getByRole('alert')).toHaveCount(0)
  })

  test('useFetch reports non-OK HTTP responses as errors', async ({ page }) => {
    await page.route('https://pokeapi.co/api/v2/pokemon?**', async (route) => {
      await route.fulfill({
        status: 503,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'Service unavailable' }),
      })
    })

    await page.goto('/#/challenge/use-fetch')

    await expect(page.getByRole('alert')).toContainText('503')
    await expect(page.getByRole('list', { name: 'Pokemon results' })).toHaveCount(0)
  })

  test('local storage hook preserves todos after reload', async ({ page }) => {
    await page.goto('/#/challenge/local-storage-hook')
    const demo = page.getByTestId('local-storage-hook-demo')

    await page.getByLabel('Todo item').fill('Explain lazy initial state')
    await page.getByRole('button', { name: 'Add item' }).click()
    await expect(demo.getByText('Explain lazy initial state')).toBeVisible()

    await page.reload()
    await expect(demo.getByText('Explain lazy initial state')).toBeVisible()
  })

  test('local storage hook falls back when saved JSON is invalid', async ({ page }) => {
    await page.evaluate(() => {
      window.localStorage.setItem('practice.todos', 'not valid json')
    })

    await page.goto('/#/challenge/local-storage-hook')

    await expect(
      page.getByTestId('local-storage-hook-demo').getByText('Add a todo, refresh, and make it survive.'),
    ).toBeVisible()
  })

  test('shopping list persists items after reload', async ({ page }) => {
    await page.goto('/#/challenge/shopping-list-persistence')
    const demo = page.getByTestId('shopping-list-demo')

    await page.getByLabel('Shopping item').fill('Coffee beans')
    await page.getByRole('button', { name: 'Add item' }).click()
    await expect(demo.getByText('Coffee beans')).toBeVisible()

    await page.reload()
    await expect(demo.getByText('Coffee beans')).toBeVisible()
  })

  test('shopping list persists removals after reload', async ({ page }) => {
    await page.goto('/#/challenge/shopping-list-persistence')
    const demo = page.getByTestId('shopping-list-demo')

    await page.getByLabel('Shopping item').fill('Tea bags')
    await page.getByRole('button', { name: 'Add item' }).click()
    await expect(demo.getByText('Tea bags')).toBeVisible()

    await page.getByRole('button', { name: 'Remove' }).click()
    await page.reload()

    await expect(demo.getByText('Tea bags')).toHaveCount(0)
    await expect(demo.getByText('No shopping items yet.')).toBeVisible()
  })

  test('typewriter reveals one character every half second', async ({ page }) => {
    await page.goto('/#/challenge/typewriter')

    await page.getByLabel('Sentence').fill('React')
    await page.getByRole('button', { name: 'Start typing' }).click()

    const output = page.getByTestId('typewriter-output')
    await expect(output).toHaveText('')
    await expect(output).toHaveText('R', { timeout: 700 })
    await expect(output).not.toHaveText('React')
    await expect(output).toHaveText('React', { timeout: 2600 })
  })

  test('typewriter resets when a new sentence starts', async ({ page }) => {
    await page.goto('/#/challenge/typewriter')

    await page.getByLabel('Sentence').fill('React')
    await page.getByRole('button', { name: 'Start typing' }).click()

    const output = page.getByTestId('typewriter-output')
    await expect(output).toHaveText('R', { timeout: 700 })

    await page.getByLabel('Sentence').fill('Hooks')
    await page.getByRole('button', { name: 'Start typing' }).click()

    await expect(output).toHaveText('')
    await expect(output).toHaveText('H', { timeout: 700 })
    await expect(output).not.toHaveText('React')
  })
})
