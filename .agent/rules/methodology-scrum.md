---
trigger: always_on
---

# Regla de Metodología: Scrum y SDD (methodology-scrum.md)

Este documento define el marco de trabajo Scrum del proyecto **ShopMaker-DAW** y su integración con Specification Driven Development (SDD), Test-Driven Development (TDD), SOLID y KISS.

Hereda la Constitución Global definida en [AGENTS.md](AGENTS.md) y complementa el perfil técnico [profile-uiux.md](profile-uiux.md).

En caso de conflicto, prevalece `AGENTS.md`. El ciclo atómico de commits y las prohibiciones de operaciones autónomas de la Constitución Global se mantienen íntegramente.

---

## 0. Principios de adaptación

Scrum no sustituye la gobernanza técnica: la complementa.

1. **Scrum empírico:** transparencia, inspección y adaptación.
2. **SDD como puerta de calidad:** la especificación es obligatoria por PBI antes de escribir código, pero se redacta de forma *just-in-time*, no como un diseño completo inicial.
3. **TDD:** los tests se derivan de la especificación y se escriben antes de la implementación. El ciclo es **rojo → verde → refactor**.
4. **Product Backlog emergente:** los requisitos pueden evolucionar entre Sprints.
5. **Sprint como timebox:** el Sprint es un periodo de tiempo, **no una rama de Git**.
6. **Incremento potencialmente desplegable:** al final del Sprint debe existir algo demostrable, verificable y con la suite en verde.
7. **Gobernanza técnica no negociable:** hooks, SAST, Conventional Commits, revisión humana y trazabilidad siguen siendo obligatorios.

---

## 1. Roles y responsabilidades

### 1.1. Product Owner (PO)

- Es el único responsable de maximizar el valor del producto.
- Gestiona, ordena y prioriza el **Product Backlog**.
- Define y aclara los criterios de aceptación junto con los Developers.
- Decide qué PBIs entran en cada Sprint y participa en la aceptación del incremento.
- Es la única figura que puede cambiar el alcance de un Sprint.
- No impone soluciones técnicas; confía la arquitectura a los Developers.

### 1.2. Scrum Master

- Facilita las ceremonias y elimina impedimentos.
- Vela por el cumplimiento de este marco, de `AGENTS.md` y del perfil técnico.
- Coaches al equipo en Scrum, SDD, TDD y calidad.
- No asigna tareas técnicas ni actúa como jefe de proyecto.
- Escala bloqueos que el equipo no pueda resolver.

### 1.3. Developers

- Son un equipo autoorganizado y multifuncional.
- Estiman los PBIs y construyen el incremento.
- Crean el **Sprint Backlog** y se comprometen con el **Sprint Goal**.
- Aplican SDD, TDD, SOLID, KISS, pruebas y accesibilidad.
- Escriben las pruebas antes del código de producción y las mantienen como parte del incremento.
- No consideran terminada una tarea sin evidencia de tests verdes.
- Revisan el trabajo de sus compañeros y participan en la demo.
- Actualizan el tablero y comunican bloqueos.

### 1.4. Cliente y stakeholders

- Participan en el **Sprint Review**.
- Aportan feedback funcional y priorizan valor junto al PO.
- No modifican directamente el Sprint Backlog ni el alcance del Sprint.

### 1.5. Agente de IA

El agente de IA actúa como asistente técnico de los Developers, bajo supervisión humana:

