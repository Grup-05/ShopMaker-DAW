import { useState } from 'react';
import type { SiteBlockDto } from '../../../domain/ports';
import { blockHasUserContent, getBlockTypeBadge } from '../domain/EditorBlock';

export interface EditorCanvasProps {
  readonly blocks: readonly SiteBlockDto[];
  readonly selectedBlockId: string | null;
  readonly onSelectBlock: (blockId: string) => void;
  readonly onMoveBlock: (blockId: string, direction: 'up' | 'down') => void;
  readonly onDuplicateBlock: (blockId: string) => void;
  readonly onRemoveBlock: (blockId: string) => void;
}

export function EditorCanvas({
  blocks,
  selectedBlockId,
  onSelectBlock,
  onMoveBlock,
  onDuplicateBlock,
  onRemoveBlock,
}: EditorCanvasProps) {
  const [confirmingDeleteId, setConfirmingDeleteId] = useState<string | null>(
    null,
  );

  const handleDeleteClick = (block: SiteBlockDto) => {
    if (blockHasUserContent(block)) {
      setConfirmingDeleteId(block.id);
    } else {
      onRemoveBlock(block.id);
    }
  };

  return (
    <section
      className="editor-canvas"
      role="region"
      aria-label="Lienzo de bloques"
    >
      <header className="editor-canvas__header">
        <h2 className="editor-canvas__heading">
          Estructura de la página ({blocks.length}{' '}
          {blocks.length === 1 ? 'bloque' : 'bloques'})
        </h2>
      </header>

      {blocks.length === 0 ? (
        <div className="editor-canvas__empty">
          <p className="editor-canvas__empty-title">
            El lienzo está vacío actualmente.
          </p>
          <p className="editor-canvas__empty-hint">
            Selecciona un bloque estructural o un módulo instalado en la paleta
            izquierda para comenzar a diseñar tu web.
          </p>
        </div>
      ) : (
        <ul className="editor-canvas__list">
          {blocks.map((block, index) => {
            const isSelected = block.id === selectedBlockId;
            const isConfirming = confirmingDeleteId === block.id;
            const blockLabel = block.title || block.type;

            return (
              <li
                key={block.id}
                className={`editor-canvas__item ${
                  isSelected ? 'editor-canvas__item--selected' : ''
                }`}
              >
                <div className="editor-canvas__card">
                  <div className="editor-canvas__card-top">
                    <button
                      type="button"
                      className="editor-canvas__select-btn"
                      aria-pressed={isSelected}
                      onClick={() => onSelectBlock(block.id)}
                    >
                      <span className="editor-canvas__badge">
                        {getBlockTypeBadge(block.type)}
                      </span>
                      <span className="editor-canvas__block-title">
                        {block.title || '(Sin título)'}
                      </span>
                    </button>

                    <div
                      className="editor-canvas__toolbar"
                      role="group"
                      aria-label={`Acciones para ${blockLabel}`}
                    >
                      <button
                        type="button"
                        className="editor-canvas__action-btn"
                        aria-label={`Subir bloque ${blockLabel}`}
                        disabled={index === 0}
                        onClick={() => onMoveBlock(block.id, 'up')}
                      >
                        ↑ Subir
                      </button>
                      <button
                        type="button"
                        className="editor-canvas__action-btn"
                        aria-label={`Bajar bloque ${blockLabel}`}
                        disabled={index === blocks.length - 1}
                        onClick={() => onMoveBlock(block.id, 'down')}
                      >
                        ↓ Bajar
                      </button>
                      <button
                        type="button"
                        className="editor-canvas__action-btn"
                        aria-label={`Duplicar bloque ${blockLabel}`}
                        onClick={() => onDuplicateBlock(block.id)}
                      >
                        Duplicar
                      </button>
                      <button
                        type="button"
                        className="editor-canvas__action-btn editor-canvas__action-btn--danger"
                        aria-label={`Eliminar bloque ${blockLabel}`}
                        onClick={() => handleDeleteClick(block)}
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>

                  <div
                    className="editor-canvas__preview"
                    onClick={() => onSelectBlock(block.id)}
                  >
                    {block.subtitle && (
                      <p className="editor-canvas__subtitle">
                        {block.subtitle}
                      </p>
                    )}
                    {block.content && (
                      <p className="editor-canvas__content">{block.content}</p>
                    )}
                    {block.ctaText && (
                      <span className="editor-canvas__cta-pill">
                        {block.ctaText}
                      </span>
                    )}
                  </div>

                  {isConfirming && (
                    <div
                      className="editor-canvas__confirm-bar"
                      role="alert"
                    >
                      <span>
                        ¿Seguro que deseas eliminar «{blockLabel}» y su
                        contenido?
                      </span>
                      <div className="editor-canvas__confirm-actions">
                        <button
                          type="button"
                          className="editor-canvas__confirm-btn"
                          aria-label={`Confirmar eliminación de ${blockLabel}`}
                          onClick={() => {
                            setConfirmingDeleteId(null);
                            onRemoveBlock(block.id);
                          }}
                        >
                          Confirmar eliminación
                        </button>
                        <button
                          type="button"
                          className="editor-canvas__cancel-btn"
                          aria-label="Cancelar eliminación"
                          onClick={() => setConfirmingDeleteId(null)}
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
