# ADR-011 — Motor de edición inmutable por bloques, previsualización aislada en `<iframe sandbox="">` y sanitización en dominio

## Metadatos

| Campo | Valor |
|---|---|
| ID | `ADR-011` |
| Fecha | 2026-11-26 |
| Estado | Aceptado |
| Sprint / PBI | S03 · `PBI-008` (`#79`) y `PBI-009` (`#81`) |
| Decisores | Equipo Grup-05 (`@FSolaje` para `PBI-008`; `@Fernis23228` para `PBI-009`) |
| Registro | Original (incorporado en la PR `#83` de `PBI-008`, cubriendo también `PBI-009` de PR `#82`) |
| Sustituye a | — |
| Sustituido por | — |

## Contexto

En el Sprint S03 ShopMaker pasa de ser un panel de gestión a permitir diseñar páginas web reales con bloques y módulos, previsualizarlas en distintos dispositivos y publicarlas. Estas capacidades afectan a varias features (`dashboard`, `editor`, `preview`, `domain/ports`, `infrastructure/api/mock`) e implican requisitos estrictos de seguridad (`profile-uiux.md` §4: cero `eval`, sanitización anti-XSS y aislamiento en `iframe sandbox`) y diseño *mobile-first* (`360px`, `768px`, `1280px`) para las webs generadas.

## Decisión

1. **Modelo de bloques compartido y retrocompatible en `src/domain/ports/SitesApiPort.ts`:**
   - Se definen `SiteBlockType` (`hero`, `text`, `features`, `footer`, `module`, `heading`, `image`, `separator`), `SiteBlockDto` y `SiteDraftDto`.
   - Se amplía `SitesApiPort` con métodos opcionales (`publishSite?`, `getSiteDraft?`, `saveSiteDraft?`) y `ModulesApiPort` con `ModuleManifestDto`, `getInstalledModules?` y `registerModule?` para no romper dobles de prueba previos (`PBI-006`) mientras `LocalStorageMockApiAdapter` los implementa todos.
2. **Operaciones puras e inmutables en dominio (`src/features/editor/domain/EditorBlock.ts`):**
   - Toda manipulación del árbol de bloques (`add`, `move`, `duplicate`, `remove`, `update`) es pura e inmutable, sin dependencias de React ni del DOM.
   - `useEditor.ts` coordina carga, selección y autoguardado automático en `saveSiteDraft` con anuncio accesible (`role="status"`, `aria-live="polite"`).
3. **Sanitización anti-XSS y renderizado *mobile-first* en dominio (`src/features/preview/domain/`):**
   - `htmlSanitizer.ts` neutraliza etiquetas peligrosas (`<script>`, `<iframe>`, `<object>`, `<embed>`, `<style>`, `<link>`, `<meta>`, `<base>`, `<form>`, `<svg>`), atributos `on*` y esquemas `javascript:` / `vbscript:` / `data:`.
   - `siteRenderer.ts` genera HTML5 completo con CSP `default-src 'none'; style-src 'unsafe-inline'; img-src https: http: data:;` y estilos *mobile-first* (`360px` base, `@media (min-width: 768px)`, `@media (min-width: 1280px)`).
4. **Aislamiento estricto en `SitePreviewModal`:**
   - Se renderiza mediante `<iframe sandbox="" srcDoc={renderedHtml} />` sin `allow-scripts` ni `allow-same-origin`, con selector accesible de viewports (`360px`, `768px`, `1280px`) reutilizable desde `SitesView` y desde `/editor/:siteId`.

## Alternativas consideradas

| Alternativa | Ventajas | Inconvenientes | Motivo de descarte |
|---|---|---|---|
| Renderizar HTML del usuario con `dangerouslySetInnerHTML` en el DOM del CMS | Más simple de estilizar | Riesgo alto de XSS y fuga de estilos del CMS | Viola `profile-uiux.md` §4.4 (exige `iframe` con `sandbox`) |
| Editor basado en librería pesada (`GrapesJS` / `Craft.js`) | Muchas funciones listas | Dependencia grande, difícil de testear con TDD y accesibilidad AA | Incumple KISS/YAGNI; el modelo propio inmutable es 100 % testeable y accesible |
| Métodos obligatorios en `SitesApiPort` desde el primer día | Contrato más rígido | Rompería los dobles de prueba de `PBI-006` | Los métodos opcionales en el puerto con implementación completa en el adaptador mantienen retrocompatibilidad |

## Consecuencias

- Positivas: `EditorPage` y `SitePreviewModal` comparten el mismo `SiteBlockDto`; el cliente ve en vivo sus bloques sanitizados en móvil/tablet/escritorio; cero dependencias externas nuevas.
- Negativas o deuda asumida: el sanitizador propio basado en expresiones regulares es adecuado para el entorno académico con `<iframe sandbox="">` + CSP `default-src 'none'`, pero ante un paso a producción real con HTML rico debería sustituirse por un parser DOM probado (ej. DOMPurify).
- Impacto en pruebas: `tests/unit/preview/*` (12 tests) y `tests/unit/editor/*` (10 tests).
- Impacto en accesibilidad y seguridad: confirmación accesible al borrar bloques con contenido, foco visible, `role="status"` y doble barrera anti-XSS (sanitizador + `sandbox=""` + CSP).

## Referencias

- `specs/PBI-008-editor-webs-borradores/` · Issues `#79`, `#61`–`#66` · PR `#83`
- `specs/PBI-009-previsualizacion-publicacion/` · Issues `#81`, `#73`–`#78` · PR `#82`
