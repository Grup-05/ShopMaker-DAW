import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, beforeEach } from 'vitest';
import { useTheme } from '../../../src/shared/hooks/useTheme';
import { HomePage } from '../../../src/features/home/presentation/HomePage';

function TestThemeConsumer() {
  const { theme, toggleTheme } = useTheme();
  return (
    <div>
      <span data-testid="current-theme">{theme}</span>
      <button onClick={toggleTheme} type="button">
        Alternar
      </button>
    </div>
  );
}

describe('useTheme hook & HomePage integration', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
  });

  describe('[PBI-002][RF-05][CA-03] useTheme hook', () => {
    it('debe inicializar el tema y permitir alternar conmutando en el DOM', () => {
      render(<TestThemeConsumer />);

      const themeDisplay = screen.getByTestId('current-theme');
      expect(themeDisplay.textContent).toBe('light');
      expect(document.documentElement.getAttribute('data-theme')).toBe('light');

      act(() => {
        screen.getByRole('button', { name: 'Alternar' }).click();
      });

      expect(themeDisplay.textContent).toBe('dark');
      expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
      expect(localStorage.getItem('shopmaker-theme')).toBe('dark');
    });
  });

  describe('[PBI-002][CA-03] HomePage theme button toggle', () => {
    it('pulsar el botón Cambiar tema en HomePage debe alternar el tema activo', async () => {
      const user = userEvent.setup();
      render(<HomePage pages={[]} />);

      const themeButton = screen.getByRole('button', { name: /cambiar tema/i });
      expect(themeButton).toBeVisible();

      // Estado inicial (light)
      expect(document.documentElement.getAttribute('data-theme')).toBe('light');

      // Primer clic -> dark
      await user.click(themeButton);
      expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
      expect(localStorage.getItem('shopmaker-theme')).toBe('dark');

      // Segundo clic -> light
      await user.click(themeButton);
      expect(document.documentElement.getAttribute('data-theme')).toBe('light');
      expect(localStorage.getItem('shopmaker-theme')).toBe('light');
    });
  });
});
