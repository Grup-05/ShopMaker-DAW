# Tareas TDD — PBI-008 Motor de edición visual de webs por bloques, inspector de propiedades y autoguardado de borradores

- [x] **T01 (`#61`)**: Redactar `spec.md`, `plan.md`, `tasks.md` y extender contratos de puertos (`SitesApiPort`, `ModulesApiPort`) y `LocalStorageMockApiAdapter` para bloques, borradores y manifiestos.
- [x] **T02 (`#62`)**: Test rojo — modelo del lienzo de bloques y operaciones (añadir bloques base y de módulos, reordenar arriba/abajo, duplicar y eliminar con confirmación) en `tests/unit/editor/editorBlocks.test.ts` y `tests/unit/editor/EditorPage.test.tsx`.
- [x] **T03 (`#63`)**: Implementar modelo puro `src/features/editor/domain/EditorBlock.ts` y caso de uso `src/features/editor/application/useEditor.ts`.
- [x] **T04 (`#64`)**: Implementar vista `/editor/:siteId` (`BlockPalette.tsx`, `EditorCanvas.tsx`, `InspectorPanel.tsx`, `EditorPage.tsx`, `EditorPage.css`), conectar ruta en `App.tsx` y botón «Editar» en `DashboardPage.tsx`.
- [x] **T05 (`#65`)**: Test rojo — autoguardado de borradores en `localStorage` / `SitesApiPort`, indicador accesible `role="status"` y recuperación al reabrir en `tests/unit/editor/editorAutosave.test.tsx`.
- [x] **T06 (`#66`)**: Implementar autoguardado persistente de borradores, integración con `SitePreviewModal` y registrar evidencia TDD en `specs/PBI-008-editor-webs-borradores/evidence.md`.
