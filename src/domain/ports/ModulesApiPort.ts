export type ModuleStatus = 'available' | 'installed' | 'featured';

export interface ModuleDto {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly category: string;
  readonly icon?: string;
  readonly status: ModuleStatus;
  readonly version: string;
}

/**
 * Puerto de API de Catálogo de Módulos.
 * El catálogo del Dashboard (PBI-006) y el Mock (PBI-003) se comunican a través de este contrato.
 */
export interface ModulesApiPort {
  getCatalog(): Promise<readonly ModuleDto[]>;
  installModule(siteId: string, moduleId: string): Promise<void>;
}
