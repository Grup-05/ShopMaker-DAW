---
trigger: always_on
---

# Regla de Perfil: Frontend UI/UX del CMS ShopMaker (profile-uiux.md)

Este documento define las directrices de arquitectura, metodología, accesibilidad y calidad para el desarrollo del **frontend del CMS ShopMaker**.

Hereda el marco de gobernanza global definido en [AGENTS.md](AGENTS.md). La metodología de trabajo es **Scrum con SDD y TDD**. El marco de proceso se define en [methodology-scrum.md](methodology-scrum.md) y la práctica de pruebas en [methodology-tdd.md](methodology-tdd.md).

En caso de conflicto entre este perfil y la Constitución Global, prevalece siempre `AGENTS.md`. Este perfil conserva las reglas técnicas de frontend, UI/UX, accesibilidad, SOLID y KISS.

---

## 0. Contexto, alcance y principios rectores

### 0.1. Producto y arquitectura

- **ShopMaker** es un CMS que permite a los usuarios comprar módulos y construir su propia página web, con alojamiento proporcionado por la plataforma.
- La arquitectura global del sistema es de **tres capas**: frontend, backend/API y base de datos.
- **Este repositorio contiene exclusivamente el frontend.** Queda prohibido implementar lógica de backend, acceso directo a base de datos, migraciones, secretos de servidor o reglas de negocio que correspondan a la API.
- La primera entrega es un **aplicativo de escritorio**. El perfil se aplica con enfoque *desktop-first*, independientemente de que el shell sea nativo (Electron, Tauri u otro) o una aplicación web instalable.
- Las **webs generadas por los clientes** sí deben ser responsive y *mobile-first*. La interfaz de administración del CMS, en cambio, se diseña para escritorio.

### 0.2. Principios rectores

1. **Scrum + SDD + TDD:** No-Spec-No-Code y tests antes del código.
2. **SOLID:** separación de responsabilidades, bajo acoplamiento y extensibilidad controlada.
3. **KISS / YAGNI:** la solución más simple que cumpla la especificación; nada de abstracciones prematuras.
4. **Accesibilidad WCAG 2.1 AA:** como referencia mínima de calidad, adaptada a escritorio.
5. **Seguridad por diseño:** especialmente en contenido generado por usuarios, compras, módulos y previsualizaciones.
6. **Trazabilidad:** toda decisión relevante queda registrada en `specs/`, `docs/scrum/`, `CHANGELOG.md` y `PROXIMOS_PASOS.md`.

---

## 1. Desarrollo Guiado por Especificaciones (SDD) — No-Spec-No-Code

### 1.1. Spec por PBI

Cada PBI del Product Backlog tendrá su propia carpeta:

```text
specs/PBI-###-<slug>/
├── spec.md
├── plan.md
└── tasks.md
```

La especificación se redacta de forma **just-in-time** durante el refinamiento y el Sprint Planning. No se redacta un diseño completo de todo el producto al inicio.

### 1.2. Condición para escribir código

Antes de la primera línea de código de producción:

1. El PBI cumple la **Definition of Ready**.
2. `spec.md`, `plan.md` y `tasks.md` están aprobados, incluyendo la matriz de pruebas.
3. Se ha confirmado el commit atómico:

```text
docs(spec): definir requerimientos, plan técnico, tareas y matriz de pruebas para PBI-### <slug>
```

### 1.3. Cambios durante el Sprint

Si aparece una necesidad no especificada:

1. Detener la implementación.
2. Consultar al PO si afecta al alcance.
3. Actualizar la spec, el plan, las tareas y la matriz de pruebas.
4. Confirmar el cambio con `docs(spec): ...`.
5. Reanudar solo con aprobación.

Los **spikes** son timeboxed, producen hallazgos documentados y su código **no** se integra como producción sin especificación.

---

## 2. Arquitectura frontend: SOLID, KISS y testabilidad

