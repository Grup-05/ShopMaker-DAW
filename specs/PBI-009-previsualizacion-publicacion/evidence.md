# Evidencia TDD y Cierre — PBI-009 Motor de renderizado sanitizado mobile-first, previsualización aislada y publicación de web

## 1. Identificación

| Campo | Valor |
|---|---|
| **PBI** | `PBI-009` (`#81`) |
| **Tareas GitHub** | `#73` (`T01`), `#74` (`T02`), `#75` (`T03`), `#76` (`T04`), `#77` (`T05`), `#78` (`T06`) |
| **Sprint** | `S03` |
| **Rama** | `feature/PBI-009-previsualizacion-publicacion` |
| **Pull Request** | `#82` |
| **Responsable** | Fernando Ruescas (`@Fernis23228`, Product Owner / Dev C) |

---

## 2. Resumen de Ciclos TDD (Rojo → Verde → Refactor)

1. **`T01` (`#73` — Spec SDD):**
   - Commit `8e297ed`: `docs(spec): definir requerimientos, plan tecnico, tareas y matriz de seguridad para PBI-009`
   - Especificación `spec.md`, arquitectura por capas `plan.md` y lista de tareas `tasks.md`.
2. **`T02` (`#74`) y `T04` (`#76` — Tests Rojos):**
   - Commit `e21442f`: `test(preview): anadir pruebas unitarias, componente e integracion para PBI-009`
   - 12 nuevas pruebas automatizadas distribuidas en 3 suites (`siteRenderer.test.ts`, `SitePreviewModal.test.tsx` y `publishSite.test.tsx`).
3. **`T03` (`#75`), `T05` (`#77`) y `T06` (`#78` — Implementación Verde):**
   - Commit `cc3b2fb`: `feat(preview): implementar sanitizador XSS, SiteRenderer, SitePreviewModal y publicacion de web`
   - Dominio puro en `src/features/preview/domain/{previewTypes,htmlSanitizer,siteRenderer}.ts`.
   - Presentación accesible en `src/features/preview/presentation/{SitePreviewModal.tsx,SitePreviewModal.css}`.
   - Extensión de contrato `SitesApiPort.publishSite`, persistencia en `LocalStorageMockApiAdapter.publishSite` e integración en `useSites`, `SiteCard` y `SitesView`.

---

## 3. Matriz de Cobertura de Criterios de Aceptación (100 %)

| Criterio | Descripción | Suite de prueba | Casos verificados | Resultado |
|---|---|---|---|---|
| **CA-01** (`RF-01`, `RF-02`) | Sanitización anti-XSS de `<script>`, `<iframe>`, `on*`, `javascript:`, `vbscript:` y `data:text/html` | `tests/unit/preview/siteRenderer.test.ts` | 3 tests (`escapeHtml`, `sanitizeHtml`, `sanitizeUrl`) | ✅ **VERDE** |
| **CA-02** (`RF-02`) | Generación de documento HTML5 *mobile-first* (`360px`, `@media 768px`, `@media 1280px`) con CSP `default-src 'none'`, bloques y módulos activos | `tests/unit/preview/siteRenderer.test.ts` | 2 tests (documento HTML5/CSP/breakpoints y bloques + módulos con XSS neutralizado) | ✅ **VERDE** |
| **CA-03** (`RF-03`, `RF-04`) | Apertura de `SitePreviewModal` con `role="dialog"`, `aria-modal="true"`, `<iframe sandbox="">`, `srcDoc` y cierre con `Escape` / botón | `tests/unit/preview/SitePreviewModal.test.tsx` y `tests/unit/preview/publishSite.test.tsx` | 3 tests (diálogo + sandbox estricto, cierre por teclado/botón y apertura desde `SiteCard`) | ✅ **VERDE** |
| **CA-04** (`RF-03`) | Conmutador accesible de dispositivos (`Móvil 360px`, `Tablet 768px`, `Escritorio 1280px`) con `aria-pressed` y cambio dinámico de ancho | `tests/unit/preview/SitePreviewModal.test.tsx` | 1 test de interacción con los 3 viewports | ✅ **VERDE** |
| **CA-05** (`RF-05`) | Flujo «Publicar Web» (`draft` → `published`), persistencia en `localStorage` y actualización del badge «Publicado» en Dashboard | `tests/unit/preview/publishSite.test.tsx` | 2 tests (persistencia en `LocalStorageMockApiAdapter` y publicación desde `SitesView`) | ✅ **VERDE** |
| **CA-06** (`RF-05`) | Manejo de error de red al publicar con alerta accesible (`role="alert"`) conservando el estado `Borrador` | `tests/unit/preview/publishSite.test.tsx` | 1 test con doble de prueba fallido | ✅ **VERDE** |

---

## 4. Resultado de las Puertas de Calidad

- `npm run typecheck`: **0 errores**
- `npm run lint`: **0 errores**
- `npm test`: **23 archivos en verde / 119 tests pasados (119/119)**
- `npm run build`: **Compilación de producción limpia (`dist/`)**
- `bash scripts/github/pre-pr-gate.sh --pre-pr`: **5/5 puertas superadas**
