# Plan Técnico — PBI-008 Motor de edición visual de webs por bloques, inspector de propiedades y autoguardado de borradores

## 1. Arquitectura por capas (SOLID y Hexagonal)

```text
src/
├── domain/ports/
│   ├── SitesApiPort.ts                   # + SiteBlockType, SiteBlockDto, SiteDraftDto, getSiteDraft?, saveSiteDraft?
│   └── ModulesApiPort.ts                 # + ModuleManifestDto, getInstalledModules?, registerModule?
├── infrastructure/api/mock/
│   ├── mockFixtures.ts                   # + draftsBySite en MockDatabaseState
│   └── LocalStorageMockApiAdapter.ts     # + getSiteDraft, saveSiteDraft, getInstalledModules, registerModule
├── features/editor/
│   ├── domain/
│   │   └── EditorBlock.ts                # Paleta estructural y operaciones puras inmutables sobre árboles de bloques
│   ├── application/
│   │   └── useEditor.ts                  # Caso de uso React: carga, selección, operaciones y autoguardado persistente
│   └── presentation/
│       ├── BlockPalette.tsx              # Paleta accesible de bloques estructurales y módulos instalados
│       ├── EditorCanvas.tsx              # Lienzo de bloques con selección, reordenación, duplicación y borrado confirmado
│       ├── InspectorPanel.tsx            # Formulario lateral de edición en tiempo real de propiedades del bloque activo
│       ├── EditorPage.tsx                # Vista principal /editor/:siteId + indicador autoguardado + SitePreviewModal
│       └── EditorPage.css                # Layout desktop-first (1280×800 / min 1024×720) con tokens CSS semánticos
├── features/preview/domain/
│   ├── previewTypes.ts                   # Sincronización con los nuevos tipos de bloque (hero, features, footer, module)
│   └── siteRenderer.ts                   # Renderizado HTML5/CSS mobile-first de todos los tipos de bloque del editor
└── app/
    └── App.tsx                           # Ruta protegida /editor/:siteId y navegación desde DashboardPage
```

---

## 2. Decisiones técnicas

1. **Operaciones de dominio puras e inmutables (`EditorBlock.ts`):**
   - `EditorBlock.ts` no importa React, ni `localStorage`, ni infraestructura. Todas las transformaciones (`addBlockToCanvas`, `moveBlockInCanvas`, `duplicateBlockInCanvas`, `removeBlockFromCanvas`, `updateBlockProperties`) devuelven nuevas listas inmutables `readonly SiteBlockDto[]`, facilitando pruebas unitarias instantáneas.
2. **Retrocompatibilidad de puertos (`SitesApiPort` y `ModulesApiPort`):**
   - Los nuevos métodos (`getSiteDraft`, `saveSiteDraft`, `getInstalledModules`, `registerModule`) se declaran opcionales en las interfaces de puerto para no romper dobles de prueba unitarios de `PBI-006` y `PBI-009`, y se implementan de forma completa y determinista en `LocalStorageMockApiAdapter`.
3. **Integración nativa con `PBI-009` (`SiteRenderer` y `SitePreviewModal`):**
   - `SiteRenderer` se amplía para renderizar los bloques estructurales del editor (`hero`, `text`, `features`, `footer`) y los bloques de módulos instalados (`module`), además de los tipos base (`heading`, `image`, `separator`).
   - El botón «Previsualizar» dentro de `EditorPage` abre `SitePreviewModal` pasando los bloques vivos del lienzo y los módulos instalados del sitio.

---

## 3. Matriz de trazabilidad Spec-Test (100 % cobertura de Criterios)

| ID | Requerimiento / Criterio | Nivel de prueba | Archivo de test | Identificador de test | Estado |
|---|---|---|---|---|---|
| **RF-01 / CA-01, CA-04** | Contratos `getSiteDraft`, `saveSiteDraft`, `getInstalledModules` en `LocalStorageMockApiAdapter` | Integración / Contrato | `tests/unit/editor/editorAutosave.test.tsx` | `[PBI-008][CA-04] editor-autosave-draft-recovery` | Verde |
| **RF-02, RF-03, RF-04 / CA-01, CA-02** | Operaciones puras e interfaz del lienzo: añadir bloques base y de módulos, reordenar arriba/abajo, duplicar y eliminar con confirmación | Unitaria + Componente | `tests/unit/editor/editorBlocks.test.ts` y `tests/unit/editor/EditorPage.test.tsx` | `[PBI-008][CA-01] editor-block-operations` | Verde |
| **RF-05 / CA-03** | Selección de bloque y edición en tiempo real en el Inspector de Propiedades (`Título`, `Subtítulo`, `Contenido`, `CTA`) | Componente | `tests/unit/editor/EditorPage.test.tsx` | `[PBI-008][CA-02] editor-inspector-properties` | Verde |
| **RF-06 / CA-04** | Autoguardado automático al editar, anuncio accesible `role="status"` (`aria-live="polite"`) y recuperación al desmontar y reabrir `/editor/:siteId` | Componente + Integración | `tests/unit/editor/editorAutosave.test.tsx` | `[PBI-008][CA-03] editor-autosave-draft-recovery` | Verde |