### 2.1. Separación por capas

1. **Presentación:** componentes visuales, páginas, layouts y estilos.
2. **Aplicación/estado:** casos de uso, coordinación de acciones y estado de la interfaz.
3. **Dominio:** entidades, tipos, reglas de validación y lógica propia del CMS.
4. **Infraestructura:** adaptadores de API, almacenamiento local, shell de escritorio e IPC.

Reglas de dependencia:

- La presentación no importa directamente infraestructura.
- El dominio no depende de frameworks, HTTP ni del shell de escritorio.
- La infraestructura implementa interfaces o puertos definidos por la aplicación/dominio.
- Los componentes visuales no contienen reglas de negocio ni llamadas de red directas.

### 2.2. Aplicación de SOLID

- **Single Responsibility:** cada componente, servicio o módulo debe tener una única razón para cambiar. Separar UI, estado, validación y acceso a datos.
- **Open/Closed:** el sistema de módulos del CMS debe poder ampliarse mediante registro, composición o manifiestos, sin modificar el núcleo de la interfaz por cada módulo nuevo.
- **Liskov Substitution:** cualquier adaptador o implementación de un puerto debe respetar el mismo contrato y comportamiento observable.
- **Interface Segregation:** props, puertos e interfaces pequeñas y específicas. Evitar objetos gigantes y props comodín.
- **Dependency Inversion:** los casos de uso dependen de abstracciones; los adaptadores concretos se inyectan desde la capa de composición.
- **Testabilidad:** el diseño debe permitir probar el comportamiento sin levantar toda la aplicación. Las dependencias externas se inyectan mediante puertos y adaptadores. La lógica de dominio debe ser pura o tener efectos secundarios aislados en los bordes. Evitar estado global oculto y dependencias implícitas.

### 2.3. Aplicación de KISS y YAGNI

- Preferir soluciones explícitas y legibles frente a patrones complejos.
- No crear abstracciones genéricas hasta que existan al menos dos o tres casos reales que las justifiquen.
- No introducir librerías, gestores de estado o capas adicionales sin justificarlo en `plan.md`.
- Evitar la sobreingeniería, la configuración innecesaria y los patrones por moda.
- Composición antes que herencia.
- Si dos soluciones cumplen la spec, elegir la más simple de mantener y probar.
- Los tests también deben ser simples, legibles y mantenibles. Evitar sobre-mockear y testear detalles internos.

### 2.4. Estructura orientativa

La estructura concreta se definirá en el `plan.md` de cada feature, pero se recomienda un enfoque *feature-first*:

```text
src/
├── app/                  # Arranque, routing, providers, tema y shell
├── features/
│   └── <feature>/
│       ├── components/   # Presentación específica
│       ├── domain/       # Tipos y reglas propias
│       ├── application/  # Casos de uso y estado
│       ├── infrastructure/ # Adaptadores de API y almacenamiento
│       └── tests/
└── shared/
    ├── ui/               # Componentes reutilizables
    ├── hooks/
    ├── lib/
    └── styles/           # Tokens y estilos globales
```

Esta estructura es orientativa y debe adaptarse al stack acordado, sin romper la separación de responsabilidades.

### 2.5. Frontera con el backend

- El contrato de API es la fuente de verdad. Debe documentarse en la spec o en un contrato OpenAPI/JSON Schema.
- Todo acceso al backend pasa por un adaptador de infraestructura. Prohibido dispersar `fetch`, `axios` o similares por componentes.
- Los DTO deben tiparse y validarse en la frontera.
- Los errores de red deben normalizarse a un modelo común.
- Debe existir un adaptador mock para desarrollar sin backend y para pruebas deterministas.
- La interfaz debe cubrir obligatoriamente los estados de carga, vacío, error, reintento y ausencia de conexión.
- Prohibido asumir detalles internos del backend, nombres de tablas, estructuras de base de datos o lógica de servidor.

