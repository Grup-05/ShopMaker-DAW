# Spec — PBI-001 Inicializar la aplicación web y la estructura base

> Borrador de requisitos para la aplicación web base de ShopMaker. Las decisiones confirmadas se reflejan aquí; los puntos aún no definidos se mantienen como preguntas abiertas.

## Metadatos

| Campo | Valor |
|---|---|
| PBI | `PBI-001` |
| Sprint | `S01` |
| Autor | Jesús Hernández (`@Tarrant15`, Dev B) |
| Fecha | 2026-11-09 |
| Estado | En revisión — implementado en T04–T06, en verde; pendiente aprobación humana y rutas de PBI-005 |
| Rama | `feature/PBI-001-aplicacion-web` |

## 1. Contexto y problema

ShopMaker necesita una aplicación web mínima sobre la que construir las siguientes funcionalidades del CMS. La base debe poder ejecutarse en un navegador, organizar el código en capas y permitir verificar su arranque y navegación.

Este incremento corresponde al frontend y se entrega como aplicación web desktop-first. La resolución de referencia es 1280×800 y el viewport mínimo indicado es 1024×720. El producto no requiere una aplicación nativa.

## 2. Historias de usuario y flujos

### Historia principal

**Como** Developer, **quiero** disponer de una aplicación web mínima y de una estructura por capas, **para** construir las features del CMS sobre una base testeable y segura.

### Flujo principal

1. El usuario abre la aplicación web en un navegador compatible.
2. La aplicación muestra la navegación por encima del título «ShopMaker», que se presenta como texto con estilo aplicado mediante CSS. En el futuro, el título podrá sustituirse por una imagen de la marca.
3. La navegación contiene los enlaces «Iniciar sesión» y «Registrarse», además de un botón «Cambiar tema». No hay página de contactos ni enlace a ella. Los destinos de inicio de sesión y registro se coordinarán con PBI-005.
4. En un aside, el usuario ve un botón habilitado pero inerte para crear una página web y la lista de páginas empezadas. Si la lista está vacía, muestra el texto «Ninguna Web en Progreso». El botón recibe foco y puede activarse, pero no ejecuta ninguna acción en este incremento; en el futuro deberá iniciar la creación y abrir el motor de maquetación.
5. La aplicación inicia sin una página seleccionada y el área central muestra «Seleccione una web para visualizar». Al hacer clic en una página de la lista, fuera del botón de maquetación, esa página queda seleccionada y el mensaje desaparece; no se implementa una previsualización en este incremento.
6. Cada página de la lista tiene un botón habilitado pero inerte reservado para abrir el motor de maquetación para esa página en el futuro. Recibe foco y puede activarse, pero en este incremento no ejecuta ninguna acción ni selecciona la página.
7. El usuario puede recorrer la navegación y seleccionar páginas con teclado y ratón, sin que activar el botón de maquetación active también la selección de la página.
8. El botón de tema se muestra en la navegación. PBI-001 implementa su presencia visual; la funcionalidad de alternar entre los modos claro y oscuro corresponde a PBI-002.

### Flujos alternativos y de error

- El PBI no define flujos alternativos ni el comportamiento ante errores de arranque. No se prescribe uno en este borrador.

## 3. Requerimientos funcionales

| ID | Requerimiento | Prioridad |
|---|---|---|
| RF-01 | La aplicación debe arrancar en el navegador y mostrar la navegación por encima del título «ShopMaker», con enlaces «Iniciar sesión» y «Registrarse» y un botón «Cambiar tema»; un aside con el botón para crear páginas y la lista de páginas empezadas (o «Ninguna Web en Progreso» cuando esté vacía); y, antes de seleccionar una página, el texto central «Seleccione una web para visualizar». No hay página ni enlace de contactos. Los enlaces de acceso apuntan a las páginas definidas por PBI-005. El layout debe funcionar a 1280×800 y a 1024×720 sin scroll horizontal. | Alta |
| RF-02 | El código debe estar separado en las capas de presentación, aplicación/estado, dominio e infraestructura. | Alta |
| RF-03 | La navegación incluye los enlaces «Iniciar sesión» y «Registrarse», definidos por PBI-005, y el botón «Cambiar tema» sin comportamiento de cambio implementado por PBI-001. No existe página ni enlace de contactos. Una página se selecciona al activar su control de selección, pero no al activar el botón de maquetación independiente. La navegación y la selección deben poder utilizarse con teclado y ratón. Los botones de crear página y maquetar están visibles, habilitados y reciben foco, pero no ejecutan acciones en este incremento; en el futuro iniciarán la creación o abrirán el motor de maquetación, respectivamente. La selección elimina el mensaje de instrucción pero no carga ni actualiza una previsualización. | Alta |
| RF-04 | Debe existir una prueba de humo E2E que abra la aplicación en navegador y compruebe el título principal «ShopMaker» y los landmarks de navegación, contenido principal y contenido complementario. | Alta |
| RF-05 | La navegación debe mostrar un botón de tema. PBI-001 implementa el botón y su ubicación; PBI-002 implementa la funcionalidad para alternar entre tema claro y oscuro. | Alta |

