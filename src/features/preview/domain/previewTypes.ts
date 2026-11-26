import type {
  ModuleDto,
  SiteBlockDto,
  SiteBlockType,
  SiteDto,
} from '../../../domain/ports';

export type { SiteBlockType };

export type SiteBlock = SiteBlockDto;

export interface SiteRenderInput {
  readonly site: SiteDto;
  readonly blocks?: readonly SiteBlock[];
  readonly activeModules?: readonly ModuleDto[];
}

export type DeviceViewport = 'mobile' | 'tablet' | 'desktop';

export interface ViewportPreset {
  readonly id: DeviceViewport;
  readonly label: string;
  readonly widthPx: number;
  readonly heightPx: number;
}

export const VIEWPORT_PRESETS: readonly ViewportPreset[] = [
  { id: 'mobile', label: 'Móvil', widthPx: 360, heightPx: 640 },
  { id: 'tablet', label: 'Tablet', widthPx: 768, heightPx: 900 },
  { id: 'desktop', label: 'Escritorio', widthPx: 1280, heightPx: 800 },
];
