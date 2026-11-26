# Spec — PBI-008 Motor de edición visual de webs por bloques, inspector de propiedades y autoguardado de borradores

> Especificación SDD (Specification Driven Development) para el editor visual por bloques (`/editor/:siteId`), inspector lateral de propiedades editables en tiempo real y autoguardado persistente de borradores del CMS ShopMaker.

## Metadatos

| Campo | Valor |
|---|---|
| **PBI** | `PBI-008` (`#79`) |
| **Tareas GitHub** | `#61` (`T01`), `#62` (`T02`), `#63` (`T03`), `#64` (`T04`), `#65` (`T05`), `#66` (`T06`) |
| **Sprint** | `S03` |
| **Prioridad** | Alta |
| **Estimación** | `30 h` |
| **Responsable** | Francisco Tomás (`@FSolaje`, Scrum Master / Dev A) |
| **Rama** | `feature/PBI-008-editor-webs-borradores` |

---

## 1. Contexto y problema

Tras autenticarse (`PBI-005`) y gestionar sus sitios web en el Dashboard (`PBI-006`), el usuario propietario de un sitio necesita una herramienta visual para **construir y personalizar la estructura y el contenido de su página web** antes de previsualizarla y publicarla (`PBI-009`).

El motor de edición debe permitir:
1. **Ampliar los contratos de dominio (`SitesApiPort` y `ModulesApiPort`)** y el adaptador mock persistente (`LocalStorageMockApiAdapter`) para soportar bloques (`SiteBlockDto`), borradores (`SiteDraftDto`), módulos instalados por sitio y manifiestos declarativos (`ModuleManifestDto`).
2. **Acceder a `/editor/:siteId`** al pulsar el botón «Editar» de cualquier tarjeta de sitio en el Dashboard.
3. **Añadir bloques estructurales** (`hero`, `text`, `features`, `footer`) y **bloques de módulos instalados** desde la paleta lateral al lienzo de la página.
4. **Reordenar (subir/bajar), duplicar y eliminar bloques** (con confirmación accesible cuando el bloque contiene datos) tanto con ratón como con teclado.
5. **Inspeccionar y editar en tiempo real** las propiedades del bloque seleccionado (título, subtítulo, contenido, texto CTA) en el Inspector Lateral.
6. **Autoguardar automáticamente el borrador** en `localStorage` a través del puerto de infraestructura con un indicador accesible (`role="status"`, `aria-live="polite"`) y recuperar el borrador al recargar o reabrir el editor.

---

## 2. Historias de usuario y flujos

### Historia 1 (Lienzo de bloques y paleta)
**Como** usuario propietario de un sitio web en ShopMaker,  
**quiero** abrir `/editor/:siteId` desde el Dashboard y añadir bloques estructurales o de módulos instalados al lienzo, pudiendo reordenarlos, duplicarlos o eliminarlos con confirmación,  
**para** estructurar visualmente las secciones de mi página web con teclado o ratón.

### Historia 2 (Inspector de propiedades en tiempo real)
**Como** usuario que edita un sitio web,  
**quiero** seleccionar cualquier bloque del lienzo y modificar sus textos y configuración en un inspector lateral con reflejo inmediato en el lienzo,  
**para** personalizar el contenido de cada sección de forma rápida e intuitiva.

### Historia 3 (Autoguardado y recuperación de borradores)
**Como** usuario del editor de webs,  
**quiero** que cada cambio en los bloques se autoguarde de forma persistente y muestre un estado accesible de guardado,  
**para** no perder mi trabajo si recargo el navegador o vuelvo más tarde al editor.

---

## 3. Requerimientos funcionales

