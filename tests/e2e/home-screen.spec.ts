import { expect, test } from '@playwright/test';

test('[PBI-001][CA-01] app-arranque', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('heading', { level: 1, name: 'ShopMaker' })).toBeVisible();
  await expect(page.getByRole('navigation')).toBeVisible();
  await expect(page.getByRole('main')).toBeVisible();
  await expect(page.getByRole('complementary')).toBeVisible();
});

test('[PBI-001][CA-01] home-layout', async ({ page }) => {
  await page.goto('/');

  const navigation = page.getByRole('navigation');
  const heading = page.getByRole('heading', { level: 1, name: 'ShopMaker' });

  await expect(navigation).toBeVisible();
  await expect(heading).toBeVisible();
  await expect(page.getByRole('complementary')).toBeVisible();
  await expect(page.getByRole('main')).toBeVisible();

  const navigationBox = await navigation.boundingBox();
  const headingBox = await heading.boundingBox();
  expect(navigationBox).not.toBeNull();
  expect(headingBox).not.toBeNull();
  expect(navigationBox!.y).toBeLessThan(headingBox!.y);

  await expect(
    page.getByRole('link', { name: 'Iniciar sesión' }),
  ).toBeVisible();
  await expect(page.getByRole('link', { name: 'Registrarse' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Cambiar tema' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Crear página' })).toBeVisible();
  await expect(
    page.getByText('Seleccione una web para visualizar'),
  ).toBeVisible();
  await expect(page.getByRole('link', { name: /contact/i })).toHaveCount(0);
});

test.describe('viewport mínimo', () => {
  test.use({ viewport: { width: 1024, height: 720 } });

  test('[PBI-001][CA-01][RNF-02] minimum-viewport', async ({ page }) => {
    await page.goto('/');

    const hasHorizontalScroll = await page.evaluate(
      () =>
        document.documentElement.scrollWidth >
        document.documentElement.clientWidth,
    );

    expect(hasHorizontalScroll).toBe(false);
    await expect(
      page.getByRole('heading', { level: 1, name: 'ShopMaker' }),
    ).toBeVisible();
    await expect(page.getByRole('navigation')).toBeVisible();
    await expect(page.getByRole('main')).toBeVisible();
    await expect(page.getByRole('complementary')).toBeVisible();
  });
});
