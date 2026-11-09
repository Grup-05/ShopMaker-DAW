# Tareas TDD — PBI-001 Inicializar la aplicación web y la estructura base

> Lista ordenada de pruebas y ciclos TDD para el alcance de S01 (T03–T06). No se implementan el motor de maquetación ni las previsualizaciones.

## Metadatos

| Campo | Valor |
|---|---|
| PBI | `PBI-001` |
| Spec | `specs/PBI-001-aplicacion-web/spec.md` |
| Plan | `specs/PBI-001-aplicacion-web/plan.md` |
| Responsable | Jesús Hernández (`@Tarrant15`, Dev B) |
| Estado | Borrador |

## 0. Preparación

- [ ] Revisar los RF, RNF y CA de la spec y la matriz de `plan.md`.
- [ ] Confirmar que PBI-004 T03 (#19) proporciona Playwright y el servidor E2E; no duplicar su configuración.
- [ ] Confirmar con PBI-004 los comandos exactos para ejecutar tests de componente y E2E; los comandos de esta lista son nombres conceptuales hasta que el arnés quede integrado.
- [ ] Coordinar con PBI-005 las rutas de login y registro antes de cerrar las pruebas de navegación.
- [ ] El botón de tema se muestra en la navegación; PBI-001 no implementa alternancia, que corresponde a PBI-002.
- [ ] Los botones futuros de crear página y maquetar están habilitados, reciben foco y no ejecutan acciones en este incremento.
- [ ] Preparar una fixture de lista vacía y datos ficticios para pruebas de selección, sin red ni datos personales.
- [ ] No incluir enlaces ni página de contactos.
- [ ] Mantener el título textual «ShopMaker» con estilo CSS; una imagen de marca queda como posible evolución futura.
- [ ] Mostrar «Ninguna Web en Progreso» cuando la lista esté vacía y «Seleccione una web para visualizar» en el estado inicial del área central.
- [ ] Iniciar sin página seleccionada; verificar el mensaje central inicial.
- [ ] Confirmar que la rama de trabajo y la aprobación/commit de los artefactos SDD siguen el proceso del equipo antes de iniciar T04.

## 1. Lista de tests

- [ ] `[PBI-001][CA-01] app-arranque` — Playwright abre la SPA, verifica el heading principal «ShopMaker» y los landmarks `navigation`, `main` y `complementary`. Es el smoke test de T04 y cubre la parte de arranque de CA-01 y CA-05.
- [ ] `[PBI-001][CA-02] layer-boundaries` — comprueba que existen presentación, aplicación, dominio e infraestructura y que no se invierte la dirección de dependencias.
- [ ] `[PBI-001][CA-03] client-browser-only` — comprueba que el código de cliente no importa Node ni el sistema de archivos y no contiene secretos.
- [ ] `[PBI-001][CA-01] home-layout` — verifica navegación sobre el título textual «ShopMaker», aside y contenido central en el viewport de referencia.
- [ ] `[PBI-001][CA-01][RF-03] navigation-destinations` — verifica enlaces «Iniciar sesión» y «Registrarse» con las rutas acordadas con PBI-005; no existe enlace de contactos.
- [ ] `[PBI-001][CA-01] empty-pages-message` — con una lista vacía, verifica el texto exacto «Ninguna Web en Progreso».
- [ ] `[PBI-001][CA-01] preview-instruction` — sin página seleccionada, verifica el texto exacto «Seleccione una web para visualizar» y que no hay previsualización.
- [ ] `[PBI-001][CA-01][RNF-02] minimum-viewport` — verifica 1024×720 sin scroll horizontal; ejecutar en Chromium y Firefox conforme a la matriz acordada.
- [ ] `[PBI-001][CA-04] select-page` — activa una página con ratón y comprueba que queda seleccionada sin cargar una previsualización.
- [ ] `[PBI-001][CA-04] selection-clears-instruction` — tras seleccionar una página, verifica que desaparece el mensaje «Seleccione una web para visualizar» y no se renderiza una previsualización.
- [ ] `[PBI-001][CA-04][RNF-01] keyboard-navigation` — recorre los controles con teclado, verifica el orden de foco y activa una página.
- [ ] `[PBI-001][RNF-01] focus-visible` — revisión manual de que el indicador de foco se distingue en los controles operables.
- [ ] `[PBI-001][CA-04] layout-button-does-not-select` — activa el botón de maquetación de una fila y comprueba que no selecciona la página ni ejecuta una acción.
- [ ] `[PBI-001][CA-04] create-button-inert` — activa el botón de crear página y comprueba que no inicia creación, navegación ni otra acción visible.
- [ ] `[PBI-001][CA-04][RNF-01] inert-controls-focusable` — verifica con teclado que los botones habilitados de crear y maquetar pueden recibir foco y activarse sin provocar una acción.
- [ ] `[PBI-001][CA-06] theme-button-placement` — verifica que el botón de tema aparece en la navegación y tiene el nombre accesible «Cambiar tema»; la alternancia y el anuncio del estado corresponden a PBI-002.
- [ ] `[PBI-001][RNF-04] zoom-200` — revisión manual de que el contenido y los controles operables siguen disponibles al 200 % de zoom.

## 2. Ciclos TDD

> Estimaciones oficiales sin cambios: T04 = 4 h, T05 = 8 h y T06 = 8 h. Los ciclos 3 y 4 son dos incrementos dentro de la misma T06, no tareas adicionales.

| Tarea S01 | Alcance | Estimación |
|---|---|---:|
| T01 | Especificación funcional y no funcional; criterios de aceptación. | 4 h |
| T02 | Plan técnico, arquitectura y matriz spec-test. | 4 h |
| T03 | Lista de tests, ciclos TDD y evidencia esperada. | 2 h |
| T04 | Escribir y ejecutar en rojo únicamente el smoke test E2E de arranque. | 4 h |
| T05 | Escribir primero los tests de arquitectura y luego crear el scaffold/capas para ponerlos en verde, junto con el smoke test. | 8 h |
| T06 | Escribir tests de layout y comportamiento antes de implementar la pantalla y selección. | 8 h |

Todas las tareas S01 indicadas tienen una estimación de 8 horas o menos; los varios ciclos descritos para T06 son incrementos dentro de sus 8 horas, no tareas adicionales.

### Ciclo 1 — Smoke test de arranque (T04 → T05)

- [ ] **Rojo (T04):** con el arnés Playwright de PBI-004 T03 operativo, crear el test con nombre `[PBI-001][CA-01] app-arranque` antes del scaffold. Abrir la aplicación y comprobar el heading principal «ShopMaker» y los landmarks `navigation`, `main` y `complementary`.
- [ ] La prueba usa selectores accesibles por rol/nombre (no clases CSS ni estructura interna) y no comprueba rutas de login/registro, cuyo contrato depende de PBI-005.
- [ ] El rojo es válido si el servidor E2E arranca y las aserciones fallan porque falta la aplicación/contenido esperado. Un fallo del servidor, navegador o configuración no cuenta como test rojo.
- [ ] **Verde (T05):** crear el punto de entrada y la composición mínima para que `[PBI-001][CA-01] app-arranque` pase.
- [ ] **Refactor (T05):** mantener la implementación mínima necesaria; «ShopMaker» debe ser texto estilizado con CSS, no una imagen de marca.

### Ciclo 2 — Límites de arquitectura (T05)

- [ ] **Rojo:** antes de crear las capas, añadir `layer-boundaries` y `client-browser-only`. Deben fallar por ausencia de capas o por límites no cumplidos, no por errores de configuración.
- [ ] **Verde:** crear la estructura mínima de presentación, aplicación, dominio e infraestructura; mantener las dependencias en la dirección permitida y el cliente libre de APIs de Node/sistema de archivos.
- [ ] **Refactor:** retirar estructura/configuración innecesaria sin romper los límites verificados.
- [ ] Ejecutar también `[PBI-001][CA-01] app-arranque` para comprobar que el scaffold conserva el arranque.

### Ciclo 3 — Composición y layout base (T06)

- [ ] **Rojo:** crear `home-layout`, `navigation-destinations`, `empty-pages-message`, `preview-instruction`, `minimum-viewport` y `theme-button-placement`; verificar que fallan por falta de elementos/textos o por overflow, no por errores del arnés.
- [ ] **Verde:** mostrar navegación sobre el encabezado con enlaces «Iniciar sesión»/«Registrarse» y botón «Cambiar tema», título «ShopMaker» estilizado con CSS, aside con botón de creación y lista (incluido el mensaje para lista vacía), y el mensaje central «Seleccione una web para visualizar» mientras no haya selección.
- [ ] **Refactor:** ajustar el layout para los viewports definidos sin añadir contenido o destinos no aprobados.
- [ ] Verificar Chromium y Firefox si ambos están disponibles en el arnés de PBI-004.

### Ciclo 4 — Selección accesible y controles futuros (T06)

- [ ] **Rojo:** crear `select-page`, `selection-clears-instruction`, `keyboard-navigation`, `layout-button-does-not-select`, `create-button-inert` e `inert-controls-focusable`; confirmar que fallan por el comportamiento ausente.
- [ ] **Verde:** permitir seleccionar una página con ratón y teclado; mantener los botones de crear/maquetar habilitados, focalizables e inertes.
- [ ] **Refactor:** garantizar semántica, orden de foco y que el botón no propaga la selección de la fila.
- [ ] Revisar manualmente que el indicador de foco sea visible (`focus-visible`).
- [ ] Confirmar que al seleccionar desaparece el mensaje central, pero no se renderiza ni actualiza contenido de previsualización.
- [ ] Realizar la revisión manual `zoom-200`.

### Botón de tema — presentación en PBI-001, comportamiento en PBI-002

- [ ] PBI-001 implementa solo el botón accesible en la navegación; no añade el estado ni el comportamiento de alternancia.
- [ ] PBI-002 implementa la funcionalidad de tema claro/oscuro y el anuncio accesible del estado.
- [ ] En PBI-001, probar presencia, ubicación y nombre accesible del botón; no probar alternancia como comportamiento de PBI-001.

### Mapeo de CA a tests previstos

| Criterio | Test(s) previsto(s) |
|---|---|
| CA-01 | `app-arranque`, `home-layout`, `navigation-destinations`, `empty-pages-message`, `preview-instruction`, `minimum-viewport` |
| CA-02 | `layer-boundaries` |
| CA-03 | `client-browser-only` |
| CA-04 | `select-page`, `selection-clears-instruction`, `keyboard-navigation`, `layout-button-does-not-select`, `create-button-inert`, `inert-controls-focusable` |
| CA-05 | `[PBI-001][CA-01] app-arranque` |
| CA-06 | `theme-button-placement` |

| Requisito no funcional | Verificación prevista |
|---|---|
| RNF-01 | `keyboard-navigation` y revisión manual `focus-visible` |
| RNF-02 | `minimum-viewport` |
| RNF-03 | `client-browser-only` |
| RNF-04 | Revisión manual `zoom-200` |

## 3. Estados y calidad transversal

- [ ] No implementar estados de carga, error, permisos ni conexión: no aplican a este incremento según la spec.
- [ ] Implementar el estado de lista vacía con el texto «Ninguna Web en Progreso» e iniciar sin página seleccionada.
- [ ] No asignar acciones a los botones de creación o maquetación. Los enlaces de navegación son login y registro; coordinar las rutas con PBI-005 y no inventarlas. No existe enlace de contactos.
- [ ] El botón de tema aparece en la navegación; su comportamiento lo proporciona PBI-002 y no se duplica en PBI-001.
- [ ] Verificar foco visible y operación por teclado en los controles que sí tienen comportamiento.
- [ ] Confirmar que el área central muestra «Seleccione una web para visualizar» mientras no hay selección; al seleccionar, el mensaje desaparece y no se renderiza una página.
- [ ] Confirmar ausencia de secretos y APIs de Node/sistema de archivos en el cliente.

## 4. Cierre

- [ ] Ejecutar la suite acordada con PBI-004 y dejarla en verde.
- [ ] Actualizar la matriz spec-test de `plan.md` con los resultados.
- [ ] Asegurar cobertura automatizada de todos los criterios de aceptación aplicables; documentar revisiones manuales de accesibilidad.
- [ ] No dejar tests omitidos o debilitados sin justificación y PBI asociado.
- [ ] Revisar cambios mediante Pull Request antes de integrar.
- [ ] Actualizar `README.md` y `CHANGELOG.md` solo si el incremento lo requiere.

## 5. Evidencia

| Elemento | Enlace / resultado |
|---|---|
| T04 — rojo | Salida de Playwright donde el servidor E2E arranca y `[PBI-001][CA-01] app-arranque` falla por las aserciones esperadas; no por configuración o indisponibilidad del servidor. |
| T05 — verde | Salida de `[PBI-001][CA-01] app-arranque`, `layer-boundaries` y `client-browser-only` en verde tras el scaffold. |
| T06 — verde | Salida de los tests de layout, navegación, estado vacío, selección y botón de tema; revisión manual registrada para foco visible y zoom al 200 %. |
| Comandos | Pendientes de confirmar con PBI-004; no duplicar ni inventar scripts del arnés. |
| Resultado de la suite | Pendiente de implementación. Adjuntar comandos y resultados reales al ejecutar. |
| PR | Pendiente. |
| Commits | Pendiente; no crear commits sin aprobación humana explícita. |
| Notas de accesibilidad | Pendiente de revisión de orden de teclado, foco visible, contraste y zoom al 200 %. |
| Notas de seguridad | Pendiente de revisión del cliente; CSP/hosting fuera de alcance de este PBI. |
