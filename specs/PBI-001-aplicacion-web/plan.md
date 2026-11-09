# Plan técnico — PBI-001 Inicializar la aplicación web y la estructura base

> Borrador de solución y trazabilidad para la aplicación web base. Las decisiones confirmadas en la spec se reflejan en este plan.

## Metadatos

| Campo | Valor |
|---|---|
| PBI | `PBI-001` |
| Spec | `specs/PBI-001-aplicacion-web/spec.md` |
| Autor | Jesús Hernández (`@Tarrant15`, Dev B) |
| Fecha | 2026-11-09 |
| Estado | En revisión — pendiente aprobación humana |

## 1. Resumen de la solución

Crear una SPA mínima con React, TypeScript y Vite que presente la estructura de inicio descrita en la spec. La navegación aparecerá sobre el título «ShopMaker» e incluirá enlaces de login y registro y el botón de tema. El aside mostrará las páginas iniciadas o «Ninguna Web en Progreso» si no hay ninguna; antes de seleccionar una página, el área central mostrará «Seleccione una web para visualizar» y lo quitará al seleccionar, sin renderizar una previsualización. La selección de páginas será estado local de interfaz; no se implementarán el motor de maquetación ni el renderizado de previsualizaciones. PBI-001 implementa la presencia visual del botón de tema; PBI-002 implementa su funcionalidad.

## 2. Decisiones técnicas

| ID | Decisión | Alternativas | Justificación |
|---|---|---|---|
| DT-01 | Usar React + TypeScript + Vite y entregar una SPA web. | Aplicación nativa o meta-framework con SSR. | Decisión ya aceptada en ADR-001 y ADR-002. |
| DT-02 | Mantener una estructura pequeña con módulos diferenciados para presentación, aplicación/estado, dominio e infraestructura. | Concentrar todo en componentes o añadir capas y paquetes adicionales. | Cumple RF-02 sin añadir complejidad que este incremento no necesita. |
| DT-03 | Mantener la selección como estado local y cargar la lista mediante datos en memoria; no añadir router, estado global, persistencia ni API. | Router/gestor de estado o backend real. | No son necesarios para los criterios actuales; los contratos y adaptadores de API corresponden a PBI-003. |
| DT-04 | Mostrar «Seleccione una web para visualizar» mientras no haya selección y quitarlo al seleccionar; los botones de crear y maquetar permanecen habilitados e inertes. | Implementar el editor o contenido simulado de una web. | La spec requiere el mensaje inicial y controles visibles/focalizables, pero deja la previsualización y las acciones futuras fuera de este incremento. |
| DT-05 | Usar enlaces semánticos de login y registro, definidos por PBI-005; no incluir enlace ni página de contactos. | Enlaces decorativos o destinos inventados en PBI-001. | Los destinos deben coordinarse con PBI-005; contactos queda explícitamente fuera del producto. |
| DT-06 | Mostrar el botón de tema en la navegación; delegar el cambio de tema a PBI-002. | Implementar la lógica de cambio de tema en PBI-001 o ubicar el control en otro lugar. | PBI-001 implementa solo el botón y su ubicación; PBI-002 implementa el cambio de tema y su estado accesible. |

## 3. Arquitectura y capas

- **Presentación:** composición de la pantalla con encabezado de página, navegación, título principal, `main`, `aside` y landmarks semánticos; lista de páginas, controles habilitados e inertes y área central con el mensaje «Seleccione una web para visualizar». El botón de tema tiene nombre accesible «Cambiar tema»; su comportamiento pertenece a PBI-002.
- **Aplicación/estado:** selección de la página activa y coordinación de la lista que se presenta. No carga contenido de previsualización. El estado global de tema es propiedad de PBI-002.
- **Dominio:** tipo mínimo para identificar una página empezada y su etiqueta visible. No se incorporan reglas de negocio del CMS.
- **Infraestructura:** fuente local en memoria para los datos iniciales de la lista. No hay acceso de red, almacenamiento ni APIs de Node en este PBI.

### Dependencias permitidas

```text
presentación → aplicación → dominio
infraestructura → puertos de aplicación/dominio
composición de la aplicación → presentación + adaptadores
```

