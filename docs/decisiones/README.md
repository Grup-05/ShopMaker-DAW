# Decisiones (ADR) — ShopMaker-DAW

Este directorio es el **registro oficial y mandatorio** de las decisiones relevantes del proyecto, tanto de arquitectura del frontend como de proceso y gobernanza.

> **Regla de oro:** una decisión relevante sin ADR no se considera cerrada (`AGENTS.md` §11, [ADR-014](ADR-014-registro-mandatorio-de-decisiones.md)).

## Cuándo es obligatorio crear un ADR

- Elección o cambio de stack, herramientas o dependencias nuevas.
- Arquitectura, capas, contratos de API (`src/domain/ports/`) o política de errores.
- Estrategia de estado, routing, composición de módulos, previsualización y sandbox.
- Seguridad: sanitización, almacenamiento, permisos o gestión de credenciales.
- Modelo de ramas, roles Scrum, `CODEOWNERS`, hooks, puertas de calidad y automatizaciones.
- Convenciones de versionado, etiquetas y publicación.
- Cualquier decisión que afecte a varias features o sea difícil de revertir.

## Cuándo se registra

- **Decisiones de producto:** en la misma PR que las introduce.
- **Decisiones de gobernanza o proceso:** en la misma sesión en que se acuerdan.
- **Registro retroactivo:** permitido si se marca como tal (campo `Registro`) y el equipo lo valida en la revisión.

## Formato

```text
ADR-###-<slug>.md
```

Se parte de [`ADR-template.md`](ADR-template.md). Cada ADR incluye contexto, decisión, alternativas consideradas, consecuencias y estado (`Propuesto`, `Aceptado`, `Sustituido`).

## Regla de trazabilidad

Un ADR **no se elimina**: se marca `Sustituido por ADR-###` y se documenta el motivo del cambio y la solución que lo reemplaza.

## Índice

| ADR | Título | Estado | Fecha | Sprint |
|---|---|---|---|---|
| [ADR-001](ADR-001-react-typescript.md) | React y TypeScript como stack del frontend | Aceptado | 2026-11-03 | S01 |
| [ADR-002](ADR-002-aplicacion-web.md) | Aplicación web en navegador como formato de entrega | Aceptado | 2026-11-03 | S01 |
| [ADR-003](ADR-003-arnes-pruebas-hook-local.md) | Arnés de pruebas Vitest + Testing Library + Playwright y hook local | Aceptado (retroactivo) | 2026-11-10 | S01 |
| [ADR-004](ADR-004-tokens-css-tema-claro-oscuro.md) | Tokens CSS en dos niveles y tema claro/oscuro con `data-theme` | Aceptado (retroactivo) | 2026-11-12 | S01 |
| [ADR-005](ADR-005-puertos-hexagonales-mock-persistente.md) | Puertos hexagonales de API y adaptador mock persistente | Aceptado (retroactivo) | 2026-11-23 | S02 |
| [ADR-006](ADR-006-sesion-auth-rutas-protegidas.md) | Sesión con `AuthContext`, `GuardedRoute` y React Router v7 | Aceptado (retroactivo) | 2026-11-25 | S02 |
| [ADR-007](ADR-007-modelo-ramas-main-produccion.md) | `main` como producción estricta, `develop` como integración y revisión por pares | Aceptado (retroactivo) | 2026-11-09 | S01 |
| [ADR-008](ADR-008-gobernanza-tres-capas.md) | Gobernanza en tres capas, núcleo inmutable y `user_data/security/` | Aceptado (retroactivo) | 2026-11-03 | S01 |
| [ADR-009](ADR-009-roles-rotativos-codeowners.md) | Roles rotativos, `CODEOWNERS` dinámico y revisión cruzada PO + SM | Aceptado (retroactivo) | 2026-11-03 | S01 · S03 |
| [ADR-010](ADR-010-puerta-pre-pr-sincronizacion-tablon.md) | Puerta `pre-pr-gate.sh`, token personal por rol y sincronización del Tablón | Aceptado (retroactivo) | 2026-11-17 | S01–S02 |
| [ADR-011](ADR-011-editor-bloques-y-previsualizacion-aislada.md) | Motor de edición inmutable por bloques, previsualización aislada y sanitización | Aceptado | 2026-11-26 | S03 |
| [ADR-012](ADR-012-tags-de-sprint-y-readme-kickoff.md) | Etiquetas anotadas por Sprint (`v0.N.0-S0N`) y `README.md` de `main` en cada Kick-off | Aceptado | 2026-11-26 | S03 |
| [ADR-013](ADR-013-guia-viva-pruebas-funcionales.md) | Guía viva de pruebas funcionales actualizada en cada PR a `develop` | Aceptado | 2026-11-26 | S03 |
| [ADR-014](ADR-014-registro-mandatorio-de-decisiones.md) | Registro mandatorio de decisiones relevantes (ADR) | Aceptado | 2026-11-26 | S03 |

> Los ADR marcados «retroactivo» se reconstruyeron el 2026-11-26 desde los `plan.md`, el historial Git y las reglas vigentes; el equipo debe validarlos en la revisión de la PR que los incorpora.

### Decisiones de feature que permanecen en `plan.md`

Las decisiones locales de una sola feature (por ejemplo, el foco atrapado del modal o el layout por secciones del Dashboard en `PBI-006`) siguen documentadas en el `plan.md` de su PBI; si afectan a más de una feature, se elevan a ADR.
