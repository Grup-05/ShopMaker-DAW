import type { SiteBlockDto } from '../../../domain/ports';
import {
  getBlockTypeBadge,
  type BlockPropertyPatch,
} from '../domain/EditorBlock';

export interface InspectorPanelProps {
  readonly selectedBlock: SiteBlockDto | null;
  readonly onUpdateBlock: (patch: BlockPropertyPatch) => void;
}

export function InspectorPanel({
  selectedBlock,
  onUpdateBlock,
}: InspectorPanelProps) {
  return (
    <aside
      className="editor-inspector"
      role="region"
      aria-label="Inspector de propiedades"
    >
      <h2 className="editor-inspector__heading">Inspector de propiedades</h2>

      {!selectedBlock ? (
        <p className="editor-inspector__empty">
          Selecciona un bloque en el lienzo central para editar sus textos y
          propiedades en tiempo real.
        </p>
      ) : (
        <form
          className="editor-inspector__form"
          onSubmit={(event) => event.preventDefault()}
        >
          <div className="editor-inspector__meta">
            <span className="editor-inspector__badge">
              {getBlockTypeBadge(selectedBlock.type)}
            </span>
            {selectedBlock.moduleName && (
              <span className="editor-inspector__module-tag">
                Módulo: {selectedBlock.moduleName}
              </span>
            )}
          </div>

          <div className="editor-inspector__field">
            <label
              htmlFor="inspector-block-title"
              className="editor-inspector__label"
            >
              Título del bloque
            </label>
            <input
              id="inspector-block-title"
              type="text"
              className="editor-inspector__input"
              value={selectedBlock.title ?? ''}
              onChange={(event) =>
                onUpdateBlock({ title: event.target.value })
              }
            />
          </div>

          <div className="editor-inspector__field">
            <label
              htmlFor="inspector-block-subtitle"
              className="editor-inspector__label"
            >
              Subtítulo secundario
            </label>
            <input
              id="inspector-block-subtitle"
              type="text"
              className="editor-inspector__input"
              value={selectedBlock.subtitle ?? ''}
              onChange={(event) =>
                onUpdateBlock({ subtitle: event.target.value })
              }
            />
          </div>

          <div className="editor-inspector__field">
            <label
              htmlFor="inspector-block-content"
              className="editor-inspector__label"
            >
              Contenido del bloque
            </label>
            <textarea
              id="inspector-block-content"
              rows={4}
              className="editor-inspector__textarea"
              value={selectedBlock.content ?? ''}
              onChange={(event) =>
                onUpdateBlock({ content: event.target.value })
              }
            />
          </div>

          <div className="editor-inspector__field">
            <label
              htmlFor="inspector-block-cta"
              className="editor-inspector__label"
            >
              Texto del botón CTA
            </label>
            <input
              id="inspector-block-cta"
              type="text"
              className="editor-inspector__input"
              value={selectedBlock.ctaText ?? ''}
              onChange={(event) =>
                onUpdateBlock({ ctaText: event.target.value })
              }
            />
          </div>
        </form>
      )}
    </aside>
  );
}
