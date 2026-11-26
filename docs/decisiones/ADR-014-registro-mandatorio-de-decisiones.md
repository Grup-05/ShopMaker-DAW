# ADR-014 — Registro mandatorio de decisiones relevantes (ADR)

## Metadatos

| Campo | Valor |
|---|---|
| ID | `ADR-014` |
| Fecha | 2026-11-26 |
| Estado | Aceptado |
| Sprint / PBI | S03 · gobernanza |
| Decisores | Equipo Grup-05 (petición del usuario en sesión de trabajo) |
| Registro | Original |
| Sustituye a | — |
| Sustituido por | — |

## Contexto

Entre el 3 de noviembre y el 26 de noviembre solo existían `ADR-001` y `ADR-002`, aunque `docs/decisiones/README.md` pedía un ADR para contratos de API, estrategia de previsualización, estado y routing. Las decisiones quedaron dispersas en `plan.md`, mensajes de commit y conversaciones, y se perdía la trazabilidad de su motivo y de las alternativas descartadas.

## Decisión

1. **Es obligatorio registrar un ADR** para toda decisión relevante: arquitectura o contratos que afecten a varias features o sean difíciles de revertir; dependencias o herramientas nuevas; seguridad; modelo de ramas, roles, hooks o puertas de calidad; convenciones de versionado y publicación.
2. **Cuándo:** en la misma PR que introduce la decisión (producto) o en la misma sesión en que se acuerda (gobernanza). Una decisión sin ADR no se considera cerrada.
3. **Agente de IA:** al acordar una decisión relevante con el usuario debe redactar o proponer el ADR antes de dar la tarea por terminada, y avisar si detecta una decisión no registrada.
4. **Controles:** casilla obligatoria en la plantilla de PR, ítem en la Definition of Done, revisión en Sprint Planning, Review y Retrospective, y aviso heurístico de `pre-pr-gate.sh` cuando una rama `feature/*` toca `src/domain/ports/`, `src/app/` o `package.json` sin tocar `docs/decisiones/`.
5. **Registro retroactivo** permitido, marcado como tal y sujeto a validación del equipo.
6. Un ADR no se elimina: se marca `Sustituido por ADR-###` y se documenta el motivo.

## Alternativas consideradas

| Alternativa | Ventajas | Inconvenientes | Motivo de descarte |
|---|---|---|---|
| Decisiones solo en `plan.md` | Cercanas al PBI | No transversales ni localizables | Origen del problema |
| Wiki externa | Cómoda | Fuera del repositorio y sin revisión | Sin trazabilidad Git |
| ADR opcional | Sin fricción | No se cumple | Se pidió carácter mandatorio |

## Consecuencias

- Positivas: historial razonado y auditable; incorporación de nuevos miembros más rápida.
- Negativas o deuda asumida: más documentación por PR; el aviso del gate es heurístico y no sustituye al juicio del revisor.
- Impacto en pruebas: ninguno.
- Impacto en accesibilidad y seguridad: las decisiones de seguridad quedan explícitas.

## Referencias

- `AGENTS.md` §11 · `methodology-scrum.md` §3 y §8 · `docs/scrum/definition-of-done.md` · `.github/pull_request_template.md`