La presentación no importa infraestructura directamente. El dominio no depende de React, Vite, HTTP ni APIs del navegador.

## 4. Archivos y estructura prevista

```text
src/
├── main.tsx
├── app/
│   └── App.tsx
├── features/
│   └── home/
│       ├── presentation/
│       ├── application/
│       ├── domain/
│       ├── infrastructure/
│       └── tests/
└── shared/
```

| Archivo / módulo | Responsabilidad |
|---|---|
| `src/main.tsx` | Punto de entrada Vite y montaje de la aplicación en el navegador. |
| `src/app/App.tsx` | Componer y conectar la pantalla de inicio y sus dependencias. |
| `src/features/home/presentation/` | Renderizar navegación, encabezado, `main`, `aside`, lista, controles inactivos, botón de tema y mensaje del área central. |
| `src/features/home/application/` | Mantener y actualizar la selección de página sin lanzar acciones de maquetación ni previsualización. |
| `src/features/home/domain/` | Definir el tipo mínimo de página usado por la lista. |
| `src/features/home/infrastructure/` | Proveer datos en memoria a través de una dependencia sustituible en pruebas. |
| `src/features/home/tests/` | Pruebas de componente y de límites entre capas para los comportamientos de esta feature. |

Los nombres y rutas son una propuesta mínima; se ajustarán si el scaffold de T05 establece convenciones equivalentes.

## 5. Estrategia de pruebas

- **Unitarias:** comprobar la transición de selección de página y que seleccionar no invoque ninguna carga de previsualización.
- **Componente:** verificar landmarks y controles semánticos; selección con ratón y teclado; que activar el botón de maquetación no seleccione la fila ni ejecute una acción.
- **Integración/arquitectura:** comprobar que las capas previstas existen y que las dependencias respetan la dirección permitida; comprobar que el código cliente no importa módulos de Node ni usa APIs del sistema de archivos.
- **E2E:** con Playwright, abrir la SPA y verificar el heading principal «ShopMaker» y los landmarks `navigation`, `main` y `complementary`; comprobar la composición a 1280×800 y ausencia de scroll horizontal a 1024×720.
- **Componente:** verificar enlaces login/registro, botón de tema con nombre accesible «Cambiar tema», mensaje de lista vacía, selección y controles inactivos; estos tests usan datos/fixtures deterministas y no requieren que el smoke test imponga rutas todavía pendientes de coordinación con PBI-005.
- **Accesibilidad:** probar recorrido por teclado, orden de foco y foco visible en los controles operables. Los controles sin función no deben simular acciones. Revisar zoom al 200 % conforme a RNF-04.
- **Tema:** comprobar que el botón se presenta en la navegación y es accesible; no probar un cambio de tema en PBI-001, porque la funcionalidad y el estado son responsabilidad de PBI-002.
- **Visual:** verificar que encabezado, navegación, aside y área central están presentes en los viewports de CA-01; no se requiere comparación de capturas.
- **Seguridad:** inspeccionar dependencias/imports del cliente para confirmar que solo usa APIs del navegador y no contiene secretos. CSP y configuración del hosting quedan fuera de este PBI.

### Datos y mocks

- Usar datos ficticios en memoria para que las pruebas tengan páginas seleccionables; proveer una fixture vacía para comprobar el estado «Ninguna Web en Progreso». No usar red real ni datos personales.
- No crear adaptador de API mock ni contrato de red: corresponden a PBI-003.
- La lista vacía muestra «Ninguna Web en Progreso». La aplicación inicia sin página seleccionada; los nombres definitivos de páginas no están especificados y no se fijan en pruebas.
- El área central muestra «Seleccione una web para visualizar» mientras no hay selección; al seleccionar, el mensaje desaparece. No cargar ni renderizar contenido de previsualización.
- Vitest, React Testing Library y Playwright son el stack previsto por ADR-001/ADR-002; los comandos y la configuración efectiva dependen de PBI-004.

## 6. Matriz de trazabilidad spec-test

