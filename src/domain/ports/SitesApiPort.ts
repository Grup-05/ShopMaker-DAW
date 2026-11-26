export type SiteStatus = 'draft' | 'published';

export type SiteBlockType =
  | 'hero'
  | 'text'
  | 'features'
  | 'footer'
  | 'module'
  | 'heading'
  | 'image'
  | 'separator';

export interface SiteBlockDto {
  readonly id: string;
  readonly type: SiteBlockType;
  readonly title?: string;
  readonly subtitle?: string;
  readonly content?: string;
  readonly ctaText?: string;
  readonly imageUrl?: string;
  readonly imageAlt?: string;
  readonly moduleId?: string;
  readonly moduleName?: string;
}

export interface SiteDraftDto {
  readonly siteId: string;
  readonly blocks: readonly SiteBlockDto[];
  readonly updatedAt: string;
}

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
 * El Dashboard (PBI-006), el Editor (PBI-008), la Previsualización (PBI-009)
 * y el Mock (PBI-003) se comunican a través de este contrato.
 */
export interface SitesApiPort {
  getUserSites(): Promise<readonly SiteDto[]>;
  createSite(dto: CreateSiteDto): Promise<SiteDto>;
  deleteSite(id: string): Promise<void>;
  publishSite?(id: string): Promise<SiteDto>;
  getSiteDraft?(siteId: string): Promise<SiteDraftDto>;
  saveSiteDraft?(
    siteId: string,
    blocks: readonly SiteBlockDto[],
  ): Promise<SiteDraftDto>;
}