## 4. Requerimientos no funcionales

| ID | Categoría | Requerimiento |
|---|---|---|
| RNF-01 | Accesibilidad | La base debe respetar WCAG 2.1 AA en lo aplicable a este incremento, incluyendo foco visible, navegación por teclado y contraste. |
| RNF-02 | Compatibilidad y layout | El viewport mínimo objetivo es 1024×720 y la resolución de referencia es 1280×800. Los navegadores objetivo son Chromium actual y Firefox. Safari se incluirá si el equipo dispone de macOS. |
| RNF-03 | Seguridad y entorno | El código cliente no debe acceder a Node ni al sistema de archivos; solo debe usar APIs del navegador. No debe contener secretos. La aplicación debe servirse con CSP estricta en despliegue. Esta spec no fija la configuración ni la validación del hosting. |
| RNF-04 | Accesibilidad | El contenido y la funcionalidad deben seguir disponibles con zoom del navegador al 200 %, según ADR-001 y ADR-002. |

## 5. Criterios de aceptación

| ID | Criterio | RF asociado |
|---|---|---|
| CA-01 | Dado un navegador compatible, cuando se abre la aplicación sin una página seleccionada, entonces esta arranca y muestra la navegación por encima del título textual «ShopMaker», los enlaces «Iniciar sesión» y «Registrarse», el botón «Cambiar tema», el aside con el botón para crear páginas y la lista de páginas empezadas (o «Ninguna Web en Progreso» si está vacía), y el texto «Seleccione una web para visualizar» en el área central, a 1280×800; a 1024×720 el layout no produce scroll horizontal. No hay enlace de contactos. | RF-01 |
| CA-02 | Dada la estructura de la aplicación, cuando se inspecciona el código, entonces se distinguen las capas de presentación, aplicación/estado, dominio e infraestructura. | RF-02 |
| CA-03 | Cuando se inspecciona el código cliente, entonces no hay acceso a APIs de Node ni al sistema de archivos y solo se usan APIs del navegador. | RNF-03 |
| CA-04 | Dada la lista de páginas empezadas, cuando el usuario activa con ratón o teclado el control de selección de una página, entonces esa página queda seleccionada y desaparece el mensaje «Seleccione una web para visualizar». Los botones habilitados de crear y maquetar son controles distintos: reciben foco y pueden activarse, pero no ejecutan acciones; activar el botón de maquetación no selecciona la página. La selección no carga ni renderiza una previsualización. Los enlaces de navegación y los controles operables son utilizables con teclado y ratón. | RF-03, RNF-01 |
| CA-05 | Cuando se ejecuta el smoke test E2E, entonces abre la aplicación y verifica que el encabezado principal «ShopMaker» es visible y que existen los landmarks de navegación, contenido principal y contenido complementario. | RF-04 |
| CA-06 | La navegación contiene un botón con nombre accesible «Cambiar tema». PBI-001 implementa su presencia en la navegación; PBI-002 aporta la alternancia entre claro y oscuro y anuncia el estado del tema. | RF-05, RNF-01 |

## 6. Estados de interfaz

Los estados de carga, error, falta de permisos y sin conexión se consideran **no aplicables por ahora**. El botón para crear páginas y los botones de maquetación se muestran sin funcionalidad en este incremento; en el futuro, el primero iniciará la creación y abrirá el motor, y los segundos abrirán el motor para la página correspondiente. Si la lista está vacía, muestra «Ninguna Web en Progreso». La aplicación inicia sin una página seleccionada; el área central muestra «Seleccione una web para visualizar» hasta que el usuario seleccione una página. Al seleccionar, el mensaje desaparece y no se renderiza una previsualización.

