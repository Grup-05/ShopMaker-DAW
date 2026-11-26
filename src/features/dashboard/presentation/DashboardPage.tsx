import { useState, useEffect } from 'react';
import { useInRouterContext, useNavigate } from 'react-router-dom';
import type {
  AuthApiPort,
  ModulesApiPort,
  SitesApiPort,
  UserDto,
} from '../../../domain/ports';
import { LocalStorageMockApiAdapter } from '../../../infrastructure/api/mock/LocalStorageMockApiAdapter';
import { DashboardLayout, type DashboardSection } from './DashboardLayout';
import { SitesView } from './SitesView';
import { CatalogView } from './CatalogView';

const defaultApiAdapter = new LocalStorageMockApiAdapter();

function RoutedSitesView({ sitesApi }: { readonly sitesApi: SitesApiPort }) {
  const navigate = useNavigate();
  return (
    <SitesView
      sitesApi={sitesApi}
      onEditSite={(site) => navigate(`/editor/${site.id}`)}
    />
  );
}

export interface DashboardPageProps {
  readonly authApi?: AuthApiPort;
  readonly sitesApi?: SitesApiPort;
  readonly modulesApi?: ModulesApiPort;
}

export function DashboardPage({
  authApi = defaultApiAdapter,
  sitesApi = defaultApiAdapter,
  modulesApi = defaultApiAdapter,
}: DashboardPageProps) {
  const [currentUser, setCurrentUser] = useState<UserDto | null>(null);
  const [activeSection, setActiveSection] = useState<DashboardSection>('sites');
  const inRouter = useInRouterContext();

  useEffect(() => {
    let mounted = true;
    authApi
      .me()
      .then((user) => {
        if (mounted) {
          setCurrentUser(user);
        }
      })
      .catch(() => {
        // Fallback or unauthenticated state handled gracefully
      });

    return () => {
      mounted = false;
    };
  }, [authApi]);

  return (
    <DashboardLayout
      userName={currentUser?.name}
      activeSection={activeSection}
      onSectionChange={setActiveSection}
    >
      {activeSection === 'sites' &&
        (inRouter ? (
          <RoutedSitesView sitesApi={sitesApi} />
        ) : (
          <SitesView sitesApi={sitesApi} />
        ))}
      {activeSection === 'catalog' && <CatalogView modulesApi={modulesApi} />}
      {activeSection === 'settings' && (
        <section aria-labelledby="settings-heading">
          <h2 id="settings-heading">Configuración de la cuenta</h2>
          <p>Gestión de perfil y preferencias del panel.</p>
        </section>
      )}
    </DashboardLayout>
  );
}
