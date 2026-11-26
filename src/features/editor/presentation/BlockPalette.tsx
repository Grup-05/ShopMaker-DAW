import type { ModuleDto } from '../../../domain/ports';
import {
  STRUCTURAL_BLOCK_PALETTE,
  type StructuralBlockType,
} from '../domain/EditorBlock';

export interface BlockPaletteProps {
  readonly installedModules: readonly ModuleDto[];
  readonly onAddStructuralBlock: (type: StructuralBlockType) => void;
  readonly onAddModuleBlock: (module: ModuleDto) => void;
}

export function BlockPalette({
  installedModules,
  onAddStructuralBlock,
  onAddModuleBlock,
}: BlockPaletteProps) {
  return (
    <aside
      className="editor-palette"
      role="region"
      aria-label="Paleta de bloques"
    >
      <div className="editor-palette__section">
        <h2 className="editor-palette__heading">Bloques estructurales</h2>
        <p className="editor-palette__hint">
          Pulsa sobre un bloque para añadirlo al lienzo de la página.
        </p>
        <ul className="editor-palette__list">
          {STRUCTURAL_BLOCK_PALETTE.map((item) => (
            <li key={item.type} className="editor-palette__item">
              <button
                type="button"
                className="editor-palette__btn"
                aria-label={`Añadir bloque ${item.label}`}
                onClick={() => onAddStructuralBlock(item.type)}
              >
                <span className="editor-palette__btn-title">
                  + {item.label}
                </span>
                <span className="editor-palette__btn-desc">
                  {item.description}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="editor-palette__section">
        <h2 className="editor-palette__heading">Módulos instalados</h2>
        {installedModules.length === 0 ? (
          <p className="editor-palette__empty">
            No hay módulos instalados en este sitio todavía.
          </p>
        ) : (
          <ul className="editor-palette__list">
            {installedModules.map((mod) => (
              <li key={mod.id} className="editor-palette__item">
                <button
                  type="button"
                  className="editor-palette__btn editor-palette__btn--module"
                  aria-label={`Añadir módulo ${mod.name}`}
                  onClick={() => onAddModuleBlock(mod)}
                >
                  <span className="editor-palette__btn-title">
                    + {mod.name}
                  </span>
                  <span className="editor-palette__btn-desc">
                    v{mod.version} · {mod.category}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </aside>
  );
}