- Puede proponer PBIs, especificaciones, planes, tareas, tests y soluciones técnicas.
- No puede autoasignarse trabajo ni cambiar prioridades.
- No puede alterar el alcance del Sprint sin decisión del PO.
- Debe aplicar SDD antes de escribir código funcional.
- Debe escribir primero la prueba que falla, mostrar el rojo y después implementar el mínimo necesario.
- No puede desactivar, eliminar o debilitar pruebas para obtener verde.
- No puede modificar un criterio de aceptación o una aserción sin aprobación humana.
- Debe preguntar la motivación técnica ante parámetros o decisiones no justificadas.
- **No puede ejecutar `git commit` ni `git push` sin aprobación humana explícita.**
- **No puede crear ni fusionar Pull Requests sin presentar antes el plan y obtener aprobación humana explícita.**
- **No puede desactivar protecciones de rama (`enforce_admins`) ni usar `--admin` para saltarse la revisión por pares en PRs de desarrollo (`feature/*`, `fix/*`).**
- **No puede fusionar ni promover código o PBIs hacia `main` (producción) sin especificar previamente el merge y recibir la orden humana explícita: *"Mandar a producción"* o *"Procede con el paso a producción"*.**
- Debe reportar bloqueos, riesgos y dependencias no resueltas.

En equipos académicos reducidos, los roles pueden combinarse, pero las responsabilidades no deben diluirse. El Cliente actúa como stakeholder.

---

## 2. Artefactos y trazabilidad

### 2.1. Product Backlog

Ubicación: `docs/scrum/product-backlog.md`.

Cada elemento se identifica como `PBI-###` y contiene:

- ID, título y descripción en formato historia de usuario.
- Valor de negocio y prioridad.
- Criterios de aceptación verificables.
- Estimación del equipo.
- Estado: `Nuevo`, `Refinado`, `En Sprint`, `Terminado`, `Descartado`.
- Sprint asignado.
- Dependencias y riesgos.
- Enlace a `specs/PBI-###-<slug>/`.
- Enlace a su rama y PR cuando existan.

### 2.2. Sprint Backlog

Ubicación: `docs/scrum/sprints/S##/sprint-backlog.md`.

Contiene:

- Sprint Goal.
- PBIs seleccionados.
- Tareas atómicas derivadas de `tasks.md`.
- Lista de tests derivada de la spec.
- Tareas TDD: test rojo, implementación verde y refactor.
- Responsable de cada tarea.
- Estimación y estado.
- Evidencia: commit, PR, pruebas o demo.
- Bloqueos e impedimentos.

### 2.3. Incremento

Es la suma de los PBIs que cumplen la Definition of Done al final del Sprint. Debe ser:

- Demostrable en el Sprint Review.
- Potencialmente desplegable.
- Coherente con el Sprint Goal.
- Con la suite de pruebas en verde.
- Registrado en `CHANGELOG.md` cuando se publique una versión.

### 2.4. Definition of Ready y Definition of Done

- `docs/scrum/definition-of-ready.md`
- `docs/scrum/definition-of-done.md`

Son documentos vivos: si cambian, se confirman con `docs(scrum): ...` y se comunican al equipo.

### 2.5. Tablero

Se puede usar GitHub Projects, Kanban o una tabla Markdown. Columnas mínimas:

`Product Backlog` → `Sprint Backlog` → `En progreso` → `En revisión` → `Hecho`

El tablero es la fuente de verdad operativa. `PROXIMOS_PASOS.md` es solo un resumen de estado.

### 2.6. Trazabilidad obligatoria

| Elemento | Formato |
|---|---|
| PBI | `PBI-012` |
| Sprint | `S01`, `S02`, ... |
| Spec | `specs/PBI-012-<slug>/` |
| Rama | `feature/PBI-012-<slug>` |
| PR | `[PBI-012] <título>` |
| Commit | `feat(scope): ...` + pie `Refs: PBI-012` y `Sprint: S01` |
| Revisión | `docs/scrum/sprints/S01/review.md` |
| Retrospectiva | `docs/scrum/sprints/S01/retrospective.md` |

---

## 3. Eventos Scrum

Duración de Sprint por defecto: **2 semanas**. Puede ajustarse al calendario académico, pero debe mantenerse fija durante el Sprint.

