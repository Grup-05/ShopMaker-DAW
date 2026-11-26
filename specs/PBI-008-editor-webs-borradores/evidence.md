# Evidencia TDD y Cierre — PBI-008 Motor de edición visual de webs por bloques, inspector de propiedades y autoguardado de borradores

## 1. Identificación

| Campo | Valor |
|---|---|
| **PBI** | `PBI-008` (`#79`) |
| **Tareas GitHub** | `#61` (`T01`), `#62` (`T02`), `#63` (`T03`), `#64` (`T04`), `#65` (`T05`), `#66` (`T06`) |
| **Sprint** | `S03` |
| **Rama** | `feature/PBI-008-editor-webs-borradores` |
| **Responsable** | Francisco Tomás (`@FSolaje`, Scrum Master / Dev A) |

---

## 2. Resumen de Ciclos TDD (Rojo → Verde → Refactor)

1. **`T01` (`#61` — Especificación SDD y Contratos de Puertos):**
   - Especificación `spec.md`, arquitectura por capas `plan.md` y lista de tareas `tasks.md` en `specs/PBI-008-editor-webs-borradores/`.
   - Ampliación retrocompatible de `SitesApiPort` (`SiteBlockType`, `SiteBlockDto`, `SiteDraftDto`, `getSiteDraft`, `saveSiteDraft`), `ModulesApiPort` (`ModuleManifestDto`, `getInstalledModules`, `registerModule`) y `LocalStorageMockApiAdapter`.
2. **`T02` (`#62`) y `T05` (`#65` — Fase Roja TDD):**
   - Verificación en rojo inicial de `tests/unit/editor/editorBlocks.test.ts`, `tests/unit/editor/EditorPage.test.tsx` y `tests/unit/editor/editorAutosave.test.tsx` (10 nuevas pruebas automatizadas).
3. **`T03` (`#63`), `T04` (`#64`) y `T06` (`#66` — Fase Verde e Integración):**
   - Dominio puro inmutable en `src/features/editor/domain/EditorBlock.ts`.
   - Caso de uso React y autoguardado persistente en `src/features/editor/application/useEditor.ts`.
   - Componentes accesibles en `src/features/editor/presentation/{BlockPalette,EditorCanvas,InspectorPanel,EditorPage}.tsx` y estilos con tokens semánticos en `EditorPage.css`.
   - Ruta protegida `/editor/:siteId` en `src/app/App.tsx`, navegación desde «Editar» en `DashboardPage.tsx` e integración con `SitePreviewModal` y `SiteRenderer` (`PBI-009`).

---

## 3. Matriz de Cobertura de Criterios de Aceptación (100 %)

| Criterio | Descripción | Suite de prueba | Casos verificados | Resultado |
|---|---|---|---|---|
| **CA-01** (`RF-01`, `RF-02`, `RF-03`) | Navegación desde «Editar» en Dashboard a `/editor/:siteId`, extensión de puertos (`SitesApiPort`, `ModulesApiPort`) y carga de paleta estructural + módulos instalados | `tests/unit/editor/editorBlocks.test.ts` y `tests/unit/editor/EditorPage.test.tsx` | 3 tests (paleta base, creación de bloques estructurales/módulos y navegación desde `DashboardPage`) | ✅ **VERDE** |
| **CA-02** (`RF-03`, `RF-04`) | Operaciones en el lienzo: añadir bloques base y de módulos instalados, reordenar arriba/abajo, duplicar y eliminar con confirmación cuando contiene datos | `tests/unit/editor/editorBlocks.test.ts` y `tests/unit/editor/EditorPage.test.tsx` | 4 tests (reordenación en límites, duplicación, borrado y flujo UI con confirmación accesible) | ✅ **VERDE** |
| **CA-03** (`RF-05`) | Selección de bloque y edición en tiempo real en el Inspector de Propiedades (`Título del bloque`, `Subtítulo secundario`, `Contenido del bloque`, `Texto del botón CTA`) | `tests/unit/editor/editorBlocks.test.ts` y `tests/unit/editor/EditorPage.test.tsx` | 2 tests (actualización inmutable y edición interactiva en `InspectorPanel`) | ✅ **VERDE** |
| **CA-04** (`RF-01`, `RF-06`) | Autoguardado automático en `localStorage` (`saveSiteDraft`), anuncio accesible `role="status"` (`"Borrador guardado automáticamente"`), recuperación al reabrir `/editor/:siteId` y previsualización en `<iframe sandbox="">` | `tests/unit/editor/editorAutosave.test.tsx` | 2 tests (ciclo completo de autoguardado + remount con nueva instancia del adaptador, y apertura de `SitePreviewModal`) | ✅ **VERDE** |

---

## 4. Resultado de las Puertas de Calidad

- `npm run typecheck`: **0 errores**
- `npm run lint`: **0 errores**
- `npm test`: **26 archivos en verde / 129 tests pasados (129/129)**
- `npm run build`: **Compilación de producción limpia (`dist/`)**
- `bash scripts/github/pre-pr-gate.sh --pre-pr`: **5/5 puertas superadas**
