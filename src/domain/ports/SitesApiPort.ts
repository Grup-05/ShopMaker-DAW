export type SiteStatus = 'draft' | 'published';

export interface SiteDto {
  readonly id: string;
  readonly name: string;
  readonly subdomain: string;
  readonly status: SiteStatus;
  readonly category?: string;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface CreateSiteDto {
  readonly name: string;
  readonly subdomain?: string;
  readonly category?: string;
}

/**
 * Puerto de API de Gestión de Sitios Web.
 * El Dashboard (PBI-006) y el Mock (PBI-003) se comunican a través de este contrato.
 */
export interface SitesApiPort {
  getUserSites(): Promise<readonly SiteDto[]>;
  createSite(dto: CreateSiteDto): Promise<SiteDto>;
  deleteSite(id: string): Promise<void>;
}
