# ADR-001 — React y TypeScript como stack del frontend

> Decisión arquitectónica sobre la biblioteca de UI, el lenguaje y la herramienta de build del frontend de ShopMaker.

## Metadatos

| Campo | Valor |
|---|---|
| ID | `ADR-001` |
| Fecha | 2026-11-03 |
| Estado | Aceptado |
| Decisores | Equipo de desarrollo y Product Owner de ShopMaker-DAW |
| Sustituye a | — |
| Sustituido por | — |

## Contexto

ShopMaker-DAW contiene exclusivamente el frontend de un CMS que permite comprar módulos y construir páginas web alojadas por la plataforma. La arquitectura del sistema es de tres capas —frontend, backend/API y base de datos— y toda la lógica de negocio, permisos, compras y datos vive en el backend.

La primera entrega se ejecuta como **aplicación web desktop-first en el navegador** (ver `ADR-002`), con resolución de referencia 1280×800 y viewport mínimo de 1024×720. El proyecto exige:

- Separación estricta entre presentación, aplicación/estado, dominio e infraestructura.
- Testabilidad con TDD y pruebas de componente, integración, contrato y E2E.
- Accesibilidad WCAG 2.1 AA: foco visible, navegación por teclado, contraste y zoom.
- Seguridad por diseño, especialmente frente a XSS y contenido generado por usuarios.
- Un ecosistema maduro que permita al equipo avanzar sin construir infraestructura propia.

El Sprint 0 estaba bloqueado por la decisión de stack. El equipo tiene experiencia previa en React y TypeScript, y necesita una base estable para comenzar el ciclo TDD de PBI-001.

## Decisión

Se adopta **React** como biblioteca de UI, **TypeScript** como lenguaje del frontend y **Vite** como herramienta de build.

La decisión concreta es:

1. React se usa para construir la interfaz como una SPA en el navegador.
2. TypeScript se configura en modo estricto y se usa en presentación, aplicación, dominio, infraestructura y pruebas.
3. Vite gestiona el desarrollo y el build estático; Vitest se integra sobre su configuración para las pruebas.
4. La versión estable de cada dependencia se fija en `package.json` y en el lockfile versionado durante PBI-001; este ADR no fija números de versión.
5. No se adopta un meta-framework con SSR —Next.js, Remix u otro— porque la entrega es una aplicación de escritorio web sin requisitos de renderizado en servidor.

React es una biblioteca, no un framework completo. Por tanto, este ADR **no decide** el router, la estrategia de estado, el sistema de estilos, la gestión de formularios ni el stack de pruebas. Esas decisiones se justifican en los planes de PBI-001, PBI-002, PBI-003 y PBI-004, y en los ADR que correspondan.

## Alternativas consideradas

| Alternativa | Ventajas | Inconvenientes | Motivo de descarte |
|---|---|---|---|
| **Vue 3** | API progresiva, buena DX, ecosistema sólido y documentación clara. | Menor experiencia del equipo; el ecosistema de testing y accesibilidad es comparable, pero no aporta una ventaja decisiva. | El equipo ya domina React y TypeScript; cambiar añadiría curva de aprendizaje sin beneficio para el Sprint 0. |
| **Angular** | Framework completo, opinado, con routing, formularios y DI incluidos. | Mayor complejidad inicial, más configuración y acoplamiento al framework; sobredimensionado para una SPA de estas características. | KISS/YAGNI: no se necesitan todas las piezas del framework ni su modelo de DI. |
| **Svelte / SvelteKit** | Excelente rendimiento, sintaxis compacta y buena experiencia de desarrollo. | Menor base de conocimiento del equipo y ecosistema más pequeño; SvelteKit está orientado a aplicaciones con SSR, que no necesitamos. | El coste de adopción y la menor disponibilidad de experiencia superan la ventaja de rendimiento. |
| **Vanilla / Web Components** | Control total, sin dependencias de framework y estándares web. | Habría que construir routing, estado, composición, testing y accesibilidad desde cero; mayor coste y riesgo. | No cumple el objetivo de entregar una base testeable en el Sprint 0. |
| **Next.js / Remix** | Routing, SSR, carga de datos y convenciones integradas. | Añaden servidor, SSR y complejidad de despliegue que la aplicación web de escritorio no necesita. | YAGNI: la entrega es una SPA estática; el backend es independiente. |

## Consecuencias

### Positivas

- Modelo de componentes maduro, reutilizable y adecuado para el sistema de módulos del CMS.
- TypeScript aporta contratos explícitos en DTO, puertos, props y estados de la UI.
- Ecosistema amplio para routing, estado, formularios, testing y accesibilidad.
- React Testing Library y Playwright permiten probar comportamiento visible y flujos completos.
- Vite ofrece un entorno de desarrollo rápido y un build estático sencillo de desplegar.
- La comunidad y la documentación reducen el coste de resolución de problemas.

### Negativas o deuda asumida

- React no impone arquitectura: el equipo debe mantener disciplina de capas y evitar que los componentes importen infraestructura.
- Hay que decidir y justificar router, estado, estilos y formularios en los planes de cada PBI.
- El ecosistema cambia con frecuencia; las dependencias deben revisarse y auditarse.
- El bundle puede crecer si no se aplican carga diferida y presupuestos de rendimiento.
- JSX y el modelo de hooks requieren formación para quienes se incorporen al equipo.

### Impacto en pruebas

- Las pruebas unitarias y de componente se escribirán con Vitest y React Testing Library.
- Los flujos críticos y el arranque de la aplicación web se probarán con Playwright.
- La matriz spec-test de cada PBI debe cubrir el 100 % de los criterios de aceptación.
- Los tests deben buscar por rol, etiqueta o texto visible, no por clases CSS ni detalles internos.
- El stack concreto de pruebas se ratifica en PBI-004.

### Impacto en accesibilidad

- React no garantiza accesibilidad por sí solo: se exige HTML semántico, foco visible, etiquetas explícitas y navegación completa por teclado.
- Se incorporará `eslint-plugin-jsx-a11y` y comprobaciones automáticas con axe en las pruebas de componente.
- Se verificarán los viewports de 1024×720, 1280×800 y 1440×900, además del zoom al 200 %.

### Impacto en seguridad

- React escapa el contenido por defecto; queda prohibido `dangerouslySetInnerHTML` sin sanitización previa.
- No se permite `eval`, `new Function` ni ejecución de código remoto no verificado.
- El contenido generado por usuarios se sanitiza antes de renderizarse y las previsualizaciones se aislan con `iframe sandbox`.
- La aplicación se sirve con CSP estricta y sin secretos en el frontend.
- La sesión se gestionará preferentemente con cookies `HttpOnly`, `Secure` y `SameSite`, según el contrato del backend.

## Referencias

- [ADR-002 — Aplicación web en navegador](ADR-002-aplicacion-web.md)
- [Perfil frontend UI/UX](../../.agent/rules/profile-uiux.md)
- [Product Backlog — PBI-001](../scrum/product-backlog.md)
- [Sprint Backlog S01](../scrum/sprints/S01/sprint-backlog.md)
- [Documentación oficial de React](https://react.dev/)
- [Documentación oficial de TypeScript](https://www.typescriptlang.org/docs/)
- [Documentación oficial de Vite](https://vite.dev/)
