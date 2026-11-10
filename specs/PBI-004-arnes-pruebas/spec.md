# Spec — PBI-004 Configurar el arnés de pruebas y el hook local de calidad

> Especificación de requisitos para el arnés de pruebas automatizado y las puertas locales de calidad del CMS ShopMaker.

## Metadatos

| Campo | Valor |
|---|---|
| PBI | `PBI-004` |
| Sprint | `S01` |
| Autor | Fran Tomás (`@FSolaje`, Dev A / PO) |
| Fecha | 2026-11-10 |
| Estado | Especificación completada |
| Rama | `feature/PBI-004-arnes-pruebas` |

---

## 1. Contexto y problema

Para garantizar el cumplimiento de la Constitución Técnica (`AGENTS.md`), la metodología Scrum y la práctica estricta de Test-Driven Development (TDD — *No test, no code*), el proyecto frontend **ShopMaker-DAW** requiere una infraestructura de pruebas automatizada, reproducible y rápida.

Actualmente, el repositorio cuenta con la gobernanza estática y los hooks universales de Git (`pre-commit` con SAST y telemetría, `pre-push`), pero carece de un arnés de pruebas para ejecutar tests unitarios, de componentes y de integración (E2E), así como de un hook local del proyecto (`.agent/hooks/pre-commit-local.sh`) que verifique la suite antes de cada commit.

Este PBI establece la base sobre la cual todos los desarrolladores construirán las funcionalidades del CMS:
- `@Tarrant15` para verificar el arranque de la aplicación web base (`PBI-001`).
- `@Fernis23228` para verificar el contraste accesible y tokens de diseño (`PBI-002`).
- Toda la integración continua posterior antes de fusionar Pull Requests en `develop`.

---

## 2. Historias de usuario y flujos

### Historia principal

**Como** Developer del equipo ShopMaker,  
**quiero** disponer de un entorno de pruebas reproducible, un runner de tests rápido y un hook local de verificación,  
**para** aplicar el ciclo TDD (rojo → verde → refactor) y detectar regresiones de calidad o accesibilidad antes de abrir un Pull Request hacia `develop`.

### Flujos principales

#### Flujo 1: Ejecución del ciclo TDD en desarrollo local
1. El desarrollador redacta una prueba unitaria o de componente describiendo el comportamiento esperado de acuerdo con la especificación del PBI.
2. Ejecuta `npm test` o `npm run test:watch`.
3. Vitest ejecuta la prueba en entorno simulado del DOM (`jsdom`), confirmando el fallo inicial (rojo) por la causa esperada.
4. El desarrollador implementa el código mínimo de producción necesario.
5. Vuelve a ejecutar la prueba y comprueba que pasa a verde.
6. Refactoriza el código manteniendo la suite en verde.

#### Flujo 2: Verificación E2E de arranque en navegador
1. El desarrollador o la integración ejecuta `npm run test:e2e`.
2. Playwright levanta de forma automatizada un servidor de desarrollo local de Vite.
3. Se lanzan los navegadores objetivo (Chromium / Firefox) en modo headless.
4. Se ejecuta el smoke test de arranque, validando landmarks, títulos accesibles y ausencia de errores de consola.
5. Playwright finaliza la prueba y detiene automáticamente el servidor local.

#### Flujo 3: Puerta de calidad en commit (`pre-commit-local.sh`)
1. El desarrollador ejecuta `git commit`.
2. El hook universal `.agent/hooks/pre-commit` realiza las verificaciones universales (SAST de secretos y telemetría de tracking).
3. Detecta y delega la ejecución en `.agent/hooks/pre-commit-local.sh`.
4. El hook local ejecuta:
   - Verificación estática de tipos con TypeScript (`npm run typecheck`).
   - Análisis de estilo y buenas prácticas (`npm run lint`).
   - Suite completa de pruebas unitarias (`npm run test:unit`).
5. Si alguna comprobación falla, el commit se bloquea con un mensaje de error claro y código de salida `1`.
6. Si todo pasa limpiamente, el commit se consolida con éxito.

---

## 3. Requerimientos funcionales