| Evento | Frecuencia | Timebox orientativo | Salida |
|---|---|---|---|
| Refinamiento | Al menos una vez por Sprint | 1 h | PBIs listos según DoR |
| Sprint Planning | Inicio del Sprint | 2 h | Sprint Goal y Sprint Backlog |
| Daily Scrum | Diario | 15 min | Progreso, bloqueos y plan del día |
| Sprint Review | Final del Sprint | 1 h | Demo, feedback y Backlog actualizado |
| Sprint Retrospective | Final del Sprint | 45–75 min | Acciones de mejora con responsable |
| Sprint | 2 semanas | — | Incremento potencialmente desplegable |

### 3.1. Refinamiento

- Se revisan los PBIs candidatos para los próximos Sprints.
- Se aclaran criterios de aceptación, dependencias, riesgos y UX.
- Se estima de forma colaborativa.
- Un PBI solo pasa a `Refinado` cuando cumple la Definition of Ready.

### 3.2. Sprint Planning

Responde a:

- **¿Qué?** PBIs seleccionados según prioridad y capacidad.
- **¿Cómo?** Tareas técnicas y de prueba derivadas de `plan.md` y `tasks.md`.

Salidas obligatorias:

- Sprint Goal escrito en `sprint-goal.md`.
- Sprint Backlog creado.
- Specs, planes y tareas de los PBIs seleccionados aprobados o planificados antes de la primera línea de código.
- Riesgos y dependencias identificados.
- Esfuerzo de pruebas estimado y entorno de pruebas definido.

### 3.3. Daily Scrum

- 15 minutos, mismo horario.
- Cada Developer responde: qué hizo, qué hará y qué bloqueos tiene.
- No es un informe de estado para el Scrum Master.
- El tablero se actualiza después.
- No se exige documentación diaria extensa; los bloqueos relevantes se registran en el Sprint Backlog.

### 3.4. Sprint Review

- Se demuestra el incremento funcionando.
- El PO acepta o rechaza PBIs según los criterios de aceptación.
- Se muestra la suite en verde y la matriz de criterios cubiertos.
- Los stakeholders aportan feedback.
- El Product Backlog se actualiza con nuevos PBIs o cambios de prioridad.
- Se registra en `review.md`.

### 3.5. Sprint Retrospective

- Se inspecciona el proceso, no a las personas.
- Se revisan las acciones del Sprint anterior.
- Se revisan tests frágiles, lentos o duplicados y huecos de cobertura.
- Se definen acciones concretas con responsable y fecha.
- Se registra en `retrospective.md`.

### 3.6. Sprint 0 opcional

Antes del primer Sprint funcional puede existir un **Sprint 0** para:

- Instalar y validar la gobernanza.
- Acordar el stack y la arquitectura base.
- Crear el Product Backlog inicial.
- Definir tokens, aplicación web y contrato de API.
- Preparar el tablero y las plantillas.

El Sprint 0 no produce un incremento funcional, pero sí un entorno listo para trabajar.

---

## 4. Flujo de un PBI

1. **Idea o necesidad** → se crea un PBI en el Product Backlog.
2. **Refinamiento** → se completan criterios de aceptación, estimación y dependencias hasta cumplir DoR.
3. **Sprint Planning** → el PO selecciona el PBI y el equipo define las tareas.
4. **Especificación** → se crean o actualizan `spec.md`, `plan.md`, `tasks.md` y la matriz de pruebas.
5. **Aprobación** → el usuario valida la spec y se confirma `docs(spec): ...`.
6. **Test list** → se enumeran los tests del siguiente comportamiento.
7. **TDD** → test rojo → implementación verde → refactor.
8. **Revisión** → PR, revisión de código, hooks y Definition of Done.
9. **Demo** → Sprint Review y aceptación del PO.
10. **Cierre** → se actualiza el Product Backlog, `CHANGELOG.md` y `PROXIMOS_PASOS.md`.
11. **Retrospectiva** → acciones de mejora del proceso.

### 4.1. Cambios de alcance durante el Sprint

- Solo el PO puede modificar el alcance.
- Si el cambio compromete el Sprint Goal, el equipo debe renegociar el alcance o, excepcionalmente, cancelar el Sprint.
- Todo cambio se refleja en el Sprint Backlog y en la spec correspondiente.
- Prohibido añadir trabajo "porque es rápido" sin pasar por el PO.

