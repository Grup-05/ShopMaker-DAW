# ADR-002 — Aplicación web en navegador como formato de entrega

> Decisión arquitectónica sobre el formato de distribución y ejecución de la primera entrega del frontend.

## Metadatos

| Campo | Valor |
|---|---|
| ID | `ADR-002` |
| Fecha | 2026-11-03 |
| Estado | Aceptado |
| Decisores | Equipo de desarrollo y Product Owner de ShopMaker-DAW |
| Sustituye a | — |
| Sustituido por | — |

## Contexto

ShopMaker-DAW es el frontend de un CMS cuyo primer incremento se ha definido como **desktop-first**: la interfaz de administración se diseña para escritorio, con resolución de referencia 1280×800 y viewport mínimo de 1024×720.

El producto debe ejecutarse como **aplicación web en el navegador**. No se requiere integración con el sistema operativo, instalador, menús nativos, bandeja del sistema ni acceso directo al sistema de archivos. El backend es independiente y se consume mediante un contrato de API.

Las opciones de shell nativo añadirían complejidad de empaquetado, seguridad y pruebas que no aportan valor al alcance actual. La aplicación debe poder desplegarse como estático, ejecutarse en un navegador moderno y probarse de forma automatizada.

## Decisión

La primera entrega se distribuye como una **SPA (Single Page Application) servida por HTTP(S) y ejecutada en el navegador**.

La decisión concreta es:

1. No se usa Electron, Tauri ni ningún shell nativo.
2. No se genera instalador ni se requiere instalación en el sistema operativo.
3. El build de producción se publica como contenido estático —HTML, CSS, JavaScript y recursos— y se sirve desde un hosting web.
4. El hosting debe resolver las rutas de la SPA hacia `index.html`. Si no es posible, se usará `HashRouter` o una estrategia equivalente.
5. No se añade service worker, manifest ni instalación PWA en el Sprint 0. Una PWA instalable, si se necesita, será una decisión posterior con su propio ADR y PBI.
6. La aplicación solo utiliza APIs del navegador. No asume acceso a Node, al sistema de archivos ni a APIs nativas.
7. La persistencia local se apoyará en `localStorage` o IndexedDB; la importación y exportación de archivos usará la File API cuando la feature lo requiera.
8. Los navegadores objetivo y la matriz de pruebas se concretan en el `plan.md` de PBI-001. Como mínimo se validará un navegador Chromium actual y Firefox; Safari se incluirá si el equipo dispone de macOS.

## Alternativas consideradas

| Alternativa | Ventajas | Inconvenientes | Motivo de descarte |
|---|---|---|---|
| **Electron** | Aplicación nativa con Chromium y Node; APIs completas del sistema; empaquetado y actualizaciones maduras; Playwright puede lanzar la app real. | Instalador de 150–250 MB, mayor consumo de memoria, superficie de seguridad más amplia y configuración de IPC/preload. | No se necesita integración nativa; el coste en tamaño, seguridad y complejidad no está justificado para una SPA. |
| **Tauri** | Binario pequeño, bajo consumo y modelo de permisos robusto. | Requiere Rust, Cargo y dependencias del sistema; el WebView varía entre sistemas operativos y el E2E es menos directo. | Añade una curva de aprendizaje y un riesgo técnico innecesarios para el Sprint 0. |
| **PWA instalable** | Instalación desde el navegador, uso offline y actualizaciones automáticas. | Service worker y caché añaden complejidad; no es un requisito actual; la integración con el sistema sigue siendo limitada. | Se pospone. Si el producto necesita instalación u offline, se evaluará en un PBI específico. |
| **Aplicación web SPA (elegida)** | Simplicidad, portabilidad, despliegue estático, pruebas con Playwright y ausencia de superficie nativa. | Sin acceso directo al sistema de archivos ni APIs nativas; dependencia del navegador y del hosting. | Cumple el requisito actual con la menor complejidad y el menor riesgo. |

## Consecuencias

### Positivas

- Menor complejidad de arquitectura, empaquetado y distribución.
- Despliegue sencillo en cualquier hosting estático.
- Pruebas E2E directas con Playwright contra un servidor web.
- Menor superficie de ataque al no existir proceso principal, preload ni IPC.
- Portabilidad entre sistemas operativos con un navegador moderno.

### Negativas o deuda asumida

- No hay acceso directo al sistema de archivos, menús, bandeja ni notificaciones nativas.
- El tamaño mínimo de ventana no se puede imponer; se garantiza el layout a 1024×720 y se prueba el zoom al 200 %.
- La persistencia local está limitada por el navegador y puede ser borrada por el usuario.
- El hosting debe configurar el fallback de SPA y las cabeceras de caché y seguridad.
- La compatibilidad depende de los navegadores objetivo; hay que definir y probar la matriz.
- La autenticación y las cookies requieren coordinación con el backend: CORS, `SameSite`, `Secure` y `HttpOnly`.

### Impacto en pruebas

- El smoke test de PBI-001 se ejecuta con Playwright contra un servidor web, no contra una ventana nativa.
- Los tests de componente se ejecutan con Vitest y React Testing Library en un DOM simulado.
- Los tests visuales y de accesibilidad se validan en los viewports 1024×720, 1280×800 y 1440×900.
- La suite no debe depender de un backend real; se usará el adaptador mock de PBI-003.
- El comando único de suite y la configuración de Playwright se definen en PBI-004.

### Impacto en seguridad

- La aplicación se sirve con CSP estricta y sin `unsafe-eval`.
- Todo HTML generado por usuarios se sanitiza antes de renderizarse.
- Las previsualizaciones se aíslan con `iframe sandbox` y, preferiblemente, con un origen separado.
- No se almacenan secretos ni tokens de larga duración en `localStorage`.
- La sesión se gestiona preferentemente con cookies `HttpOnly`, `Secure` y `SameSite`.
- Se prohíben `eval`, `new Function` y la ejecución de código remoto no verificado.

### Impacto en accesibilidad

- La navegación debe funcionar completamente con teclado y ratón.
- El foco debe ser visible y el orden de tabulación lógico.
- Se debe soportar el zoom del navegador al 200 % sin pérdida de contenido ni funcionalidad.
- El layout debe ser funcional en 1024×720 sin scroll horizontal.
- La accesibilidad se verifica con pruebas automatizadas y revisión manual.

### Impacto en distribución

- El build de Vite genera un directorio estático que se publica en el hosting acordado.
- El hosting debe servir `index.html` para las rutas de la SPA o se usará `HashRouter`.
- Se configurarán cabeceras de caché para recursos con hash y para `index.html`.
- El paquete de release no incluye activos de gobernanza, specs ni documentación interna.

## Referencias

- [ADR-001 — React y TypeScript como stack del frontend](ADR-001-react-typescript.md)
- [Perfil frontend UI/UX](../../.agent/rules/profile-uiux.md)
- [Product Backlog — PBI-001](../scrum/product-backlog.md)
- [Sprint Backlog S01](../scrum/sprints/S01/sprint-backlog.md)
- [Documentación de Vite sobre build y despliegue](https://vite.dev/guide/build.html)