| ID | Requerimiento | Prioridad |
|---|---|---|
| **RF-01** | **Comando único de suite:** Debe existir un script unificado `npm test` que ejecute de forma estándar la suite de pruebas unitarias y de componentes. Adicionalmente, deben existir scripts específicos para ejecución aislada: `npm run test:unit`, `npm run test:watch`, `npm run test:coverage`, `npm run test:e2e`, `npm run typecheck` y `npm run lint`. | Alta |
| **RF-02** | **Runner unitario y de componentes con Vitest y RTL:** Configurar Vitest con entorno `jsdom`, integración con React Testing Library (`@testing-library/react`, `@testing-library/jest-dom`), soporte completo para TypeScript y simulación de APIs del navegador requeridas por React 18/19. | Alta |
| **RF-03** | **Arnés E2E con Playwright:** Configurar Playwright para ejecutar pruebas de integración y arranque en navegadores Chromium y Firefox, con gestión automática del ciclo de vida del servidor web de Vite (`webServer` configurado con puerto dedicado y timeout controlado). | Alta |
| **RF-04** | **Smoke test E2E de arranque:** Proporcionar una prueba de humo funcional que verifique que la aplicación arranca en el navegador y que falla de manera determinista si la aplicación presenta errores de sintaxis o renderizado (desbloquea CA-01 y T04 de `PBI-001`). | Alta |
| **RF-05** | **Test de ejemplo del ciclo TDD:** Implementar una prueba unitaria de ejemplo con una función o componente demostrativo que evidencie el flujo rojo → verde, documentando la aserción y su resolución. | Alta |
| **RF-06** | **Hook local de calidad del proyecto:** Crear `.agent/hooks/pre-commit-local.sh` con permisos de ejecución (`chmod +x`), que ejecute `typecheck`, `lint` y `test:unit`, devolviendo código de salida 0 en caso de éxito y 1 en caso de error, sin alterar ni debilitar el núcleo de gobernanza global. | Alta |
| **RF-07** | **Aislamiento y determinismo absoluto:** Ninguna prueba unitaria, de componente o E2E puede realizar peticiones a servicios remotos ni dependencias externas de red. Todas las dependencias deben ser locales o simuladas en memoria. | Alta |

---

## 4. Requerimientos no funcionales (RNF)

| ID | Requerimiento | Criterio de Aceptación |
|---|---|---|
| **RNF-01** | **Presupuesto de tiempo:** | La suite unitaria debe ejecutarse en menos de **60 segundos** en una estación estándar. La suite completa (incluyendo E2E local) debe finalizar en menos de **3 minutos**. |
| **RNF-02** | **Determinismo y cero flakiness:** | Tasa de fallos intermitentes (*flaky tests*) = **0**. Las pruebas deben ser independientes del orden de ejecución y limpiar su estado tras cada ejecución. |
| **RNF-03** | **Consultas accesibles obligatorias:** | Los tests de interfaz deben buscar elementos por su rol accesible (`getByRole`), etiqueta (`getByLabelText`) o texto visible, quedando prohibido seleccionar por clases CSS internas (`.btn-primary`) o IDs arbitrarios. |
| **RNF-04** | **Seguridad y SAST:** | Ningún archivo de configuración, test o fixture puede contener credenciales, contraseñas, tokens de API o rutas absolutas privadas de la estación local. |
| **RNF-05** | **Compatibilidad con Node y Package Manager:** | La configuración debe ser compatible con Node.js v20+ LTS y gestionar dependencias versionadas mediante `package.json` y su correspondiente lockfile. |

---

## 5. Criterios de aceptación (DoD del PBI)

- [ ] **CA-01 [Comando único]:** `npm test` ejecuta la suite de pruebas unitarias sin errores de configuración.
- [ ] **CA-02 [Aislamiento]:** La suite se ejecuta de forma determinista y sin conexión a red externa.
- [ ] **CA-03 [Arnés E2E]:** `npm run test:e2e` ejecuta Playwright levantando y cerrando automáticamente el servidor local de desarrollo.
- [ ] **CA-04 [Ejemplo TDD]:** Existe una prueba de ejemplo demostrativa del ciclo rojo → verde documentada en el informe de tareas.
- [ ] **CA-05 [Hook local]:** `.agent/hooks/pre-commit-local.sh` bloquea commits si typecheck, linter o tests fallan, y permite el commit si pasan.
- [ ] **CA-06 [Documentación]:** El plan técnico y las tareas detallan los comandos, dependencias y arquitectura del arnés.

---

## 6. Fuera de alcance

- Implementación del layout o componentes finales del CMS (corresponde a `PBI-001` y `PBI-002`).
- Adaptadores de API remota y contratos de backend (corresponde a `PBI-003`).
- Configuración de pipelines en la nube (CI/CD remoto fuera de GitHub Actions locales).