### 4.2. Errores e incidencias no planificadas

- Un bug relevante se registra como PBI y se prioriza.
- Un incidente crítico en producción puede atenderse como `hotfix/`, documentando el impacto y la deuda generada.
- El trabajo no planificado debe hacerse visible; no se oculta dentro de una tarea existente.

---

## 5. SDD dentro de Scrum

### 5.1. Spec por PBI, no por proyecto

No se redacta una especificación monolítica de todo el producto. Cada PBI tendrá su carpeta:

```text
specs/PBI-012-<slug>/
├── spec.md
├── plan.md
└── tasks.md
```

La spec puede evolucionar entre Sprints. Los cambios relevantes se confirman con un nuevo `docs(spec): ...`.

### 5.2. Relación entre DoR y spec

- La **Definition of Ready** garantiza que el PBI es comprensible, estimable y valioso.
- Antes de escribir código de producción, la spec, el plan y las tareas deben estar aprobados.
- Si existe incertidumbre técnica, se planifica un **spike timeboxed** cuyo resultado es un documento de hallazgos, no código de producción.
- El código de un spike no se integra en `develop` sin convertirse en una tarea especificada.

### 5.3. Contenido mínimo de la spec

- Contexto y problema.
- Historias de usuario y flujos.
- Requerimientos funcionales y no funcionales.
- Criterios de aceptación.
- Estados de interfaz.
- Contrato de API y dependencias del backend.
- Fuera de alcance.
- Riesgos y supuestos.

### 5.4. TDD como implementación de la spec

La spec define el contrato; TDD lo convierte en pruebas ejecutables.

- Cada criterio de aceptación se traduce en al menos un test.
- El test se escribe antes de la implementación.
- La matriz de trazabilidad spec-test se mantiene en `plan.md`.
- Si la spec cambia, primero se actualizan los tests y después el código.
- Toda la práctica se regula en `methodology-tdd.md`.

### 5.5. Decisiones arquitectónicas

Las decisiones relevantes se registran en `plan.md`. Si afectan a varias features o al sistema completo, se creará una decisión en `docs/decisiones/` con formato ADR ligero.

---

## 6. GitFlow compatible con Scrum

### 6.1. Ramas

- `main`: **rama de producción**, estable, desplegable y protegida. Nunca puede contener código a medias, especificaciones de PBIs sin terminar ni desarrollo en mitad de un Sprint.
- `develop`: **rama de desarrollo e integración continua** durante el Sprint. Todo trabajo de los Sprints (`feature/*`, `fix/*`, `docs(spec)`) se integra aquí.
- `feature/PBI-###-<slug>`: una feature o PBI, creada desde `develop` e integrada de vuelta en `develop`.
- `fix/PBI-###-<slug>`: corrección planificada, creada desde `develop` e integrada de vuelta en `develop`.
- `release/vX.Y.Z`: preparación de una versión de producción al concluir un Sprint, creada desde `develop`.
- `hotfix/<slug>`: corrección urgente de producción, creada desde `main`.

**El Sprint no es una rama.** No se crea `sprint/S01`; el Sprint es un intervalo temporal que agrupa PBIs y ramas cortas integradas en `develop`.

### 6.2. Reglas

