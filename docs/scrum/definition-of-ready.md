# Definition of Ready (DoR)

Un PBI puede entrar en un Sprint cuando cumple **todos** estos criterios. El Product Owner y los Developers los verifican en el refinamiento.

## Contenido del PBI

- [ ] Tiene ID (`PBI-###`), título y descripción comprensible en formato historia de usuario.
- [ ] Está priorizado por el Product Owner.
- [ ] Tiene valor de negocio identificado.
- [ ] Tiene criterios de aceptación verificables, preferentemente en formato `Dado / Cuando / Entonces`.
- [ ] Tiene estimación acordada por el equipo.
- [ ] Es suficientemente pequeño para completarse dentro del Sprint.
- [ ] Tiene dependencias y riesgos identificados.

## Diseño y contrato

- [ ] Tiene referencias de UX/diseño si afecta a la interfaz.
- [ ] Tiene contrato de API o mock definido si depende del backend.
- [ ] Respeta la frontera frontend/backend: no asume lógica de servidor.
- [ ] Cumple los requisitos no funcionales aplicables: accesibilidad, rendimiento y seguridad.

## Especificación y pruebas

- [ ] `specs/PBI-###-<slug>/spec.md`, `plan.md` y `tasks.md` están redactados o planificados para completarse antes de la primera línea de código.
- [ ] Existe una estrategia de pruebas identificada.
- [ ] Los datos, fixtures, mocks y el entorno de pruebas están identificados.
- [ ] La matriz de trazabilidad spec-test tiene una fila por criterio de aceptación.

## Bloqueos

- [ ] No tiene bloqueos externos conocidos sin mitigación.
- [ ] Si existe incertidumbre técnica, se ha planificado un **spike timeboxed** con entregable documental.

## Criterio de salida

Un PBI pasa a estado `Refinado` cuando todas las casillas aplicables están marcadas. Si alguna no puede cumplirse, el PBI permanece en el Product Backlog y se registra el motivo.
