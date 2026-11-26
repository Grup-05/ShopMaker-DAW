# Spec — PBI-009 Motor de renderizado sanitizado mobile-first, previsualización aislada multi-dispositivo (iframe sandbox) y publicación de web

> Especificación SDD (Specification Driven Development) para el motor de renderizado seguro, visor de previsualización aislado y flujo de publicación de sitios web del CMS ShopMaker.

## Metadatos

| Campo | Valor |
|---|---|
| PBI | `PBI-009` (`#81`) |
| Tareas GitHub | `#73` (T01), `#74` (T02), `#75` (T03), `#76` (T04), `#77` (T05), `#78` (T06) |
| Sprint | `S03` |
| Prioridad | Alta |
| Estado | En especificación / En progreso |
| Rama | `feature/PBI-009-previsualizacion-publicacion` |

---

## 1. Contexto y problema

Una vez que el usuario crea un sitio web en el Dashboard (`PBI-006`) y configura sus bloques o módulos activos, necesita:

1. **Generar una salida HTML/CSS *mobile-first*** segura y libre de XSS a partir de los metadatos del sitio, bloques de contenido y módulos activos.
2. **Previsualizar la web generada de forma aislada** mediante un `<iframe sandbox>` antes de publicarla, comprobando su apariencia en móvil (`360px`), tablet (`768px`) y escritorio (`1280px`).
3. **Publicar la web** (`draft` → `published`) desde el flujo de previsualización o desde la tarjeta del sitio, con confirmación accesible, estado de carga, manejo de errores con reintento y persistencia en `SitesApiPort` / `LocalStorageMockApiAdapter`.

---

## 2. Historias de usuario y flujos

### Historia 1 (Renderizado sanitizado mobile-first)
**Como** usuario del CMS,  
**quiero** que el motor `SiteRenderer` genere HTML/CSS *mobile-first* sanitizando cualquier entrada peligrosa,  
**para** visualizar mi sitio en distintos dispositivos sin riesgo de ejecución de scripts (XSS).

### Historia 2 (Previsualización aislada multi-dispositivo)
**Como** usuario del CMS,  
**quiero** abrir un visor modal `SitePreviewModal` con `<iframe sandbox>` y selector de dispositivo (Móvil 360px, Tablet 768px, Escritorio 1280px),  
**para** inspeccionar el diseño responsive de mi web con seguridad y accesibilidad por teclado.

### Historia 3 (Publicación de la web)
**Como** usuario del CMS,  
**quiero** publicar una web en estado `Borrador` para pasarla a `Publicado`,  
**para** dejarla lista y persistida con feedback claro de éxito o error.

---

## 3. Requerimientos funcionales

| ID | Requerimiento | Prioridad |
|---|---|---|
| RF-01 | **Sanitizador anti-XSS:** Neutralizar etiquetas peligrosas (`<script>`, `<iframe>`, `<object>`, `<embed>`, `<style>`, `<link>`, `<meta>`, `<base>`, `<form>`), manejadores `on*` y esquemas inseguros (`javascript:`, `vbscript:`, `data:text/html`), además de escapar texto plano en metadatos y atributos. | Alta |
| RF-02 | **Motor `SiteRenderer` mobile-first:** Generar un documento HTML5 completo con `<meta name="viewport">`, CSP restrictiva en cabecera (`default-src 'none'`), estilos base *mobile-first* (`360px`) y *media queries* para `768px` y `1280px`, renderizando título, subdominio, bloques de contenido y módulos activos. | Alta |
| RF-03 | **Visor `SitePreviewModal` aislado:** Renderizar la web dentro de `<iframe sandbox="">` mediante `srcDoc`, con `role="dialog"`, `aria-modal="true"`, cierre por botón o tecla `Escape`, y selector accesible de dispositivos (`360px`, `768px`, `1280px`) con `aria-pressed`. | Alta |
| RF-04 | **Acción «Previsualizar» en Dashboard:** Añadir botón accesible «Previsualizar» en `SiteCard` y `SitesView` que abre `SitePreviewModal` para el sitio seleccionado. | Alta |
| RF-05 | **Flujo «Publicar Web»:** Añadir `publishSite(id)` en `SitesApiPort` y `LocalStorageMockApiAdapter`, botón «Publicar Web» (en `SiteCard` y/o `SitePreviewModal`) con confirmación, estado de carga, transición `draft` → `published`, actualización de la lista y manejo de error con reintento. | Alta |

---

## 4. Requerimientos no funcionales y matriz de seguridad

| ID | Categoría | Requerimiento |
|---|---|---|
| RNF-01 | Seguridad | `<iframe sandbox="">` sin `allow-scripts` ni `allow-same-origin` ni `allow-top-navigation`; sanitización previa en dominio antes de generar `srcDoc`; prohibido `eval` o `new Function`. |
| RNF-02 | Accesibilidad | WCAG 2.1 AA: `role="dialog"`, `aria-modal="true"`, `aria-labelledby`, cierre con `Escape`, `aria-pressed` en selector de dispositivos y foco visible. |
| RNF-03 | Arquitectura | `htmlSanitizer` y `siteRenderer` en `domain/` sin dependencias de React ni navegador; `SitePreviewModal` en `presentation/` sin llamadas directas a infraestructura. |
| RNF-04 | Responsive | La web generada aplica *mobile-first* con breakpoints `360px`, `768px` y `1280px`; el CMS soporta viewport mínimo `1024×720`. |

---

## 5. Criterios de aceptación

| ID | Criterio (Dado / Cuando / Entonces) | RF asociado |
|---|---|---|
| CA-01 | **Dado** contenido con `<script>`, `onerror=` o `javascript:` **Cuando** se pasa por el sanitizador y `SiteRenderer` **Entonces** el HTML resultante elimina las etiquetas/atributos peligrosos y no contiene scripts ejecutables. | RF-01, RF-02 |
| CA-02 | **Dado** un sitio con o sin bloques y módulos **Cuando** `SiteRenderer` genera el documento **Entonces** devuelve HTML5 válido con estilos *mobile-first* (`768px`, `1280px`) y el nombre/contenido del sitio. | RF-02 |
| CA-03 | **Dado** un sitio en `SitesView` **Cuando** el usuario pulsa «Previsualizar» **Entonces** se abre `SitePreviewModal` con `role="dialog"`, `aria-modal="true"` y un `<iframe>` con atributo `sandbox=""` y `srcDoc` renderizado. | RF-03, RF-04 |
| CA-04 | **Dado** el visor abierto **Cuando** el usuario selecciona «Móvil», «Tablet» o «Escritorio» **Entonces** el contenedor del `iframe` actualiza su ancho (`360px`, `768px`, `1280px`) y el botón activo marca `aria-pressed="true"`. | RF-03 |
| CA-05 | **Dado** un sitio en estado `draft` («Borrador») **Cuando** el usuario ejecuta «Publicar Web» y confirma **Entonces** se invoca `SitesApiPort.publishSite(id)`, el estado cambia a `published` («Publicado») y persiste tras recargar. | RF-05 |
| CA-06 | **Dado** un fallo de red al publicar **Cuando** `publishSite` rechaza **Entonces** se muestra una alerta accesible con opción de reintento y el sitio conserva su estado `draft`. | RF-05 |

---

## 6. Fuera de alcance

- Despliegue real en DNS/hosting externo (`PBI-010`).
- Edición interactiva de bloques (`PBI-008`).
