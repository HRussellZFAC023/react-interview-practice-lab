import { expect, test } from '@playwright/test'

test('root opens directly to the first lesson', async ({ page }) => {
  await page.goto('/')

  await expect(page.getByTestId('challenge-page')).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Build a custom useFetch hook' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Foundation' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Score your answer' })).toBeVisible()
  await expect(page.getByText('Recommended time and space complexity')).toBeVisible()
})

test('each exercise page has a prompt, starter canvas, and hidden walkthrough', async ({
  page,
}) => {
  await page.goto('/#/challenge/use-fetch')

  await expect(page.getByTestId('challenge-page')).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Build a custom useFetch hook' })).toBeVisible()
  await expect(
    page.locator('.file-list code').filter({
      hasText: 'src/exercises/use-fetch/useFetch.ts',
    }),
  ).toBeVisible()
  await expect(page.getByTestId('use-fetch-demo')).toBeVisible()
  await expect(page.getByRole('heading', { name: 'What the tests check' })).toBeVisible()

  const walkthrough = page.getByText('Start by writing the return type')
  await expect(walkthrough).not.toBeVisible()
  await page.getByText('Hints').click()
  await expect(walkthrough).toBeVisible()
  await expect(page.getByText('Show full solution')).toBeVisible()
})

test('next and previous controls move between exercises', async ({ page }) => {
  await page.goto('/#/challenge/use-fetch')

  await page.getByRole('button', { name: /Next: Storage hook/ }).click()
  await expect(page.getByRole('heading', { name: 'Create a custom hook for local storage' })).toBeVisible()

  await page.getByRole('button', { name: /Previous: useFetch/ }).click()
  await expect(page.getByRole('heading', { name: 'Build a custom useFetch hook' })).toBeVisible()
})
