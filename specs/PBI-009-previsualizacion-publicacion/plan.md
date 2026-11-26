# Plan Técnico — PBI-009 Previsualización aislada y publicación de web

## 1. Arquitectura por capas

```text
src/
├── domain/ports/
│   └── SitesApiPort.ts                   # + publishSite?(id: string): Promise<SiteDto>
├── infrastructure/api/mock/
│   └── LocalStorageMockApiAdapter.ts     # + publishSite(id: string): Promise<SiteDto>
├── features/preview/
│   ├── domain/
│   │   ├── previewTypes.ts               # SiteBlock, DeviceViewport, VIEWPORT_PRESETS, SiteRenderInput
│   │   ├── htmlSanitizer.ts              # escapeHtml, sanitizeUrl, sanitizeHtml
│   │   └── siteRenderer.ts               # renderSiteDocument(input)
│   └── presentation/
│       ├── SitePreviewModal.tsx          # Modal accesible + selector de dispositivo + iframe sandbox + botón Publicar
│       └── SitePreviewModal.css          # Estilos con tokens semánticos
└── features/dashboard/
    ├── application/useSites.ts           # + publishSite(id)
    └── presentation/
        ├── SiteCard.tsx                  # + botón Previsualizar + botón Publicar Web
        └── SitesView.tsx                 # Integración de SitePreviewModal y estado de publicación
```

## 2. Decisiones técnicas

1. **Sanitización pura en dominio:** `htmlSanitizer.ts` y `siteRenderer.ts` no importan `react` ni APIs del DOM del navegador, garantizando portabilidad y pruebas unitarias rápidas.
2. **Aislamiento estricto del `iframe`:** `<iframe sandbox="" srcDoc={html} />` bloquea scripts, formularios, navegación superior y acceso al origen padre.
3. **Compatibilidad hacia atrás de `SitesApiPort`:** `publishSite` se define como método opcional en la interfaz para no romper dobles de prueba existentes en `PBI-006`, implementado de forma obligatoria en `LocalStorageMockApiAdapter`.

## 3. Matriz de trazabilidad spec-test

| ID | Requerimiento / Criterio | Tipo de prueba | Archivo de test | Estado |
|---|---|---|---|---|
| RF-01 / CA-01 | Sanitizador anti-XSS (`<script>`, `on*`, `javascript:`) | Unitaria | `tests/unit/preview/siteRenderer.test.ts` | Verde |
| RF-02 / CA-02 | Motor `SiteRenderer` mobile-first (bloques, módulos, fallback) | Unitaria | `tests/unit/preview/siteRenderer.test.ts` | Verde |
| RF-03 / CA-03 | `SitePreviewModal` accesible con `<iframe sandbox="">` y `Escape` | Componente | `tests/unit/preview/SitePreviewModal.test.tsx` | Verde |
| RF-03 / CA-04 | Conmutador de viewports (`360px`, `768px`, `1280px`) y `aria-pressed` | Componente | `tests/unit/preview/SitePreviewModal.test.tsx` | Verde |
| RF-04 / CA-03 | Botón «Previsualizar» en `SiteCard`/`SitesView` abre visor | Integración / UI | `tests/unit/preview/publishSite.test.tsx` | Verde |
| RF-05 / CA-05 | Flujo «Publicar Web» (`draft` → `published`) y persistencia | Integración / UI | `tests/unit/preview/publishSite.test.tsx` | Verde |
| RF-05 / CA-06 | Manejo de error al publicar con alerta accesible y reintento | Integración / UI | `tests/unit/preview/publishSite.test.tsx` | Verde |
