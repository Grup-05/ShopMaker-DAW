import type {
  ModuleDto,
  SiteDraftDto,
  SiteDto,
  UserDto,
} from '../../../domain/ports';

export interface MockStoredUser {
  readonly user: UserDto;
  readonly password: string;
}

export interface MockDatabaseState {
  readonly users: readonly MockStoredUser[];
  readonly activeUserId: string | null;
  readonly activeToken: string | null;
  readonly sites: readonly SiteDto[];
  readonly modules: readonly ModuleDto[];
  readonly installedModulesBySite: Readonly<Record<string, readonly string[]>>;
  readonly draftsBySite?: Readonly<Record<string, SiteDraftDto>>;
}

export const DEFAULT_MOCK_STORAGE_KEY = 'shopmaker.mock.state.v1';

export const INITIAL_MOCK_USERS: readonly MockStoredUser[] = [
  {
    user: {
      id: 'user-demo-01',
      name: 'Usuario Demo ShopMaker',
      email: 'demo@shopmaker.local',
    },
    password: 'DemoPassword2026!',
  },
];

export const INITIAL_MOCK_SITES: readonly SiteDto[] = [
  {
    id: 'site-demo-01',
    name: 'Tienda Demo Artesanal',
    subdomain: 'tienda-demo-artesanal.shopmaker.local',
    status: 'draft',
    category: 'ecommerce',
    createdAt: '2026-11-17T09:00:00.000Z',
    updatedAt: '2026-11-17T09:00:00.000Z',
  },
];

export const INITIAL_MOCK_MODULES: readonly ModuleDto[] = [
  {
    id: 'mod-ecommerce-cart',
    name: 'Carrito E-commerce',
    description:
      'Catálogo de productos, cesta de compra y flujo de pedido simulado.',
    category: 'ecommerce',
    status: 'featured',
    version: '1.2.0',
  },
  {
    id: 'mod-contact-form',
    name: 'Formulario de Contacto',
    description:
      'Formulario accesible con validación en tiempo real y avisos de envío.',
    category: 'marketing',
    status: 'available',
    version: '1.0.4',
  },
  {
    id: 'mod-image-gallery',
    name: 'Galería de Imágenes',
    description:
      'Cuadrícula responsive con carga diferida y texto alternativo obligatorio.',
    category: 'contenido',
    status: 'available',
    version: '1.1.0',
  },
  {
    id: 'mod-seo-basic',
    name: 'SEO Básico',
    description:
      'Editor de metadatos, títulos semánticos y previsualización de buscadores.',
    category: 'seo',
    status: 'available',
    version: '1.0.0',
  },
];

export function createInitialMockState(): MockDatabaseState {
  return {
    users: INITIAL_MOCK_USERS.map((entry) => ({
      user: { ...entry.user },
      password: entry.password,
    })),
    activeUserId: null,
    activeToken: null,
    sites: INITIAL_MOCK_SITES.map((site) => ({ ...site })),
    modules: INITIAL_MOCK_MODULES.map((mod) => ({ ...mod })),
    installedModulesBySite: {},
    draftsBySite: {},
  };
}
