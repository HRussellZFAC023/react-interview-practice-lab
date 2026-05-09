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

  test('local storage hook preserves todos after reload', async ({ page }) => {
    await page.goto('/#/challenge/local-storage-hook')

    await page.getByLabel('Todo item').fill('Explain lazy initial state')
    await page.getByRole('button', { name: 'Add item' }).click()
    await expect(page.getByText('Explain lazy initial state')).toBeVisible()

    await page.reload()
    await expect(page.getByText('Explain lazy initial state')).toBeVisible()
  })

  test('shopping list persists items after reload', async ({ page }) => {
    await page.goto('/#/challenge/shopping-list-persistence')

    await page.getByLabel('Shopping item').fill('Coffee beans')
    await page.getByRole('button', { name: 'Add item' }).click()
    await expect(page.getByText('Coffee beans')).toBeVisible()

    await page.reload()
    await expect(page.getByText('Coffee beans')).toBeVisible()
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
})
