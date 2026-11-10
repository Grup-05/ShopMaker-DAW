# Tareas TDD — PBI-001 Inicializar la aplicación web y la estructura base

> Lista ordenada de pruebas y ciclos TDD para el alcance de S01 (T03–T06). No se implementan el motor de maquetación ni las previsualizaciones.

## Metadatos

| Campo | Valor |
|---|---|
| PBI | `PBI-001` |
| Spec | `specs/PBI-001-aplicacion-web/spec.md` |
| Plan | `specs/PBI-001-aplicacion-web/plan.md` |
| Responsable | Jesús Hernández (`@Tarrant15`, Dev B) |
| Estado | En revisión — T04–T06 implementadas; pendiente aprobación humana y rutas de PBI-005 |
| Actualizado | 2026-11-09 |

> **Alcance de T03:** este documento fija la lista de tests, los ciclos TDD y la evidencia esperada. La escritura y ejecución de los tests se completó en T04–T06. Los comandos del arnés y los resultados reales están registrados en `evidence.md`. Las rutas exactas de login/registro siguen pendientes de PBI-005 y se mantienen como destinos provisionales documentados.

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

### 0.2. Dependencias externas y estado real

| Dependencia | Estado | Impacto | Responsable |
|---|---|---|---|
| PBI-004 T03 (#19) | Arnés oficial ya integrado en `develop` y adoptado por esta rama: `tests/setup.ts`, `tests/unit/`, `tests/e2e/`, alias `@` y servidor Vite. | Permite ejecutar T04–T06 con la configuración única del proyecto. | Dev A (`@FSolaje`) |
| PBI-005 | Rutas reales de «Iniciar sesión» y «Registrarse» aún no publicadas. | Solo afecta a los destinos exactos de `navigation-destinations`; el resto está cubierto. | PBI-005 |
| Aprobación humana | Pendiente de revisión de `spec.md`, `plan.md` y `tasks.md`. | Cierre formal, commit y PR. | Dev B / PO |

- [x] Adoptar el arnés oficial de PBI-004 integrado en `develop` (`tests/setup.ts`, `tests/unit/`, `tests/e2e/`, alias `@`); documentado en `evidence.md`.
- [ ] Sustituir los destinos provisionales de `authRoutes.ts` por las rutas de PBI-005 y reforzar `navigation-destinations`.
- [ ] Obtener la aprobación humana antes de commit y PR.

> La fixture de lista vacía y los datos ficticios de selección están implementados en T06.

## 1. Lista de tests

> Los checkboxes significan que el test **existe y está en verde**. Los 17 nombres son contractuales y se han implementado en T04–T06. La evidencia de ejecución está en `evidence.md`.

| Hecho | Test | Tipo | Archivo / medio previsto | Cubre | Dependencia |
|---|---|---|---|---|---|
| [x] | `[PBI-001][CA-01] app-arranque` | E2E (Playwright) | `tests/e2e/home-screen.spec.ts` | CA-01 (arranque), CA-05, RF-04 | Arnés oficial PBI-004 |
| [x] | `[PBI-001][CA-02] layer-boundaries` | Arquitectura | `tests/unit/architecture/layer-boundaries.test.ts` | CA-02, RF-02 | — |
| [x] | `[PBI-001][CA-03] client-browser-only` | Arquitectura / estático | `tests/unit/architecture/client-boundary.test.ts` | CA-03, RNF-03 | — |
| [x] | `[PBI-001][CA-01] home-layout` | E2E / componente | `tests/e2e/home-screen.spec.ts`, `tests/unit/home/HomePage.test.tsx` | CA-01, RF-01 | Arnés oficial PBI-004 |
| [x] | `[PBI-001][CA-01][RF-03] navigation-destinations` | Componente | `tests/unit/home/HomePage.test.tsx` | CA-01, RF-03 | Destinos provisionales; rutas exactas pendientes de PBI-005 |
| [x] | `[PBI-001][CA-01] empty-pages-message` | Componente | `tests/unit/home/HomePage.test.tsx` | CA-01, RF-01 | Fixture de lista vacía |
| [x] | `[PBI-001][CA-01] preview-instruction` | Componente / E2E | `tests/unit/home/HomePage.test.tsx` | CA-01, RF-01, RF-03 | — |
| [x] | `[PBI-001][CA-01][RNF-02] minimum-viewport` | E2E | `tests/e2e/home-screen.spec.ts` | CA-01, RNF-02 | Chromium y Firefox |
| [x] | `[PBI-001][CA-04] select-page` | Componente | `tests/unit/home/HomePage.test.tsx` | CA-04, RF-03 | Datos ficticios |
| [x] | `[PBI-001][CA-04] selection-clears-instruction` | Componente | `tests/unit/home/HomePage.test.tsx` | CA-04, RF-03 | Datos ficticios |
| [x] | `[PBI-001][CA-04][RNF-01] keyboard-navigation` | Componente | `tests/unit/home/HomePage.test.tsx` | CA-04, RNF-01 | — |
| [x] | `[PBI-001][RNF-01] focus-visible` | Revisión manual | `accessibility-checklist.md` | RNF-01 | Revisado en Chromium y Firefox |
| [x] | `[PBI-001][CA-04] layout-button-does-not-select` | Componente | `tests/unit/home/HomePage.test.tsx` | CA-04, RF-03 | Datos ficticios |
| [x] | `[PBI-001][CA-04] create-button-inert` | Componente | `tests/unit/home/HomePage.test.tsx` | CA-04, RF-03 | — |
| [x] | `[PBI-001][CA-04][RNF-01] inert-controls-focusable` | Componente | `tests/unit/home/HomePage.test.tsx` | CA-04, RNF-01 | — |
| [x] | `[PBI-001][CA-06] theme-button-placement` | Componente | `tests/unit/home/HomePage.test.tsx` | CA-06, RF-05 | — |
| [x] | `[PBI-001][RNF-04] zoom-200` | Revisión manual | `accessibility-checklist.md` | RNF-04 | Proxy de viewport revisado |

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

- [x] PBI-004 T03 (#19) operativo: Playwright instalado, servidor E2E definido y comando único documentado. La rama adopta el arnés oficial integrado en `develop` (ver `evidence.md`).
- [x] Aprobación humana de `spec.md`, `plan.md` y `tasks.md` para el arranque de T04. La aprobación final de cierre sigue pendiente.
- [x] Rama `feature/PBI-001-aplicacion-web` sincronizada con `develop` y sin tests rojos previos.

**Pasos de ejecución:**

1. [x] Anotar en la evidencia el comando E2E y la ruta de tests del arnés: `npm run test:e2e`, `tests/e2e/home-screen.spec.ts`.
2. [x] Crear el archivo del smoke test en `tests/e2e/home-screen.spec.ts`.
3. [x] Escribir el test con selectores accesibles, sin clases CSS ni estructura interna:
   - heading de nivel 1 con nombre «ShopMaker»;
   - landmark `navigation`;
   - landmark `main`;
   - landmark `complementary`.
4. [x] Ejecutar solo ese test y confirmar que falla por ausencia de la aplicación o del contenido esperado.
5. [x] Guardar la salida completa (comando, fecha, navegador, resumen y motivo del fallo) en `evidence.md`.
6. [x] No crear `index.html`, `src/`, configuración de Vite ni estilos en T04. Solo se usó un `index.html` mínimo temporal como fixture de arranque, sustituido en T05.

**Criterio de rojo válido:**

- El servidor E2E arranca y Playwright ejecuta el test.
- El fallo corresponde a la aserción de contenido (timeout o selector no encontrado por ausencia de la app).
- No es válido un fallo por dependencia ausente, configuración incorrecta, puerto ocupado, navegador no instalado o test no descubierto.

**Tabla de evidencia a rellenar:**

| Campo | Valor |
|---|---|
| Comando ejecutado | `npm run test:e2e` |
| Navegador / fecha | Chromium y Firefox — 2026-11-09 |
| Resultado | `6 failed` por aserción de contenido (esperado) |
| Salida | `/tmp/opencode/pbi001-evidence/t04-e2e-red.log`; resumen en `evidence.md` §2 |
| Motivo del rojo | No existía el heading «ShopMaker» ni los landmarks esperados |

**Definition of Done de T04:**

- [x] Existe un único test nuevo con el nombre contractual `[PBI-001][CA-01] app-arranque`.
- [x] Se ha ejecutado solo ese test con el comando del arnés.
- [x] El rojo es válido según el criterio anterior y está registrado en la evidencia.
- [x] No se ha creado código de producción (`index.html`, `src/`, Vite, estilos) durante el rojo; la fixture mínima se sustituyó en T05.
- [x] La issue #9 queda actualizada con el resultado.

**Handoff a T05:** el test permanece en la rama; T05 crea el punto de entrada y la composición mínima para ponerlo en verde, sin tocar sus aserciones.

**Riesgo principal:** que el rojo falle por el arnés y no por la ausencia de la app. Mitigación aplicada: se validó el arranque del servidor E2E antes de considerar válido el rojo.

**Si PBI-004 sigue bloqueado:** no se crea un test huérfano, no se instala Playwright por cuenta propia y no se duplica el arnés. Se documenta el bloqueo, se escala a Dev A y se avanza en la revisión documental o en otra tarea del Sprint. (No aplicó: el arnés oficial de PBI-004 ya estaba integrado en `develop` y fue adoptado por esta rama.)

#### Checklist del ciclo

- [x] **Rojo (T04):** crear el test con nombre `[PBI-001][CA-01] app-arranque` antes del scaffold. Abrir la aplicación y comprobar el heading principal «ShopMaker» y los landmarks `navigation`, `main` y `complementary`.
- [x] La prueba usa selectores accesibles por rol/nombre (no clases CSS ni estructura interna) y no comprueba rutas de login/registro, cuyo contrato depende de PBI-005.
- [x] El rojo es válido si el servidor E2E arranca y las aserciones fallan porque falta la aplicación/contenido esperado. Un fallo del servidor, navegador o configuración no cuenta como test rojo.
- [x] Registrar la evidencia del rojo en la sección 5 antes de pasar a T05.
- [x] **Verde (T05):** crear el punto de entrada y la composición mínima para que `[PBI-001][CA-01] app-arranque` pase.
- [x] **Refactor (T05):** mantener la implementación mínima necesaria; «ShopMaker» es texto estilizado con CSS, no una imagen de marca.

### Ciclo 2 — Límites de arquitectura (T05)

> **Archivos previstos:** `layer-boundaries.test.ts` y `client-boundary.test.ts`.

- [x] **Rojo:** antes de crear las capas, añadir `layer-boundaries` y `client-browser-only`. Fallaron por ausencia de capas (`presentation`) y de código de cliente, no por errores de configuración.
- [x] **Verde:** crear la estructura mínima de presentación, aplicación, dominio e infraestructura; mantener las dependencias en la dirección permitida y el cliente libre de APIs de Node/sistema de archivos.
- [x] **Refactor:** retirar estructura/configuración innecesaria sin romper los límites verificados.
- [x] Ejecutar también `[PBI-001][CA-01] app-arranque` para comprobar que el scaffold conserva el arranque.

### Ciclo 3 — Composición y layout base (T06)

> **Archivos previstos:** `home-screen.spec.ts` y `HomePage.test.tsx`.

- [x] **Rojo:** crear `home-layout`, `navigation-destinations`, `empty-pages-message`, `preview-instruction`, `minimum-viewport` y `theme-button-placement`; verificado que fallan por falta de módulos/elementos, no por errores del arnés.
- [x] Preparar una fixture de lista vacía y datos ficticios deterministas para selección, sin red ni datos personales.
- [x] **Verde:** mostrar navegación sobre el encabezado con enlaces «Iniciar sesión»/«Registrarse» y botón «Cambiar tema», título «ShopMaker» estilizado con CSS, aside con botón de creación y lista (incluido el mensaje para lista vacía), y el mensaje central «Seleccione una web para visualizar» mientras no haya selección.
- [x] **Refactor:** ajustar el layout para los viewports definidos sin añadir contenido o destinos no aprobados.
- [x] Verificar Chromium y Firefox en el arnés.

### Ciclo 4 — Selección accesible y controles futuros (T06)

> **Archivo previsto:** `HomePage.test.tsx`.

- [x] **Rojo:** crear `select-page`, `selection-clears-instruction`, `keyboard-navigation`, `layout-button-does-not-select`, `create-button-inert` e `inert-controls-focusable`; confirmado que fallan por el comportamiento ausente.
- [x] **Verde:** permitir seleccionar una página con ratón y teclado; mantener los botones de crear/maquetar habilitados, focalizables e inertes.
- [x] **Refactor:** garantizar semántica, orden de foco y que el botón no propaga la selección de la fila.
- [x] Revisar manualmente que el indicador de foco sea visible (`focus-visible`).
- [x] Confirmar que al seleccionar desaparece el mensaje central, pero no se renderiza ni actualiza contenido de previsualización.
- [x] Realizar la revisión manual `zoom-200` (proxy de viewport, documentado como pendiente de validación nativa).

### Botón de tema — presentación en PBI-001, comportamiento en PBI-002

- [x] PBI-001 implementa solo el botón accesible en la navegación; no añade el estado ni el comportamiento de alternancia.
- [x] PBI-002 implementa la funcionalidad de tema claro/oscuro y el anuncio accesible del estado.
- [x] En PBI-001, probar presencia, ubicación y nombre accesible del botón; no probar alternancia como comportamiento de PBI-001.

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

- [x] No implementar estados de carga, error, permisos ni conexión: no aplican a este incremento según la spec.
- [x] Implementar el estado de lista vacía con el texto «Ninguna Web en Progreso» e iniciar sin página seleccionada.
- [x] No asignar acciones a los botones de creación o maquetación. Los enlaces de navegación son login y registro; las rutas exactas se coordinan con PBI-005 y no se inventan (destinos provisionales documentados en `authRoutes.ts`). No existe enlace de contactos.
- [x] El botón de tema aparece en la navegación; su comportamiento lo proporciona PBI-002 y no se duplica en PBI-001.
- [x] Verificar foco visible y operación por teclado en los controles que sí tienen comportamiento.
- [x] Confirmar que el área central muestra «Seleccione una web para visualizar» mientras no hay selección; al seleccionar, el mensaje desaparece y no se renderiza una página.
- [x] Confirmar ausencia de secretos y APIs de Node/sistema de archivos en el cliente (`client-browser-only`).

## 4. Cierre

- [x] Ejecutar la suite acordada y dejarla en verde: `npm test` (4 archivos / 17 casos), `npm run test:e2e` (8 casos), `npm run typecheck`, `npm run lint` y `npm run build`.
- [x] Actualizar la matriz spec-test de `plan.md` con los resultados.
- [x] Asegurar cobertura automatizada de todos los criterios de aceptación aplicables; documentar revisiones manuales de accesibilidad en `accessibility-checklist.md`.
- [x] No dejar tests omitidos o debilitados sin justificación y PBI asociado. La comprobación de zoom usó un proxy de viewport y queda marcada como revisión humana pendiente.
- [ ] Revisar cambios mediante Pull Request antes de integrar (pendiente de aprobación humana y push).
- [x] Actualizar `README.md` y `CHANGELOG.md` con el estado del incremento.

## 5. Evidencia

| Elemento | Enlace / resultado |
|---|---|
| T03 — lista y ciclos | `tasks.md` con 17 tests, 4 ciclos TDD, mapeo CA/RNF → test y plan de acometida de T04; commit `e6f5e4d`. |
| Aprobación T03 | Pendiente de revisión humana de `spec.md`, `plan.md` y `tasks.md` para el cierre del PBI. |
| T04 — rojo | `npm run test:e2e` → `6 failed` por ausencia de heading/landmarks (Chromium y Firefox). Detalle en `evidence.md` §2 y `/tmp/opencode/pbi001-evidence/t04-e2e-red.log`. |
| T05 — verde | `[PBI-001][CA-01] app-arranque`, `layer-boundaries` y `client-browser-only` en verde tras el scaffold. |
| T06 — verde | Tests de layout, navegación, estado vacío, selección y botón de tema en verde; foco visible y zoom proxy registrados en `accessibility-checklist.md`. |
| Comandos | `npm test`, `npm run test:e2e`, `npm run typecheck`, `npm run lint`, `npm run build`. |
| Resultado de la suite | `npm test`: 4 archivos / 17 tests (15 de PBI-001 + 2 demostrativos de PBI-004); `npm run test:e2e`: 8 tests (4 × Chromium y Firefox, incluido el smoke de PBI-004); typecheck, lint y build OK. Detalle en `evidence.md` §4. |
| PR | Pendiente de push y apertura del PR; requiere aprobación humana explícita. |
| Commits | T01 `55c0d86`, T02 `3125dc9`, T03 `e6f5e4d`; T04–T06 en `944dce7` (local, pendiente de push). |
| Notas de accesibilidad | Foco visible `3px`, contrastes `13,75:1` / `6,7:1` / `6,7:1`, orden de teclado y ausencia de scroll horizontal en `512×360` verificados. Detalle en `accessibility-checklist.md`. |
| Notas de seguridad | `client-browser-only` verificó ausencia de secretos y APIs de Node/sistema de archivos en `src/`. CSP/hosting fuera de alcance de este PBI. |