| ID | Requerimiento | Prioridad |
|---|---|---|
| **RF-01** | **Extensión de contratos y persistencia mock:** Ampliar `SitesApiPort` (`SiteBlockDto`, `SiteDraftDto`, `getSiteDraft`, `saveSiteDraft`) y `ModulesApiPort` (`ModuleManifestDto`, `getInstalledModules`, `registerModule`) e implementarlos en `LocalStorageMockApiAdapter`. | Alta |
| **RF-02** | **Navegación y ruta protegida `/editor/:siteId`:** Conectar el botón «Editar» de `SiteCard` en el Dashboard con `/editor/:siteId` (protegida por `GuardedRoute`) y permitir regresar al Dashboard. | Alta |
| **RF-03** | **Paleta de bloques base y módulos instalados (`BlockPalette`):** Mostrar bloques estructurales (`Hero / Portada`, `Bloque de Texto`, `Características`, `Pie de Página`) y los módulos instalados en el sitio activo para insertarlos en el lienzo. | Alta |
| **RF-04** | **Operaciones sobre el lienzo (`EditorCanvas`):** Permitir seleccionar un bloque, moverlo arriba/abajo, duplicarlo y eliminarlo (exigiendo confirmación explícita si el bloque contiene título, subtítulo o contenido). | Alta |
| **RF-05** | **Inspector de propiedades (`InspectorPanel`):** Mostrar un formulario accesible con etiquetas explícitas (`Título del bloque`, `Subtítulo`, `Contenido`, `Texto del botón CTA`) sincronizado en tiempo real con el bloque seleccionado. | Alta |
| **RF-06** | **Autoguardado y recuperación de borradores:** Persistir automáticamente los cambios del árbol de bloques mediante `saveSiteDraft`, anunciar el estado en un indicador con `role="status"` y `aria-live="polite"`, y restaurar el borrador al abrir `/editor/:siteId`, integrándose con `SitePreviewModal` (`PBI-009`). | Alta |

---

## 4. Requerimientos no funcionales

| ID | Categoría | Requerimiento |
|---|---|---|
| **RNF-01** | Arquitectura SOLID | Lógica de manipulación de bloques (`EditorBlock.ts`) pura e inmutable en `domain/`; coordinación y autoguardado en `application/useEditor.ts`; componentes visuales en `presentation/` sin acceso directo a infraestructura. |
| **RNF-02** | Accesibilidad WCAG 2.1 AA | Controles de reordenación, duplicación, borrado con confirmación e inspector 100 % operables por teclado, foco visible (`--color-focus`), etiquetas asociadas y región viva `aria-live="polite"` para el autoguardado. |
| **RNF-03** | Sistema visual y tokens | Uso exclusivo de tokens CSS semánticos (`--color-*`, `--radius`, `--shadow`); prohibido usar colores hexadecimales dispersos en componentes del editor. |
| **RNF-04** | Seguridad | Sin `eval` ni `new Function`; los bloques editados pasan por el motor sanitizado `SiteRenderer` (`PBI-009`) al previsualizar en `<iframe sandbox="">`. |

---

## 5. Criterios de aceptación

| ID | Criterio (Dado / Cuando / Entonces) | RF asociado |
|---|---|---|
| **CA-01** | **Dado** un sitio existente en el Dashboard **Cuando** el usuario pulsa «Editar» en su tarjeta **Entonces** la aplicación navega a `/editor/:siteId` y muestra la barra superior del sitio, la paleta de bloques, el lienzo y el inspector lateral. | RF-01, RF-02, RF-03 |
| **CA-02** | **Dado** el editor abierto en `/editor/:siteId` **Cuando** el usuario añade bloques desde la paleta (estructurales o de módulos instalados), los reordena arriba/abajo, los duplica o elimina un bloque con datos tras confirmar **Entonces** el lienzo refleja el orden y estado exacto de los bloques de forma determinista. | RF-03, RF-04 |
| **CA-03** | **Dado** un bloque seleccionado en el lienzo **Cuando** el usuario modifica su título, subtítulo, contenido o texto CTA en el Inspector Lateral **Entonces** el bloque en el lienzo actualiza sus propiedades en tiempo real. | RF-05 |
| **CA-04** | **Dado** cualquier cambio en los bloques del lienzo o del inspector **Cuando** se actualiza el estado del editor **Entonces** el borrador se autoguarda en `SitesApiPort.saveSiteDraft`, el indicador `role="status"` anuncia «Borrador guardado automáticamente» y, al desmontar y reabrir `/editor/:siteId`, se recuperan todos los bloques guardados. | RF-01, RF-06 |

---

## 6. Estados de interfaz cubiertos

- **Carga:** Indicador accesible mientras se recupera el sitio y su borrador inicial.
- **Vacío:** Guía de acción en el lienzo cuando el sitio aún no tiene bloques y guía en el inspector cuando no hay bloque seleccionado.
- **Confirmación destructiva:** Barra de confirmación accesible antes de eliminar un bloque con contenido.
- **Éxito / Autoguardado:** Indicador `role="status"` (`aria-live="polite"`) con estado `"Guardando borrador..."` / `"Borrador guardado automáticamente"`.
- **Error:** Alerta accesible (`role="alert"`) con opción de reintento si falla la carga o el guardado del borrador.