> Cada RF y cada criterio de aceptación tiene al menos una prueba prevista. Las rutas que dependen de PBI-005 se concretarán al coordinar ese PBI.

| ID | Requerimiento / Criterio | Tipo de prueba | Test previsto | Estado |
|---|---|---|---|---|
| RF-01 | Composición: navegación por encima del título «ShopMaker», enlaces «Iniciar sesión»/«Registrarse», botón «Cambiar tema», aside con lista o estado vacío, área central con el mensaje inicial y layout en viewports objetivo. | E2E / componente | `[PBI-001][CA-01] app-arranque` verifica título y landmarks; `home-layout` verifica la composición; `empty-pages-message` usa una fixture vacía y verifica el texto exacto. | Pendiente |
| RF-02 | Separación entre presentación, aplicación, dominio e infraestructura. | Arquitectura | `layer-boundaries.test.ts`: comprueba estructura y dependencias permitidas. | Pendiente |
| RF-03 | Enlaces de login/registro; selección operable; botones futuros habilitados pero inertes; selección sin previsualización. | Componente | `HomePage.test.tsx`: comprueba enlaces acordados con PBI-005, selección por teclado/ratón, desaparición del mensaje, controles futuros focalizables y que activarlos no ejecuta acciones ni selecciona una página. | Pendiente |
| RF-04 | Smoke test E2E de arranque. | E2E | `[PBI-001][CA-01] app-arranque`: abre la SPA y verifica el heading principal «ShopMaker» y los landmarks `navigation`, `main` y `complementary`. | Pendiente |
| RF-05 | Botón accesible «Cambiar tema» ubicado en la navegación; alternancia a cargo de PBI-002. | Componente | `theme-button-placement`: comprueba que el botón está dentro de la navegación y tiene nombre accesible «Cambiar tema»; el cambio de tema se prueba en PBI-002. | Pendiente |
| RNF-01 | Foco visible y operación por teclado en controles aplicables. | Componente / revisión manual | `HomePage.test.tsx`: recorrido por teclado y foco; revisión manual de foco visible y contraste. | Pendiente |
| RNF-02 | Compatibilidad y layout objetivo. | E2E | `home-screen.spec.ts`: Chromium y Firefox; viewports 1280×800 y 1024×720 sin overflow horizontal. | Pendiente |
| RNF-03 | Cliente limitado a APIs del navegador y sin secretos. | Arquitectura / revisión estática | `client-boundary.test.ts`: sin imports de Node/sistema de archivos; revisar configuración de CSP como fuera de alcance. | Pendiente |
| RNF-04 | Contenido y funcionalidad disponibles con zoom al 200 %. | Revisión manual | `accessibility-checklist`: inspeccionar navegación, lista y controles a zoom 200 %. | Pendiente |
| CA-01 | Navegación sobre el título con enlaces «Iniciar sesión»/«Registrarse» y botón «Cambiar tema», lista con estado vacío, mensaje central inicial, pantalla a 1280×800 y sin scroll horizontal a 1024×720; sin contacto. | E2E / componente | `home-screen.spec.ts` verifica posición, enlaces, botón, mensaje central, landmarks y `document.documentElement.scrollWidth <= window.innerWidth`; una prueba con fixture vacía verifica «Ninguna Web en Progreso». | Pendiente |
| CA-02 | Capas distinguibles en el código. | Arquitectura | `layer-boundaries.test.ts`: verifica estructura y reglas de importación. | Pendiente |
| CA-03 | No hay APIs de Node ni del sistema de archivos en el código cliente. | Arquitectura | `client-boundary.test.ts`: busca imports y globales prohibidos en el código de cliente. | Pendiente |
| CA-04 | Selección con teclado/ratón separada de botones habilitados e inertes; quitar mensaje y no mostrar preview. | Componente | `HomePage.test.tsx`: verifica que los botones futuros reciben foco, su activación no tiene efecto, el botón de maquetación no selecciona la página y el control de selección quita el mensaje sin renderizar preview. | Pendiente |
| CA-05 | Smoke test E2E de arranque, heading principal y landmarks. | E2E | `[PBI-001][CA-01] app-arranque`: verifica heading «ShopMaker» y roles `navigation`, `main` y `complementary`; también cubre CA-01 en lo referente a arranque/estructura básica. | Pendiente |
| CA-06 | Botón accesible «Cambiar tema» en la navegación; el cambio corresponde a PBI-002. | Componente / integración posterior | `theme-button-placement` verifica presencia, ubicación y nombre; PBI-002 verifica alternancia y anuncio del estado. | Pendiente |