### 2.6. Sistema de módulos comprables

- Cada módulo debe declararse mediante un manifiesto con: identificador, versión, permisos, configuración, recursos y puntos de extensión.
- El núcleo del CMS no debe modificarse para añadir un módulo nuevo.
- La UI puede mostrar y configurar módulos, pero **la compra, la titularidad y los permisos se validan siempre en el backend**.
- Los módulos remotos no deben ejecutar código arbitrario en el renderer. Deben aplicarse listas de permitidos, sandboxing y validación de manifiestos.
- Toda integración de módulos debe especificar su comportamiento ante errores, incompatibilidades y permisos insuficientes.

### 2.7. Shell de escritorio

- La ventana debe soportar redimensionado y un tamaño mínimo definido en la spec.
- La navegación debe funcionar con teclado y ratón.
- Si se usa un shell nativo tipo Electron o Tauri:
  - Aislar el renderer (`contextIsolation`, sin `nodeIntegration`).
  - Exponer IPC únicamente mediante un preload con canales permitidos.
  - Validar todos los payloads recibidos desde el renderer.
  - No almacenar secretos en el proceso de renderizado.
- Si se distribuye como aplicación web de escritorio, respetar las limitaciones del navegador y no asumir acceso al sistema de archivos.

---

## 3. UI/UX, accesibilidad y sistema visual

### 3.1. Enfoque desktop-first

- Resolución de referencia: **1280×800**.
- Tamaño mínimo de ventana soportado: **1024×720**, salvo justificación en la spec.
- Adaptación progresiva a tablet y móvil cuando la feature lo requiera.
- Las **webs generadas por los clientes** se diseñan *mobile-first*, con puntos de verificación en 360, 768, 1280 y 1440 px.
- No ocultar acciones críticas detrás de `hover`; deben ser accesibles por teclado y visibles en todo momento.

### 3.2. Accesibilidad WCAG 2.1 AA

- Contraste de texto ≥ **4.5:1**; controles e iconos ≥ **3:1**.
- No transmitir información únicamente mediante color.
- Foco visible y orden de tabulación lógico.
- Navegación completa por teclado.
- Etiquetas explícitas en formularios y mensajes de error asociados.
- HTML semántico y ARIA solo cuando sea necesario.
- Respetar `prefers-reduced-motion`.
- Soportar zoom al 200 % sin pérdida de contenido ni funcionalidad.
- Objetivos táctiles de **44×44 px** en superficies táctiles y webs generadas; en escritorio, mínimo **24×24 px**.

### 3.3. Tokens y sistema visual

- Todos los colores, espaciados, radios, sombras y tipografías se definen mediante tokens semánticos (`--color-*`, `--spacing-*`, `--radius-*`, `--font-*`).
- Prohibido usar colores hexadecimales dispersos en componentes.
- Los temas claro y oscuro deben consumir los mismos tokens.
- Cualquier cambio de tokens se documenta en `specs/visual-design-specs.md`.

### 3.4. Estados de interfaz obligatorios

Toda pantalla o componente con datos debe contemplar:

- Carga.
- Vacío con guía de acción.
- Error con opción de reintento.
- Éxito.
- Deshabilitado con motivo visible.
- Sin permisos.
- Sin conexión o modo degradado.
- Contenido largo y listas extensas.

### 3.5. Formularios y editor

- Validación en línea y resumen de errores cuando proceda.
- No perder datos del usuario al navegar o cerrar, salvo confirmación explícita.
- Confirmación en acciones destructivas.
- Autoguardado o recuperación de borradores en el editor de webs.
- Mensajes claros, en lenguaje de usuario, sin códigos internos.

### 3.6. Rendimiento

- Virtualizar listas largas, especialmente catálogos de módulos.
- Carga diferida de editor, previsualizaciones y recursos pesados.
- Evitar bloqueos del hilo principal.
- El presupuesto de rendimiento concreto se define en la spec de cada feature.

