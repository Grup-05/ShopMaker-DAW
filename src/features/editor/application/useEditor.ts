import { useCallback, useEffect, useState } from 'react';
import type {
  ModuleDto,
  ModulesApiPort,
  SiteBlockDto,
  SiteDto,
  SitesApiPort,
} from '../../../domain/ports';
import {
  addBlockToCanvas,
  createModuleBlock,
  createStructuralBlock,
  duplicateBlockInCanvas,
  moveBlockInCanvas,
  removeBlockFromCanvas,
  updateBlockProperties,
  type BlockPropertyPatch,
  type StructuralBlockType,
} from '../domain/EditorBlock';

export type DraftSaveStatus = 'idle' | 'saving' | 'saved' | 'error';

export interface UseEditorOptions {
  readonly siteId: string;
  readonly sitesApi?: SitesApiPort;
  readonly modulesApi?: ModulesApiPort;
}

export interface UseEditorReturn {
  readonly site: SiteDto | null;
  readonly blocks: readonly SiteBlockDto[];
  readonly selectedBlockId: string | null;
  readonly selectedBlock: SiteBlockDto | null;
  readonly installedModules: readonly ModuleDto[];
  readonly loading: boolean;
  readonly error: string | null;
  readonly saveStatus: DraftSaveStatus;
  readonly saveError: string | null;
  readonly selectBlock: (blockId: string | null) => void;
  readonly addStructuralBlock: (type: StructuralBlockType) => Promise<void>;
  readonly addInstalledModuleBlock: (module: ModuleDto) => Promise<void>;
  readonly moveBlock: (
    blockId: string,
    direction: 'up' | 'down',
  ) => Promise<void>;
  readonly duplicateBlock: (blockId: string) => Promise<void>;
  readonly removeBlock: (blockId: string) => Promise<void>;
  readonly updateSelectedBlock: (patch: BlockPropertyPatch) => Promise<void>;
  readonly reload: () => Promise<void>;
}

export function useEditor({
  siteId,
  sitesApi,
  modulesApi,
}: UseEditorOptions): UseEditorReturn {
  const [site, setSite] = useState<SiteDto | null>(null);
  const [blocks, setBlocks] = useState<readonly SiteBlockDto[]>([]);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [installedModules, setInstalledModules] = useState<
    readonly ModuleDto[]
  >([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<DraftSaveStatus>('idle');
  const [saveError, setSaveError] = useState<string | null>(null);

  const loadEditorData = useCallback(async () => {
    if (!sitesApi) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const userSites = await sitesApi.getUserSites();
      const matchedSite =
        userSites.find((candidate) => candidate.id === siteId) ?? null;

      if (!matchedSite) {
        setError(`No se encontró el sitio web con identificador ${siteId}.`);
        setSite(null);
        setLoading(false);
        return;
      }

      setSite(matchedSite);

      const loadedBlocks = sitesApi.getSiteDraft
        ? (await sitesApi.getSiteDraft(siteId)).blocks
        : [];

      setBlocks(loadedBlocks);
      setSelectedBlockId(loadedBlocks[0]?.id ?? null);

      if (modulesApi) {
        if (modulesApi.getInstalledModules) {
          const siteModules = await modulesApi.getInstalledModules(siteId);
          setInstalledModules(siteModules);
        } else {
          const catalog = await modulesApi.getCatalog();
          setInstalledModules(
            catalog.filter((mod) => mod.status === 'installed'),
          );
        }
      }
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : 'Error al cargar el editor del sitio web.';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [siteId, sitesApi, modulesApi]);

  useEffect(() => {
    void loadEditorData();
  }, [loadEditorData]);

  const persistBlocks = useCallback(
    async (nextBlocks: readonly SiteBlockDto[]) => {
      setBlocks(nextBlocks);

      if (!sitesApi?.saveSiteDraft) {
        setSaveStatus('saved');
        return;
      }

      setSaveStatus('saving');
      setSaveError(null);

      try {
        await sitesApi.saveSiteDraft(siteId, nextBlocks);
        setSaveStatus('saved');
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : 'No se pudo autoguardar el borrador.';
        setSaveStatus('error');
        setSaveError(message);
      }
    },
    [siteId, sitesApi],
  );

  const addStructuralBlock = useCallback(
    async (type: StructuralBlockType) => {
      const created = createStructuralBlock(type);
      const next = addBlockToCanvas(blocks, created);
      setSelectedBlockId(created.id);
      await persistBlocks(next);
    },
    [blocks, persistBlocks],
  );

  const addInstalledModuleBlock = useCallback(
    async (module: ModuleDto) => {
      const created = createModuleBlock(module);
      const next = addBlockToCanvas(blocks, created);
      setSelectedBlockId(created.id);
      await persistBlocks(next);
    },
    [blocks, persistBlocks],
  );

  const moveBlock = useCallback(
    async (blockId: string, direction: 'up' | 'down') => {
      const next = moveBlockInCanvas(blocks, blockId, direction);
      await persistBlocks(next);
    },
    [blocks, persistBlocks],
  );

  const duplicateBlock = useCallback(
    async (blockId: string) => {
      const next = duplicateBlockInCanvas(blocks, blockId);
      const originalIndex = blocks.findIndex((b) => b.id === blockId);
      const duplicatedBlock =
        originalIndex !== -1 ? next[originalIndex + 1] : null;
      if (duplicatedBlock) {
        setSelectedBlockId(duplicatedBlock.id);
      }
      await persistBlocks(next);
    },
    [blocks, persistBlocks],
  );

  const removeBlock = useCallback(
    async (blockId: string) => {
      const next = removeBlockFromCanvas(blocks, blockId);
      if (selectedBlockId === blockId) {
        setSelectedBlockId(next[0]?.id ?? null);
      }
      await persistBlocks(next);
    },
    [blocks, selectedBlockId, persistBlocks],
  );

  const updateSelectedBlock = useCallback(
    async (patch: BlockPropertyPatch) => {
      if (!selectedBlockId) {
        return;
      }
      const next = updateBlockProperties(blocks, selectedBlockId, patch);
      await persistBlocks(next);
    },
    [blocks, selectedBlockId, persistBlocks],
  );

  const selectedBlock =
    blocks.find((block) => block.id === selectedBlockId) ?? null;

  return {
    site,
    blocks,
    selectedBlockId,
    selectedBlock,
    installedModules,
    loading,
    error,
    saveStatus,
    saveError,
    selectBlock: setSelectedBlockId,
    addStructuralBlock,
    addInstalledModuleBlock,
    moveBlock,
    duplicateBlock,
    removeBlock,
    updateSelectedBlock,
    reload: loadEditorData,
  };
}
