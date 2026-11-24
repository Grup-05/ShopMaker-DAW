import type { ReactNode } from 'react';
import { useTheme } from '../../../shared/hooks/useTheme';
import './DashboardLayout.css';

export type DashboardSection = 'sites' | 'catalog' | 'settings';

export interface DashboardLayoutProps {
  readonly userName?: string;
  readonly activeSection: DashboardSection;
  readonly onSectionChange: (section: DashboardSection) => void;
  readonly children: ReactNode;
}

export function DashboardLayout({
  userName = 'Usuario',
  activeSection,
  onSectionChange,
  children,
}: DashboardLayoutProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="dashboard-layout">
      <header className="dashboard-layout__header">
        <div className="dashboard-layout__header-brand">
          <span className="dashboard-layout__brand-title">ShopMaker CMS</span>
          <h1 className="dashboard-layout__greeting">Hola, {userName}</h1>
        </div>

        <div className="dashboard-layout__header-actions">
          <button
            type="button"
            className="dashboard-layout__theme-button"
            onClick={toggleTheme}
            aria-pressed={theme === 'dark'}
          >
            Cambiar tema
          </button>
        </div>
      </header>

      <div className="dashboard-layout__body">
        <aside
          className="dashboard-layout__sidebar"
          aria-label="Navegación del panel"
        >
          <nav
            className="dashboard-layout__nav"
            aria-label="Secciones del panel"
          >
            <ul className="dashboard-layout__nav-list">
              <li>
                <button
                  type="button"
                  className="dashboard-layout__nav-button"
                  aria-current={activeSection === 'sites' ? 'page' : undefined}
                  onClick={() => onSectionChange('sites')}
                >
                  Mis Sitios
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="dashboard-layout__nav-button"
                  aria-current={activeSection === 'catalog' ? 'page' : undefined}
                  onClick={() => onSectionChange('catalog')}
                >
                  Catálogo de Módulos
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="dashboard-layout__nav-button"
                  aria-current={activeSection === 'settings' ? 'page' : undefined}
                  onClick={() => onSectionChange('settings')}
                >
                  Configuración
                </button>
              </li>
            </ul>
          </nav>
        </aside>

        <main
          className="dashboard-layout__main"
          aria-label="Contenido principal"
        >
          {children}
        </main>
      </div>
    </div>
  );
}