---

## 4. Seguridad del frontend CMS

1. **Cero secretos:** prohibido incluir claves, tokens, contraseñas o credenciales en el frontend.
2. **Autenticación:** el almacenamiento de sesión se define con el backend. Preferir almacenamiento seguro del sistema operativo o cookies `HttpOnly`; evitar tokens de larga duración en `localStorage`.
3. **XSS y contenido generado:** todo HTML, CSS o JS creado por el usuario debe sanitizarse.
4. **Previsualización segura:** usar `iframe` con `sandbox`, CSP estricta y, preferiblemente, origen aislado.
5. **Prohibido `eval`, `new Function` y ejecución de código remoto no verificado.**
6. **Compras y titularidad:** la UI nunca calcula precios finales ni permisos definitivos; solo refleja lo que confirme el backend.
7. **Módulos:** validar manifiestos, permisos y compatibilidad antes de activarlos.
8. **IPC:** canales permitidos, validación de payloads y mínimo privilegio.
9. **Dependencias:** lockfiles versionados y auditoría periódica.
10. **Privacidad:** no registrar datos personales ni secretos en logs, telemetría o mensajes de error.

---

## 5. TDD, pruebas y validación

La práctica TDD se define en [methodology-tdd.md](methodology-tdd.md). En este perfil se aplica con enfoque frontend y escritorio.

### 5.1. Niveles de prueba

- **Unitarias:** dominio, validaciones, utilidades y casos de uso.
- **Componentes:** renderizado, interacción, estados y accesibilidad básica.
- **Integración:** adaptadores contra mocks del contrato de API.
- **Contrato:** esquemas de petición y respuesta.
- **E2E:** flujos críticos como registro, inicio de sesión, catálogo, compra simulada, activación de módulos, edición y publicación de una web, y panel de alojamiento.
- **Visuales:** componentes críticos y previsualizaciones en los viewports definidos.
- **Accesibilidad:** comprobaciones automáticas y revisión manual con teclado y lector de pantalla.
- **Seguridad:** sanitización, sandbox de previsualización, permisos e IPC.
- **Empaquetado:** prueba de arranque de la aplicación de escritorio en el sistema objetivo.

### 5.2. Reglas

- Las pruebas deben ser independientes, deterministas y no depender de servicios reales ni compras reales.
- Los tests se derivan de los criterios de aceptación.
- Cada criterio de aceptación debe tener al menos un test automatizado.
- Se busca por rol, etiqueta o texto visible, no por clases CSS.
- Toda lógica nueva o modificada debe tener pruebas asociadas.
- No se considera terminada una feature sin cubrir sus estados críticos y sus errores esperados.
- Los bugs se corrigen con prueba de regresión previa.
- La suite debe estar en verde antes del PR.
- Los bancos de prueba visual se confirman con `test(visual): ...`.

---

## 6. Ciclo de trabajo dentro del Sprint

1. **Refinamiento:** aclarar PBI, criterios de aceptación, dependencias y UX.
2. **Sprint Planning:** seleccionar PBI, definir Sprint Goal y desglosar tareas, incluyendo las de prueba.
3. **Especificación:** completar `spec.md`, `plan.md`, `tasks.md` y la matriz de pruebas; commit `docs(spec)`.
4. **TDD:** lista de tests → test rojo → implementación verde → refactor.
5. **Implementación:** rama `feature/PBI-###-<slug>`, código, pruebas y commits atómicos.
6. **Revisión:** PR, hooks, accesibilidad y Definition of Done.
7. **Sprint Review:** demo y aceptación del PO.
8. **Retrospectiva:** acciones de mejora.
9. **Cierre:** actualizar Product Backlog, `CHANGELOG.md` y `PROXIMOS_PASOS.md`.

No se genera todo el código de una vez. Cada PBI se implementa en incrementos pequeños y verificables.

