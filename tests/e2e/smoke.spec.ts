import { test, expect } from '@playwright/test';

test.describe('[PBI-004][CA-03] Smoke Test de Arranque E2E', () => {
  test('la aplicación arranca en el navegador y muestra el título ShopMaker', async ({ page }) => {
    await page.goto('/');

    // Verifica que el título principal de la aplicación sea visible
    const heading = page.getByRole('heading', { level: 1, name: 'ShopMaker' });
    await expect(heading).toBeVisible();

    // Verifica la existencia de landmarks semánticos accesibles
    const nav = page.getByRole('navigation', { name: 'Navegación principal' });
    await expect(nav).toBeVisible();

    const main = page.getByRole('main');
    await expect(main).toBeVisible();
  });
});