- Las ramas de trabajo son cortas: deben integrarse en `develop` antes de cerrar el Sprint.
- **Prohibición de desarrollo a mitad en `main`:** Ningún PR de `feature/*`, `fix/*` o especificación de PBI puede apuntar directamente a `main`. Todo el trabajo del Sprint va hacia `develop`.
- **Paso a Producción al Cierre del Sprint:** Solo cuando termina el Sprint y el PO acepta el incremento en la *Sprint Review*, se decide si se fusiona `develop` (o `release/vX.Y.Z`) hacia `main`.
- **Especificación y Orden Explícita para Merges hacia `main`:** Todo merge hacia `main` debe especificarse formalmente por adelantado (alcance de PBIs cerrados, suite en verde, cero código a medias) y requiere la orden humana explícita: **"Mandar a producción"** o **"Procede con el paso a producción"**.
- No se confirma directamente en `main` ni en `develop`; se usa Pull Request.
- **Revisión por Pares Obligatoria (Inviolabilidad de `enforce_admins`):** Todo PR de desarrollo (`feature/*`, `fix/*`) hacia `develop` requiere obligatoriamente la revisión y aprobación de al menos otro miembro del equipo (`CODEOWNERS`) distinto del autor. Al abrir el PR, el PBI pasa al estado **"En revisión"** en el tablero. Queda prohibido desactivar temporalmente `enforce_admins` o usar privilegios de administrador para auto-fusionar código de producto; el bypass del Administrador de Gobernanza se restringe única y exclusivamente a PRs puros de gobernanza.
- Todo PR debe referenciar su PBI y pasar los hooks locales.
- No se usa `git rebase` destructivo ni `git push --force` sobre ramas compartidas.
- El núcleo de gobernanza solo se modifica en `main` (o mediante bypass acotado del Administrador de Gobernanza) y se propaga con `sync-governance.sh`.
- Las ramas se eliminan después del merge.

### 6.3. Commits

Se mantiene Conventional Commits y el ciclo atómico de `AGENTS.md`.

Orden TDD recomendado:

```text
docs(spec): ...
test(scope): añadir pruebas rojas para PBI-### RF-##
feat(scope): implementar PBI-### RF-##
refactor(scope): simplificar implementación de PBI-### RF-##
docs(scope): actualizar documentación de PBI-###
```

Ejemplo:

```text
feat(builder): añadir guardado de borradores de la web

Permite recuperar el estado del editor tras cerrar la aplicación.

Refs: PBI-012
Sprint: S01
```

Ámbitos de proceso:

- `docs(scrum): ...` para planificación, review, retrospectiva y definiciones.
- `docs(spec): ...` para especificaciones de PBI.
- `chore(governance): ...` para cambios del marco.
- `test(...)` y `docs(...)` según el ciclo atómico.

Cada commit contiene un único tipo. Los tests rojos solo viven en la rama de trabajo; el PR se abre con la suite en verde.

### 6.4. Releases

- No es obligatorio publicar una release en cada Sprint.
- Solo se etiqueta cuando el incremento es potencialmente desplegable y el PO lo acepta.
- `CHANGELOG.md` sigue SemVer y Keep a Changelog.
- Las notas de Sprint, demo y feedback viven en `docs/scrum/sprints/S##/review.md`.
- El tag debe ser anotado y seguir la Constitución Global.

---

## 7. Definition of Ready (DoR)

Un PBI puede entrar en un Sprint cuando:

- [ ] Tiene ID, título y descripción comprensible.
- [ ] Está priorizado por el PO.
- [ ] Tiene criterios de aceptación verificables, preferiblemente en formato Dado/Cuando/Entonces.
- [ ] Tiene valor de negocio identificado.
- [ ] Tiene estimación del equipo.
- [ ] Tiene dependencias y riesgos identificados.
- [ ] Tiene referencias de UX/diseño si afecta a la interfaz.
- [ ] Tiene contrato de API o mock definido si depende del backend.
- [ ] Cumple los requisitos no funcionales aplicables: accesibilidad, rendimiento y seguridad.
- [ ] Es suficientemente pequeño para completarse dentro del Sprint.
- [ ] La spec, el plan y las tareas están redactados o planificados para completarse antes de la primera línea de código.
- [ ] Existe una estrategia de pruebas identificada.
- [ ] Los datos, fixtures, mocks y el entorno de pruebas están identificados.
- [ ] No tiene bloqueos externos conocidos sin mitigación.

---

## 8. Definition of Done (DoD)

### 8.1. DoD de un PBI

