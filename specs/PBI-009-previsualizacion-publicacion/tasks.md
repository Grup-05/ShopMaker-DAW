# Tareas TDD — PBI-009 Previsualización aislada y publicación de web

- [x] **T01 (`#73`)**: Redactar `spec.md`, `plan.md`, `tasks.md` y matriz de seguridad/trazabilidad para PBI-009.
- [x] **T02 (`#74`)**: Test rojo — sanitizador anti-XSS y motor `SiteRenderer` HTML/CSS *mobile-first* (`tests/unit/preview/siteRenderer.test.ts`).
- [x] **T03 (`#75`)**: Implementar `previewTypes.ts`, `htmlSanitizer.ts` y `siteRenderer.ts` hasta poner en verde T02.
- [x] **T04 (`#76`)**: Test rojo — visor `SitePreviewModal` con `<iframe sandbox>` y conmutador de viewports (`tests/unit/preview/SitePreviewModal.test.tsx`).
- [x] **T05 (`#77`)**: Implementar `SitePreviewModal.tsx` y `SitePreviewModal.css` hasta poner en verde T04.
- [x] **T06 (`#78`)**: TDD flujo «Publicar Web» (`Borrador` → `Publicado`) en `SitesApiPort`, `LocalStorageMockApiAdapter`, `useSites`, `SiteCard` y `SitesView` (`tests/unit/preview/publishSite.test.tsx`), y registrar evidencia final.
