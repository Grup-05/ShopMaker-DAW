import { useReducer } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../auth/application/useAuth';
import { UserMenu } from '../../auth/presentation/UserMenu';
import { useTheme } from '../../../shared/hooks/useTheme';
import { AUTH_ROUTES } from '../application/authRoutes';
import {
  findSelectedPage,
  homePageReducer,
  initialHomePageState,
} from '../application/homePageState';
import type { StartedPage } from '../domain/StartedPage';
import './home.css';

interface HomePageProps {
  readonly pages: readonly StartedPage[];
}

export function HomePage({ pages }: HomePageProps) {
  const [state, dispatch] = useReducer(homePageReducer, initialHomePageState);
  const selectedPage = findSelectedPage(pages, state);
  const { theme, toggleTheme } = useTheme();
  const { status, user } = useAuth();
  const isAuthenticated = status === 'Authenticated' && user !== null;

  return (
    <div className="home">
      <header className="home__header">
        <nav className="home__nav" aria-label="Navegación principal">
          {isAuthenticated ? (
            <UserMenu />
          ) : (
            <>
              <Link className="home__nav-link" to={AUTH_ROUTES.login}>
                Iniciar sesión
              </Link>
              <Link className="home__nav-link" to={AUTH_ROUTES.register}>
                Registrarse
              </Link>
            </>
          )}
          <button
            className="home__theme-button"
            type="button"
            onClick={toggleTheme}
            aria-pressed={theme === 'dark'}
          >
            Cambiar tema
          </button>
        </nav>
        <h1 className="home__title">ShopMaker</h1>
      </header>

      <div className="home__body">
        <aside className="home__sidebar" aria-label="Páginas empezadas">
          <button className="home__create-button" type="button">
            Crear página
          </button>

          {pages.length === 0 ? (
            <p className="home__empty-message">Ninguna Web en Progreso</p>
          ) : (
            <ul className="home__page-list">
              {pages.map((page) => {
                const isSelected = state.selectedPageId === page.id;

                return (
                  <li className="home__page-item" key={page.id}>
                    <button
                      className="home__page-select"
                      type="button"
                      aria-pressed={isSelected}
                      onClick={() =>
                        dispatch({ type: 'select', pageId: page.id })
                      }
                    >
                      {page.name}
                    </button>
                    <button
                      className="home__page-layout"
                      type="button"
                      aria-label={`Maquetar ${page.name}`}
                    >
                      Maquetar
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </aside>

        <main className="home__main" aria-label="Área de trabajo">
          {selectedPage ? (
            <p className="home__selection-status" role="status">
              Web seleccionada: {selectedPage.name}
            </p>
          ) : (
            <p className="home__preview-instruction">
              Seleccione una web para visualizar
            </p>
          )}
        </main>
      </div>
    </div>
  );
}
