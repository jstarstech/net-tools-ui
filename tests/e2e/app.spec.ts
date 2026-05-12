import { expect, test } from '@playwright/test'

test('clicking an IP result confirms and starts a new lookup', async ({ page }) => {
  await page.route('**/init', async (route) => {
    await route.fulfill({
      contentType: 'application/json',
      json: {
        token: 'mock-token',
        year: '2026',
        remoteAddress: '198.51.100.24'
      }
    })
  })

  const input = page.getByRole('textbox', { name: 'URL or IP or Domain' })
  const submit = page.getByRole('button', { name: 'GO' })

  await page.goto('/')
  await expect(submit).toBeEnabled()

  await input.fill('google.com')
  await submit.click()

  const firstResult = page.locator('[data-testid="address-lookup-ip"]').first()
  await expect(firstResult).toContainText('203.0.113.7')

  page.once('dialog', async (dialog) => {
    expect(dialog.message()).toContain('203.0.113.7')
    await dialog.accept()
  })

  await firstResult.click()
  await expect(input).toHaveValue('203.0.113.7')

  await expect(firstResult).toContainText('198.51.100.11')
})
