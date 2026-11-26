export type ModuleStatus = 'available' | 'installed' | 'featured';

export interface ModuleDto {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly category: string;
  readonly icon?: string;
  readonly status: ModuleStatus;
  readonly version: string;
  readonly price?: number;
  readonly permissions?: readonly string[];
}

export interface ModuleManifestDto {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly category: string;
  readonly version: string;
  readonly icon?: string;
  readonly price?: number;
  readonly permissions?: readonly string[];
  readonly blockTemplate?: {
    readonly title: string;
    readonly content: string;
  };
}

/**
 * Puerto de API de Catálogo de Módulos.
 * El catálogo del Dashboard (PBI-006), la tienda (PBI-007), el Editor (PBI-008)
 * y el Mock (PBI-003) se comunican a través de este contrato.
 */
export interface ModulesApiPort {
  getCatalog(): Promise<readonly ModuleDto[]>;
  installModule(siteId: string, moduleId: string): Promise<void>;
  getInstalledModules?(siteId: string): Promise<readonly ModuleDto[]>;
  registerModule?(manifest: ModuleManifestDto): Promise<ModuleDto>;
}
