import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import type { ModulesApiPort, SitesApiPort } from '../../../domain/ports';
import { SitePreviewModal } from '../../preview/presentation/SitePreviewModal';
import { useEditor, type DraftSaveStatus } from '../application/useEditor';
import { BlockPalette } from './BlockPalette';
import { EditorCanvas } from './EditorCanvas';
import { InspectorPanel } from './InspectorPanel';
import './EditorPage.css';

export interface EditorPageProps {
  readonly sitesApi?: SitesApiPort;
  readonly modulesApi?: ModulesApiPort;
}

function formatSaveStatus(status: DraftSaveStatus): string {
  switch (status) {
    case 'saving':
      return 'Guardando borrador...';
    case 'saved':
      return 'Borrador guardado automáticamente';
    case 'error':
      return 'Error al guardar borrador';
    case 'idle':
    default:
      return 'Listo para editar';
  }
}

export function EditorPage({ sitesApi, modulesApi }: EditorPageProps) {
  const { siteId = '' } = useParams<{ siteId: string }>();
  const navigate = useNavigate();
  const [previewOpen, setPreviewOpen] = useState(false);

  const {
    site,
    blocks,
    selectedBlockId,
    selectedBlock,
    installedModules,
    loading,
    error,
    saveStatus,
    saveError,
    selectBlock,
    addStructuralBlock,
    addInstalledModuleBlock,
    moveBlock,
    duplicateBlock,
    removeBlock,
    updateSelectedBlock,
    reload,
  } = useEditor({ siteId, sitesApi, modulesApi });

  if (loading) {
    return (
      <main className="editor-page" aria-busy="true">
        <p className="editor-page__loading" role="status">
          Cargando editor visual del sitio...
        </p>
      </main>
    );
  }

  if (error || !site) {
    return (
      <main className="editor-page">
        <div className="editor-page__error" role="alert">
          <p>{error ?? 'No se pudo cargar el sitio solicitado.'}</p>
          <div className="editor-page__error-actions">
            <button
              type="button"
              className="editor-page__btn"
              onClick={() => void reload()}
            >
              Reintentar
            </button>
            <button
              type="button"
              className="editor-page__btn"
              onClick={() => navigate('/dashboard')}
            >
              Volver al Dashboard
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <div className="editor-page">
      <header className="editor-page__topbar">
        <div className="editor-page__brand">
          <button
            type="button"
            className="editor-page__back-btn"
            onClick={() => navigate('/dashboard')}
          >
            ← Volver al Dashboard
          </button>
          <div>
            <h1 className="editor-page__title">Editor: {site.name}</h1>
            <span className="editor-page__subdomain">{site.subdomain}</span>
          </div>
        </div>

        <div className="editor-page__status-group">
          <div
            className={`editor-page__save-status editor-page__save-status--${saveStatus}`}
            role="status"
            aria-live="polite"
          >
            {formatSaveStatus(saveStatus)}
          </div>

          <button
            type="button"
            className="editor-page__preview-btn"
            onClick={() => setPreviewOpen(true)}
          >
            Previsualizar Web
          </button>
        </div>
      </header>

      {saveError && (
        <div className="editor-page__save-alert" role="alert">
          <span>{saveError}</span>
        </div>
      )}

      <main className="editor-page__workspace">
        <BlockPalette
          installedModules={installedModules}
          onAddStructuralBlock={(type) => void addStructuralBlock(type)}
          onAddModuleBlock={(mod) => void addInstalledModuleBlock(mod)}
        />

        <EditorCanvas
          blocks={blocks}
          selectedBlockId={selectedBlockId}
          onSelectBlock={selectBlock}
          onMoveBlock={(id, dir) => void moveBlock(id, dir)}
          onDuplicateBlock={(id) => void duplicateBlock(id)}
          onRemoveBlock={(id) => void removeBlock(id)}
        />

        <InspectorPanel
          selectedBlock={selectedBlock}
          onUpdateBlock={(patch) => void updateSelectedBlock(patch)}
        />
      </main>

      <SitePreviewModal
        site={site}
        isOpen={previewOpen}
        onClose={() => setPreviewOpen(false)}
        blocks={blocks}
        activeModules={installedModules}
      />
    </div>
  );
}
