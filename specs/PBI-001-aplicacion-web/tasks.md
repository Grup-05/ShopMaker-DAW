# Tareas TDD — PBI-001 Inicializar la aplicación web y la estructura base

> Lista ordenada de pruebas y ciclos TDD para el alcance de S01 (T03–T06). No se implementan el motor de maquetación ni las previsualizaciones.

## Metadatos

| Campo | Valor |
|---|---|
| PBI | `PBI-001` |
| Spec | `specs/PBI-001-aplicacion-web/spec.md` |
| Plan | `specs/PBI-001-aplicacion-web/plan.md` |
| Responsable | Jesús Hernández (`@Tarrant15`, Dev B) |
| Estado | En revisión — T03 redactada; pendiente aprobación humana |
| Actualizado | 2026-11-09 |

> **Alcance de T03:** este documento fija la lista de tests, los ciclos TDD y la evidencia esperada. La escritura y ejecución de los tests corresponde a T04–T06; por eso los checkboxes de la sección 1 no se marcan en T03. Los comandos y las rutas definitivas dependen de PBI-004 y PBI-005 y no se inventan aquí.

## 0. Preparación

### 0.1. Revisión documental (T03)

- [x] Revisar los RF, RNF y CA de la spec y la matriz de `plan.md`.
- [x] Confirmar que el botón de tema se muestra en la navegación; PBI-001 no implementa alternancia, que corresponde a PBI-002.
- [x] Confirmar que los botones futuros de crear página y maquetar están habilitados, reciben foco y no ejecutan acciones en este incremento.
- [x] Confirmar que no se incluye enlace ni página de contactos.
- [x] Confirmar el título textual «ShopMaker» con estilo CSS; una imagen de marca queda como posible evolución futura.
- [x] Confirmar los textos «Ninguna Web en Progreso» (lista vacía) y «Seleccione una web para visualizar» (estado inicial del área central).
- [x] Confirmar que la aplicación inicia sin página seleccionada.
- [x] Confirmar la rama de trabajo `feature/PBI-001-aplicacion-web` y los commits `docs(spec)` de T01–T03 (`55c0d86`, `3125dc9`, `e6f5e4d`).

### 0.2. Dependencias externas pendientes de confirmar

