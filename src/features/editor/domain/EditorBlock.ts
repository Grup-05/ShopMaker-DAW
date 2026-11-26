import type {
  ModuleDto,
  SiteBlockDto,
  SiteBlockType,
} from '../../../domain/ports';

export type StructuralBlockType = 'hero' | 'text' | 'features' | 'footer';

export interface StructuralPaletteItem {
  readonly type: StructuralBlockType;
  readonly label: string;
  readonly description: string;
  readonly defaultTitle: string;
  readonly defaultSubtitle?: string;
  readonly defaultContent: string;
  readonly defaultCtaText?: string;
}

export interface BlockPropertyPatch {
  readonly title?: string;
  readonly subtitle?: string;
  readonly content?: string;
  readonly ctaText?: string;
  readonly imageUrl?: string;
  readonly imageAlt?: string;
}

export const STRUCTURAL_BLOCK_PALETTE: readonly StructuralPaletteItem[] = [
  {
    type: 'hero',
    label: 'Hero / Portada',
    description: 'Cabecera destacada con título, subtítulo y llamada a la acción.',
    defaultTitle: 'Portada Principal',
    defaultSubtitle: 'Bienvenido a nuestra web',
    defaultContent: 'Presenta aquí la propuesta de valor principal de tu negocio.',
    defaultCtaText: 'Explorar catálogo',
  },
  {
    type: 'text',
    label: 'Bloque de Texto',
    description: 'Sección editorial con encabezado y párrafo descriptivo.',
    defaultTitle: 'Sección Informativa',
    defaultContent: 'Redacta el contenido detallado de esta sección para tus visitantes.',
  },
  {
    type: 'features',
    label: 'Características',
    description: 'Resumen de ventajas competitivas, servicios o puntos clave.',
    defaultTitle: 'Nuestras Ventajas',
    defaultSubtitle: 'Por qué elegirnos',
    defaultContent: 'Atención cercana, calidad garantizada y soporte continuo.',
  },
  {
    type: 'footer',
    label: 'Pie de Página',
    description: 'Cierre de página con información de contacto y derechos.',
    defaultTitle: 'Contacto y Enlaces',
    defaultContent: '© 2026 ShopMaker CMS · Todos los derechos reservados.',
  },
];

let blockCounter = 0;

function nextBlockId(prefix: string): string {
  blockCounter += 1;
  return `${prefix}-${Date.now()}-${blockCounter}`;
}

export function createStructuralBlock(
  type: StructuralBlockType,
  id: string = nextBlockId(`block-${type}`),
): SiteBlockDto {
  const definition =
    STRUCTURAL_BLOCK_PALETTE.find((item) => item.type === type) ??
    STRUCTURAL_BLOCK_PALETTE[0];

  return {
    id,
    type: definition.type,
    title: definition.defaultTitle,
    ...(definition.defaultSubtitle
      ? { subtitle: definition.defaultSubtitle }
      : {}),
    content: definition.defaultContent,
    ...(definition.defaultCtaText ? { ctaText: definition.defaultCtaText } : {}),
  };
}

export function createModuleBlock(
  module: ModuleDto,
  id: string = nextBlockId(`block-mod-${module.id}`),
): SiteBlockDto {
  return {
    id,
    type: 'module',
    moduleId: module.id,
    moduleName: module.name,
    title: module.name,
    subtitle: `Módulo v${module.version}`,
    content: module.description,
  };
}

export function addBlockToCanvas(
  blocks: readonly SiteBlockDto[],
  newBlock: SiteBlockDto,
): readonly SiteBlockDto[] {
  return [...blocks, { ...newBlock }];
}

export function moveBlockInCanvas(
  blocks: readonly SiteBlockDto[],
  blockId: string,
  direction: 'up' | 'down',
): readonly SiteBlockDto[] {
  const index = blocks.findIndex((block) => block.id === blockId);
  if (index === -1) {
    return blocks;
  }

  const targetIndex = direction === 'up' ? index - 1 : index + 1;
  if (targetIndex < 0 || targetIndex >= blocks.length) {
    return blocks;
  }

  const copy = [...blocks];
  const [moved] = copy.splice(index, 1);
  copy.splice(targetIndex, 0, moved);
  return copy;
}

export function duplicateBlockInCanvas(
  blocks: readonly SiteBlockDto[],
  blockId: string,
  newId: string = nextBlockId('block-copy'),
): readonly SiteBlockDto[] {
  const index = blocks.findIndex((block) => block.id === blockId);
  if (index === -1) {
    return blocks;
  }

  const original = blocks[index];
  const baseTitle = original.title ?? original.type;
  const duplicated: SiteBlockDto = {
    ...original,
    id: newId,
    title: `${baseTitle} (copia)`,
  };

  return [
    ...blocks.slice(0, index + 1),
    duplicated,
    ...blocks.slice(index + 1),
  ];
}

export function removeBlockFromCanvas(
  blocks: readonly SiteBlockDto[],
  blockId: string,
): readonly SiteBlockDto[] {
  return blocks.filter((block) => block.id !== blockId);
}

export function updateBlockProperties(
  blocks: readonly SiteBlockDto[],
  blockId: string,
  patch: BlockPropertyPatch,
): readonly SiteBlockDto[] {
  return blocks.map((block) =>
    block.id === blockId
      ? {
          ...block,
          ...patch,
        }
      : block,
  );
}

export function blockHasUserContent(block: SiteBlockDto): boolean {
  return Boolean(
    block.title?.trim() ||
      block.subtitle?.trim() ||
      block.content?.trim() ||
      block.ctaText?.trim() ||
      block.imageUrl?.trim(),
  );
}

export function getBlockTypeBadge(type: SiteBlockType): string {
  switch (type) {
    case 'hero':
      return 'Hero';
    case 'text':
      return 'Texto';
    case 'features':
      return 'Características';
    case 'footer':
      return 'Pie de página';
    case 'module':
      return 'Módulo';
    case 'heading':
      return 'Encabezado';
    case 'image':
      return 'Imagen';
    case 'separator':
      return 'Separador';
  }
}