- [ ] Se cumplen todos los criterios de aceptación.
- [ ] La spec y el plan reflejan la implementación final.
- [ ] Cada criterio de aceptación tiene al menos una prueba automatizada.
- [ ] Las pruebas se escribieron antes de la implementación; la rama o PR lo evidencian.
- [ ] La suite está en verde.
- [ ] Se han cubierto estados de carga, vacío, error, permisos y sin conexión.
- [ ] Se ha verificado accesibilidad por teclado, foco y contraste.
- [ ] No hay secretos, rutas privadas ni patrones prohibidos.
- [ ] El hook SAST finaliza limpio.
- [ ] No hay tests desactivados, omitidos o debilitados sin justificación y PBI asociado.
- [ ] Los bugs corregidos tienen prueba de regresión.
- [ ] Los tests son deterministas, independientes y no usan datos reales.
- [ ] La matriz spec-test está actualizada.
- [ ] El código ha sido revisado mediante PR.
- [ ] La documentación y `CHANGELOG.md` están actualizados cuando corresponde.
- [ ] El PBI es demostrable en el Sprint Review.

### 8.2. DoD del Incremento de Sprint

- [ ] Todos los PBIs comprometidos cumplen su DoD o han sido devueltos al Product Backlog con transparencia.
- [ ] El Sprint Goal se ha cumplido o se explica formalmente por qué no.
- [ ] La aplicación compila y arranca en el entorno objetivo.
- [ ] La suite completa de pruebas pasa.
- [ ] La cobertura de criterios de aceptación es del 100 %.
- [ ] No hay tests flaky conocidos sin acción registrada.
- [ ] El PO ha revisado y aceptado el incremento.
- [ ] `review.md` y `retrospective.md` están registrados.
- [ ] `PROXIMOS_PASOS.md` refleja el estado real.
- [ ] Las acciones de mejora tienen responsable y fecha.
- [ ] No existen defectos críticos conocidos sin registrar.

---

## 9. Transparencia, métricas y seguimiento

- El tablero se actualiza a diario.
- `PROXIMOS_PASOS.md` resume el Sprint actual, el Sprint Goal, los bloqueos, el estado de pruebas y el próximo evento.
- La cobertura de criterios de aceptación debe ser del **100 %**.
- La suite debe estar en verde en cada PR y en `develop`.
- La tasa de tests flaky en `main` debe ser **0**.
- El tiempo de la suite debe mantenerse dentro del presupuesto acordado.
- Los defectos escapados se revisan en la retrospectiva.
- El burndown y la velocidad son opcionales; nunca se usan para presionar al equipo ni para comparar equipos.
- Los impedimentos deben ser visibles y tener un responsable de resolución.
- Las acciones de retrospectiva se revisan al inicio de la siguiente retrospectiva.

---

## 10. Documentación mínima

```text
docs/
├── scrum/
│   ├── team.md
│   ├── definition-of-ready.md
│   ├── definition-of-done.md
│   ├── product-backlog.md
│   ├── plantillas/
│   │   ├── product-backlog.template.md
│   │   ├── sprint-goal.template.md
│   │   ├── sprint-backlog.template.md
│   │   ├── sprint-review.template.md
│   │   └── sprint-retrospective.template.md
│   └── sprints/
│       └── S01/
│           ├── sprint-goal.md
│           ├── sprint-backlog.md
│           ├── review.md
│           └── retrospective.md
└── decisiones/
    └── ADR-001-<slug>.md
```

---

## 11. Adaptación al contexto académico

- La duración del Sprint puede ser de 1 o 2 semanas según el calendario del taller.
- Los roles pueden combinarse en equipos pequeños, pero el PO mantiene la priorización y el Scrum Master protege el proceso.
- El Cliente actúa como stakeholder y participa en el Sprint Review.
- Se prioriza el aprendizaje y la trazabilidad sobre la métrica de velocidad.
- No se aplican ceremonias vacías: cada evento debe producir una salida útil.
- La gobernanza técnica, los hooks y la aprobación humana siguen siendo obligatorios.
