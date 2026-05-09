import { expect, test } from '@playwright/test'

test('landing page explains the practice lab', async ({ page }) => {
  await page.goto('/')

  await expect(page.getByTestId('landing')).toBeVisible()
  await expect(page.getByRole('heading', { level: 1 })).toContainText(
    'Four React exercises',
  )
  await expect(page.getByRole('button', { name: 'Start first exercise' })).toBeVisible()
  await expect(page.getByText('npm run test:submission')).toBeVisible()
})

test('each exercise page has a prompt, starter canvas, and hidden walkthrough', async ({
  page,
}) => {
  await page.goto('/#/challenge/use-fetch')

  await expect(page.getByTestId('challenge-page')).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Build a custom useFetch hook' })).toBeVisible()
  await expect(
    page.getByText('src/exercises/use-fetch/useFetch.ts', { exact: true }),
  ).toBeVisible()
  await expect(page.getByTestId('use-fetch-demo')).toBeVisible()

  const walkthrough = page.getByText('Define the generic return type before writing')
  await expect(walkthrough).not.toBeVisible()
  await page.getByText('Reveal guided walkthrough').click()
  await expect(walkthrough).toBeVisible()
})

test('next and previous controls move between exercises', async ({ page }) => {
  await page.goto('/#/challenge/use-fetch')

  await page.getByRole('button', { name: /Next: Storage hook/ }).click()
  await expect(page.getByRole('heading', { name: 'Create a custom hook for local storage' })).toBeVisible()

  await page.getByRole('button', { name: /Previous: useFetch/ }).click()
  await expect(page.getByRole('heading', { name: 'Build a custom useFetch hook' })).toBeVisible()
})