## 7. Contrato de API y dependencias

- Endpoints, DTO, errores normalizados y adaptador mock: no definidos ni requeridos por los criterios de PBI-001.
- Dependencias de producto/arquitectura: ADR-001 (React + TypeScript + Vite) y ADR-002 (aplicación web en navegador).
- Dependencia de tema: PBI-001 muestra el botón de tema en la navegación; PBI-002 proporciona los tokens, modos claro/oscuro y la funcionalidad de alternancia.
- Dependencia de pruebas: esta rama adopta el arnés oficial integrado en `develop` desde PBI-004 (`tests/setup.ts`, `tests/unit/`, `tests/e2e/`, alias `@`), sin duplicar configuración.
- Dependencia de rutas: mientras PBI-005 no publique las rutas definitivas, los enlaces de acceso usan destinos provisionales (`#iniciar-sesion` y `#registrarse`) documentados en `src/features/home/application/authRoutes.ts`. No son URLs de producto.

## 8. Fuera de alcance

- Aplicación nativa, instalador y APIs nativas del sistema operativo; la entrega se ejecuta en el navegador según ADR-002.
- Service worker e instalación PWA durante el Sprint 0, según ADR-002.
- Funcionalidades de producto posteriores como autenticación, catálogo y compra de módulos, motor de maquetación, renderizado de previsualizaciones, publicación y gestión de módulos.
- Especificar la configuración concreta del hosting, el fallback de SPA y la validación de CSP; la documentación del fallback y el despliegue está pospuesta a PBI-001 T07 en S02.
- Definir contratos de API o adaptadores mock, cubiertos por PBI-003.

## 9. Riesgos y supuestos

| Riesgo / supuesto | Impacto | Mitigación |
|---|---|---|
| Confundir desktop-first con una aplicación nativa. | Desviar arquitectura y esfuerzo del objetivo de aplicación web. | Mantener la decisión de SPA en navegador definida por ADR-002. |
| Sobreconfiguración inicial. | Aumentar complejidad antes de aportar funcionalidad. | Limitar este incremento a los criterios y tareas del PBI-001. |
| Falta de fallback de SPA en el hosting. | Las rutas podrían no funcionar al desplegar. | Documentar el fallback y el despliegue estático en T07 (S02); esta spec no decide la configuración del hosting. |

No se añaden otros supuestos en este borrador.

## 10. Decisiones confirmadas y preguntas abiertas

- No habrá otros enlaces ni página de contactos; la navegación contiene «Iniciar sesión», «Registrarse» y «Cambiar tema».
- La lista vacía muestra «Ninguna Web en Progreso».
- La aplicación inicia sin una página seleccionada.
- El área central muestra «Seleccione una web para visualizar» antes de seleccionar; tras seleccionar, el mensaje desaparece y no se muestra una previsualización.
- El botón de tema se ubica en la navegación; PBI-001 implementa el botón y PBI-002 su funcionalidad.
- El botón de tema tiene el nombre accesible «Cambiar tema»; su estado y su anuncio cuando cambia son responsabilidad de PBI-002.
- [ ] `[NEEDS CLARIFICATION]` ¿Qué rutas exactas tendrán los enlaces de inicio de sesión y registro? Coordinar con PBI-005. Mientras tanto, PBI-001 usa destinos provisionales semánticos y `navigation-destinations` verifica presencia y semántica, no URLs de producto.

## 11. Referencias

- Issue PBI-001: https://github.com/Grup-05/ShopMaker-DAW/issues/2
- Tarea PBI-001 T01: https://github.com/Grup-05/ShopMaker-DAW/issues/6
- Tarea PBI-001 T04 (smoke test): https://github.com/Grup-05/ShopMaker-DAW/issues/9
- Tarea PBI-001 T06 (layout y navegación): https://github.com/Grup-05/ShopMaker-DAW/issues/11
- Product Backlog: `docs/scrum/product-backlog.md`
- Sprint Backlog S01: `docs/scrum/sprints/S01/sprint-backlog.md`
- ADR-001: `docs/decisiones/ADR-001-react-typescript.md`
- ADR-002: `docs/decisiones/ADR-002-aplicacion-web.md`
