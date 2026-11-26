# ADR-009 — Roles Scrum rotativos, `CODEOWNERS` dinámico y revisión cruzada PO + SM

## Metadatos

| Campo | Valor |
|---|---|
| ID | `ADR-009` |
| Fecha | 2026-11-03 (enmienda 2026-11-26) |
| Estado | Aceptado |
| Sprint / PBI | S01 · `INFRA-01`; enmienda en S03 (PR `#82`) |
| Decisores | Equipo Grup-05 |
| Registro | Retroactivo (2026-11-26), reconstruido desde `docs/scrum/team.md`, `active_roles.env` y el incidente de la PR `#82` |
| Sustituye a | — |
| Sustituido por | — |

## Contexto

Los tres integrantes son administradores de la organización y rotan entre Product Owner, Scrum Master y Developer. Se necesitaba separar poderes y obligar a la revisión por pares sin depender de una persona fija. Al abrir la PR `#82` (PBI-009), su autora era la Product Owner, único `CODEOWNER` de `/specs/`: GitHub impide la autoaprobación y la PR quedó bloqueada (`REVIEW_REQUIRED`) aunque otro miembro la aprobó.

## Decisión

1. Los roles activos se declaran en `docs/scrum/active_roles.env` y se rotan con `scripts/scrum/rotate-roles.sh`, que regenera `.github/CODEOWNERS`.
2. Rotación registrada: S01 PO `@FSolaje` · SM `@Tarrant15`; S02 PO `@Tarrant15` · SM `@Fernis23228`; S03 PO `@Fernis23228` · SM `@FSolaje`.
3. **Enmienda (2026-11-26):** `/specs/` y `product-backlog.md` pertenecen a **PO + SM**; `/docs/scrum/*` a **SM + PO**; el núcleo de gobernanza al Administrador de Gobernanza más PO y SM; `PROXIMOS_PASOS.md` a todos los Developers (lo actualiza el hook en cada commit).

## Alternativas consideradas

| Alternativa | Ventajas | Inconvenientes | Motivo de descarte |
|---|---|---|---|
| Un único propietario por ruta | Responsabilidad clara | Deadlock cuando el propietario es autor | Bloqueó la PR `#82` |
| Todo el equipo en todas las rutas | Sin bloqueos | Pierde la separación de poderes | Contradice la matriz de autoridad |
| Desactivar la protección para fusionar | Rápido | Prohibido por `AGENTS.md` §1.1.6 | Inadmisible |

## Consecuencias

- Positivas: ninguna PR queda bloqueada por autoría; se mantiene la revisión cruzada.
- Negativas o deuda asumida: la separación PO/SM en `/specs/` es ahora de co-titularidad, no exclusiva.
- Impacto en pruebas: ninguno.
- Impacto en accesibilidad y seguridad: refuerza el principio de cuatro ojos.

## Referencias

- `scripts/scrum/rotate-roles.sh` · `.github/CODEOWNERS` · commit `61766a9` · PR `#82`