---

## 7. Commits y atomicidad

Se aplica estrictamente Conventional Commits v1.0.0 y el ciclo atómico:

1. `docs(spec): ...`
2. `test(...)` (rojo, en rama de trabajo)
3. `feat(...)` o `fix(...)` (verde)
4. `refactor(...)` (opcional)
5. `docs(...)`

Queda prohibido mezclar `feat` con `fix`, o código funcional con documentación pública en un mismo commit. Los tests rojos solo permanecen en la rama de trabajo.

Ámbitos recomendados para este perfil:

- **Aplicación:** `app`, `shell`, `routing`, `state`, `api`, `forms`
- **CMS:** `auth`, `catalog`, `modules`, `checkout`, `billing`, `builder`, `editor`, `templates`, `preview`, `hosting`, `dashboard`
- **UI/UX:** `ui`, `tokens`, `theme`, `layout`, `a11y`, `visual`, `desktop`
- **Calidad:** `tests`, `docs`, `security`

Todo commit funcional debe incluir en el pie:

```text
Refs: PBI-###
Sprint: S##
```

Los documentos de proceso usan `docs(scrum): ...`. Las specs usan `docs(spec): ...`.

---

## 8. Definition of Done

La DoD completa se define en [methodology-scrum.md](methodology-scrum.md) y en `docs/scrum/definition-of-done.md`.

Para este perfil, además:

- [ ] La UI cubre estados de carga, vacío, error, permisos y sin conexión.
- [ ] Se ha validado accesibilidad por teclado, foco y contraste.
- [ ] No hay secretos ni rutas privadas.
- [ ] El hook SAST finaliza limpio.
- [ ] Cada criterio de aceptación tiene prueba automatizada.
- [ ] La suite está en verde.
- [ ] No hay tests omitidos, desactivados o debilitados sin justificación.
- [ ] La matriz spec-test está actualizada.
- [ ] El PBI es demostrable en el Sprint Review.

---

## 9. Checklist mandatario pre-release / pre-tag

Antes de crear un tag o una entrega:

1. `[CHECK 0 - Sprint Review]:` El PO ha aceptado el incremento y el Sprint Goal se ha cumplido o justificado.
2. `[CHECK 0.1 - Suite]:` Todas las pruebas pasan y la matriz de criterios está completa (100 %).
3. `[CHECK 1 - Build y empaquetado]:` La aplicación compila y arranca en el sistema objetivo.
4. `[CHECK 2 - Escritorio]:` Se valida la ventana en 1024×720, 1280×800 y 1440×900, incluyendo redimensionado y navegación por teclado.
5. `[CHECK 3 - Accesibilidad]:` Contraste, foco, etiquetas, zoom y navegación sin ratón.
6. `[CHECK 4 - Seguridad CMS]:` Previsualización aislada, contenido sanitizado y ausencia de secretos.
7. `[CHECK 5 - Contrato API]:` Compatibilidad verificada con la versión del backend acordada.
8. `[CHECK 6 - Trazabilidad]:` `CHANGELOG.md`, `README.md` y `PROXIMOS_PASOS.md` actualizados.
9. `[CHECK 7 - Distribución limpia]:` El paquete de release no incluye `.agent/`, `.github/`, `specs/`, `plantillas/` ni metadatos de gobernanza.
10. `[CHECK 8 - Proceso]:` `review.md`, `retrospective.md` y `PROXIMOS_PASOS.md` están actualizados.

---

## 10. Regla de precedencia

Este perfil se interpreta junto con [methodology-scrum.md](methodology-scrum.md) y [methodology-tdd.md](methodology-tdd.md). Las reglas de proceso Scrum no relajan las obligaciones técnicas de `AGENTS.md`.

Cualquier evolución del núcleo debe realizarse exclusivamente en `main`, validarse y propagarse después mediante:

```bash
bash .agent/hooks/sync-governance.sh
```