## 7. Plan TDD por incrementos

| Incremento | Comportamiento | Test rojo | Implementación mínima | Refactor |
|---|---|---|---|---|
| 1 — Arranque y límites de arquitectura | La SPA arranca y distingue las cuatro capas sin APIs de Node/sistema de archivos en el cliente. | T04: `[PBI-001][CA-01] app-arranque` falla por falta del encabezado/landmarks con servidor E2E operativo. T05: `layer-boundaries.test.ts` y `client-boundary.test.ts` fallan por ausencia de estructura/límites. | T05 crea el punto de entrada y la estructura mínima por capas con dependencias permitidas. | Eliminar configuración innecesaria y simplificar módulos sin romper los límites. |
| 2 — Pantalla base | La composición descrita, navegación, título textual y mensajes iniciales se muestran en los viewports requeridos. | `home-screen.spec.ts` falla si faltan el título, enlaces, botón, textos iniciales o si hay overflow. | T06 añade navegación sobre el título, enlaces login/registro coordinados con PBI-005, botón de tema, aside, lista y mensaje inicial central. | Ajustar estilos para eliminar duplicación y overflow. |
| 3 — Selección accesible | Una página se selecciona con teclado/ratón; el botón de maquetación separado no activa la fila; el mensaje desaparece y no hay preview funcional. | `HomePage.test.tsx` falla al no seleccionar, al propagar el evento del botón, si los controles inertes no reciben foco o si producen una acción. | T06 añade estado local de selección y controles semánticos sin acción futura. | Extraer solo lógica repetida y mantener foco/semántica. |
| 4 — Botón de tema | El botón accesible aparece en la navegación; no cambia el tema dentro de PBI-001. | `theme-button-placement` falla si falta el botón, su ubicación o su nombre accesible «Cambiar tema». | T06 añade el botón visual; PBI-002 implementa la alternancia y el estado del tema. | Mantener el comportamiento de tema fuera de PBI-001 y evitar lógica duplicada. |

## 8. Riesgos técnicos

| Riesgo | Probabilidad | Impacto | Mitigación |
|---|---|---|---|
| Las rutas de login y registro aún no están acordadas. | Media | Alto | Coordinar rutas con PBI-005 antes de cerrar las pruebas de navegación. |
| Los botones de futuro se confunden con controles funcionales. | Media | Medio | Etiquetarlos de forma clara, evitar acciones y verificar que no cambian la selección. |
| La estructura por capas se sobredimensiona para una pantalla mínima. | Media | Medio | Añadir solo módulos mínimos exigidos por RF-02; no introducir router, estado global ni API. |
| Los comandos de pruebas E2E aún dependen de la configuración de PBI-004. | Media | Medio | Coordinar T04 con PBI-004 T03 (#19); mantener la prueba definida sin duplicar la configuración del arnés. |
| El botón de tema podría duplicar lógica o no coincidir con la funcionalidad de PBI-002. | Media | Medio | PBI-001 implementa solo el control visual en la navegación; PBI-002 aporta la funcionalidad y el estado, sin duplicarlos. |

## 9. Checklist de aprobación del plan

- [x] La arquitectura respeta SOLID y KISS.
- [x] No se introducen dependencias sin justificar.
- [x] La matriz spec-test cubre todos los RF, RNF relevantes y CA; distingue el botón de tema (PBI-001) de su funcionalidad (PBI-002).
- [x] Los estados no aplicables y los pendientes de definición están identificados.
- [x] Hay estrategia de accesibilidad y seguridad.
- [x] El alcance de PBI-001 separa la presencia visual del botón de tema de la alternancia implementada por PBI-002; las rutas aún abiertas se coordinan con PBI-005.