| Dependencia | Qué falta | Bloquea | Responsable |
|---|---|---|---|
| PBI-004 T03 (#19) | Confirmar Playwright, servidor E2E, ruta de los tests y comandos reales del arnés. | T04 (rojo E2E) y la ejecución de toda la lista. | Dev A (`@FSolaje`) |
| PBI-005 | Rutas exactas de «Iniciar sesión» y «Registrarse». | Solo `navigation-destinations` (T06); no bloquea T04. | PBI-005 |
| Aprobación humana | Revisión y visto bueno de `spec.md`, `plan.md` y `tasks.md`. | Cierre de T03 y arranque de T04. | Dev B / PO |

- [ ] Confirmar con PBI-004 los comandos y la ubicación del arnés; hasta entonces no se duplica ni se inventa configuración.
- [ ] Coordinar las rutas de login/registro con PBI-005 antes de cerrar `navigation-destinations`.
- [ ] Obtener la aprobación humana de los artefactos SDD antes de iniciar T04.

> La fixture de lista vacía y los datos ficticios para selección se preparan en T06, dentro del ciclo 3, no en T03.

## 1. Lista de tests

> Los checkboxes significan que el test **existe y está en verde**, no que esté especificado. En T03 solo se fija el nombre, el nivel y el archivo previsto; la escritura se realiza en T04–T06. Los nombres de archivo proceden de `plan.md` y quedan sujetos a la ruta que confirme PBI-004.

| Hecho | Test | Tipo | Archivo / medio previsto | Cubre | Dependencia |
|---|---|---|---|---|---|
| [ ] | `[PBI-001][CA-01] app-arranque` | E2E (Playwright) | `home-screen.spec.ts` | CA-01 (arranque), CA-05, RF-04 | PBI-004 T03 |
| [ ] | `[PBI-001][CA-02] layer-boundaries` | Arquitectura | `layer-boundaries.test.ts` | CA-02, RF-02 | — |
| [ ] | `[PBI-001][CA-03] client-browser-only` | Arquitectura / estático | `client-boundary.test.ts` | CA-03, RNF-03 | — |
| [ ] | `[PBI-001][CA-01] home-layout` | E2E / componente | `home-screen.spec.ts`, `HomePage.test.tsx` | CA-01, RF-01 | PBI-004 T03 |
| [ ] | `[PBI-001][CA-01][RF-03] navigation-destinations` | Componente | `HomePage.test.tsx` | CA-01, RF-03 | PBI-005 (rutas) |
| [ ] | `[PBI-001][CA-01] empty-pages-message` | Componente | `HomePage.test.tsx` | CA-01, RF-01 | Fixture de lista vacía |
| [ ] | `[PBI-001][CA-01] preview-instruction` | Componente / E2E | `HomePage.test.tsx` | CA-01, RF-01, RF-03 | — |
| [ ] | `[PBI-001][CA-01][RNF-02] minimum-viewport` | E2E | `home-screen.spec.ts` | CA-01, RNF-02 | Chromium y Firefox |
| [ ] | `[PBI-001][CA-04] select-page` | Componente | `HomePage.test.tsx` | CA-04, RF-03 | Datos ficticios |
| [ ] | `[PBI-001][CA-04] selection-clears-instruction` | Componente | `HomePage.test.tsx` | CA-04, RF-03 | Datos ficticios |
| [ ] | `[PBI-001][CA-04][RNF-01] keyboard-navigation` | Componente | `HomePage.test.tsx` | CA-04, RNF-01 | — |
| [ ] | `[PBI-001][RNF-01] focus-visible` | Revisión manual | Checklist de accesibilidad | RNF-01 | — |
| [ ] | `[PBI-001][CA-04] layout-button-does-not-select` | Componente | `HomePage.test.tsx` | CA-04, RF-03 | Datos ficticios |
| [ ] | `[PBI-001][CA-04] create-button-inert` | Componente | `HomePage.test.tsx` | CA-04, RF-03 | — |
| [ ] | `[PBI-001][CA-04][RNF-01] inert-controls-focusable` | Componente | `HomePage.test.tsx` | CA-04, RNF-01 | — |
| [ ] | `[PBI-001][CA-06] theme-button-placement` | Componente | `HomePage.test.tsx` | CA-06, RF-05 | — |
| [ ] | `[PBI-001][RNF-04] zoom-200` | Revisión manual | Checklist de accesibilidad | RNF-04 | — |

> Los nombres de test son contractuales: no deben cambiarse al implementarlos. Si PBI-004 impone otra ruta o comando, se actualiza la columna «Archivo / medio previsto» y la evidencia, nunca el nombre del test.
>
> Fixtures de T06: lista vacía y datos ficticios deterministas, sin red ni datos personales.

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

#### Plan de acometida de T04 (rojo)

**Objetivo:** dejar escrito y ejecutado el smoke test `[PBI-001][CA-01] app-arranque`, con un rojo válido, sin crear todavía código de producción.

**Precondiciones bloqueantes:**

- [ ] PBI-004 T03 (#19) operativo: Playwright instalado, servidor E2E definido y comando único documentado.
- [ ] Aprobación humana de `spec.md`, `plan.md` y `tasks.md`.
- [ ] Rama `feature/PBI-001-aplicacion-web` sincronizada con `develop` y sin tests rojos previos.

**Pasos de ejecución:**

1. Anotar en la evidencia el comando E2E y la ruta de tests que proporcione PBI-004; no crear configuración paralela ni duplicar el arnés.
2. Crear el archivo del smoke test en la ruta indicada por el arnés (previsto en `plan.md`: `home-screen.spec.ts`).
3. Escribir el test con selectores accesibles, sin clases CSS ni estructura interna:
   - heading de nivel 1 con nombre «ShopMaker»;
   - landmark `navigation`;
   - landmark `main`;
   - landmark `complementary`.
4. Ejecutar solo ese test y confirmar que falla por ausencia de la aplicación o del contenido esperado.
5. Guardar la salida completa (comando, fecha, navegador, resumen y motivo del fallo) en la tabla de evidencia.
6. No crear `index.html`, `src/`, configuración de Vite ni estilos en T04.

**Criterio de rojo válido:**

- El servidor E2E arranca y Playwright ejecuta el test.
- El fallo corresponde a la aserción de contenido (timeout o selector no encontrado por ausencia de la app).
- No es válido un fallo por dependencia ausente, configuración incorrecta, puerto ocupado, navegador no instalado o test no descubierto.

**Tabla de evidencia a rellenar:**

| Campo | Valor |
|---|---|
| Comando ejecutado | Pendiente de PBI-004 |
| Navegador / fecha | Pendiente |
| Resultado | `1 failed` por aserción de contenido (esperado) |
| Salida | Enlace o bloque de consola |
| Motivo del rojo | Pendiente de registrar |

**Definition of Done de T04:**

- [ ] Existe un único test nuevo con el nombre contractual `[PBI-001][CA-01] app-arranque`.
- [ ] Se ha ejecutado solo ese test con el comando del arnés de PBI-004.
- [ ] El rojo es válido según el criterio anterior y está registrado en la evidencia.
- [ ] No se ha creado código de producción (`index.html`, `src/`, Vite, estilos).
- [ ] La issue #9 queda actualizada con el resultado (requiere acceso a GitHub).

**Handoff a T05:** el test permanece en la rama; T05 crea el punto de entrada y la composición mínima para ponerlo en verde, sin tocar sus aserciones.

**Riesgo principal:** que el rojo falle por el arnés y no por la ausencia de la app. Mitigación: validar primero el arranque del servidor E2E de PBI-004 con su propio smoke test de ejemplo.

**Si PBI-004 sigue bloqueado:** no se crea un test huérfano, no se instala Playwright por cuenta propia y no se duplica el arnés. Se documenta el bloqueo, se escala a Dev A y se avanza en la revisión documental o en otra tarea del Sprint.

#### Checklist del ciclo

- [ ] **Rojo (T04):** con el arnés Playwright de PBI-004 T03 operativo, crear el test con nombre `[PBI-001][CA-01] app-arranque` antes del scaffold. Abrir la aplicación y comprobar el heading principal «ShopMaker» y los landmarks `navigation`, `main` y `complementary`.
- [ ] La prueba usa selectores accesibles por rol/nombre (no clases CSS ni estructura interna) y no comprueba rutas de login/registro, cuyo contrato depende de PBI-005.
- [ ] El rojo es válido si el servidor E2E arranca y las aserciones fallan porque falta la aplicación/contenido esperado. Un fallo del servidor, navegador o configuración no cuenta como test rojo.
- [ ] Registrar la evidencia del rojo en la sección 5 antes de pasar a T05.
- [ ] **Verde (T05):** crear el punto de entrada y la composición mínima para que `[PBI-001][CA-01] app-arranque` pase.
- [ ] **Refactor (T05):** mantener la implementación mínima necesaria; «ShopMaker» debe ser texto estilizado con CSS, no una imagen de marca.

### Ciclo 2 — Límites de arquitectura (T05)

> **Archivos previstos:** `layer-boundaries.test.ts` y `client-boundary.test.ts`.

- [ ] **Rojo:** antes de crear las capas, añadir `layer-boundaries` y `client-browser-only`. Deben fallar por ausencia de capas o por límites no cumplidos, no por errores de configuración.
- [ ] **Verde:** crear la estructura mínima de presentación, aplicación, dominio e infraestructura; mantener las dependencias en la dirección permitida y el cliente libre de APIs de Node/sistema de archivos.
- [ ] **Refactor:** retirar estructura/configuración innecesaria sin romper los límites verificados.
- [ ] Ejecutar también `[PBI-001][CA-01] app-arranque` para comprobar que el scaffold conserva el arranque.

### Ciclo 3 — Composición y layout base (T06)

> **Archivos previstos:** `home-screen.spec.ts` y `HomePage.test.tsx`.

- [ ] **Rojo:** crear `home-layout`, `navigation-destinations`, `empty-pages-message`, `preview-instruction`, `minimum-viewport` y `theme-button-placement`; verificar que fallan por falta de elementos/textos o por overflow, no por errores del arnés.
- [ ] Preparar una fixture de lista vacía y datos ficticios deterministas para selección, sin red ni datos personales.
- [ ] **Verde:** mostrar navegación sobre el encabezado con enlaces «Iniciar sesión»/«Registrarse» y botón «Cambiar tema», título «ShopMaker» estilizado con CSS, aside con botón de creación y lista (incluido el mensaje para lista vacía), y el mensaje central «Seleccione una web para visualizar» mientras no haya selección.
- [ ] **Refactor:** ajustar el layout para los viewports definidos sin añadir contenido o destinos no aprobados.
- [ ] Verificar Chromium y Firefox si ambos están disponibles en el arnés de PBI-004.

### Ciclo 4 — Selección accesible y controles futuros (T06)

> **Archivo previsto:** `HomePage.test.tsx`.

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
| T03 — lista y ciclos | `tasks.md` con 17 tests, 4 ciclos TDD, mapeo CA/RNF → test y plan de acometida de T04; commit `e6f5e4d`. |
| Aprobación T03 | Pendiente de revisión humana de `spec.md`, `plan.md` y `tasks.md`. |
| T04 — rojo | Pendiente. Requiere el arnés de PBI-004 T03 (#19); registrar comando, fecha, navegador y motivo del rojo. |
| T05 — verde | Salida de `[PBI-001][CA-01] app-arranque`, `layer-boundaries` y `client-browser-only` en verde tras el scaffold. |
| T06 — verde | Salida de los tests de layout, navegación, estado vacío, selección y botón de tema; revisión manual registrada para foco visible y zoom al 200 %. |
| Comandos | Pendientes de confirmar con PBI-004; no duplicar ni inventar scripts del arnés. |
| Resultado de la suite | Pendiente de implementación. Adjuntar comandos y resultados reales al ejecutar. |
| PR | Pendiente. |
| Commits | T01 `55c0d86`, T02 `3125dc9`, T03 `e6f5e4d`. No crear commits adicionales sin aprobación humana explícita. |
| Notas de accesibilidad | Pendiente de revisión de orden de teclado, foco visible, contraste y zoom al 200 %. |
| Notas de seguridad | Pendiente de revisión del cliente; CSP/hosting fuera de alcance de este PBI. |
