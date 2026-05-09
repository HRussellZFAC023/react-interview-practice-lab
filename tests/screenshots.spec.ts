import { test } from '@playwright/test'

const pages = [
  ['landing', '/'],
  ['use-fetch', '/#/challenge/use-fetch'],
  ['local-storage-hook', '/#/challenge/local-storage-hook'],
  ['shopping-list', '/#/challenge/shopping-list-persistence'],
  ['typewriter', '/#/challenge/typewriter'],
] as const

for (const [name, path] of pages) {
  test(`capture ${name} page`, async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1100 })
    await page.goto(path)
    await page.screenshot({
      fullPage: true,
      path: `docs/screenshots/${name}.png`,
    })
  })
}

test('capture mobile landing', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 920 })
  await page.goto('/')
  await page.screenshot({
    fullPage: true,
    path: 'docs/screenshots/mobile-landing.png',
  })
})
