# ADR-007 — `main` como rama de producción estricta, `develop` como integración y revisión por pares obligatoria

## Metadatos

| Campo | Valor |
|---|---|
| ID | `ADR-007` |
| Fecha | 2026-11-09 (ampliada el 2026-11-10) |
| Estado | Aceptado |
| Sprint / PBI | S01 · `INFRA-01` (`#22`) |
| Decisores | Equipo Grup-05 (implementado por `@FSolaje` como Administrador de Gobernanza) |
| Registro | Retroactivo (2026-11-26), reconstruido desde el historial Git y `AGENTS.md` §1, §3 y §6 |
| Sustituye a | — |
| Sustituido por | — |

## Contexto

Durante S01 se fusionó por error en `main` el PR `#24` (`PBI-001`, desarrollo a medias) y hubo que revertirlo (`90b9e87`, PR `#27`). Hacía falta impedir que `main` recibiera desarrollo en curso y garantizar revisión de cada cambio.

## Decisión

1. `main` es **exclusivamente producción**: solo gobernanza/documentación permitida y entregas cerradas.
2. `develop` integra todo el trabajo del Sprint (`feature/*`, `fix/*`, `chore/*`) mediante Pull Request.
3. Paso a producción solo al cerrar el Sprint, con especificación previa del merge y la orden humana literal «Mandar a producción» / «Procede con el paso a producción» (`PRODUCTION_RELEASE_APPROVED=true`).
4. Todo PR de producto exige aprobación de otro miembro de `CODEOWNERS`; queda prohibido desactivar `enforce_admins` o usar `--admin` en PRs de producto.
5. Antes de publicar una rama es obligatorio integrar `origin/develop` (verificado por `pre-push` y `pre-pr-gate.sh`).
6. No se usa `git rebase` destructivo ni `git push --force` en ramas compartidas.

## Alternativas consideradas

| Alternativa | Ventajas | Inconvenientes | Motivo de descarte |
|---|---|---|---|
| Trunk-based (todo en `main`) | Simple | Sin colchón de integración | Ya causó un merge erróneo a `main` |
| Ramas `sprint/S##` | Aislamiento por Sprint | El Sprint no es una rama (Scrum) | Contradice `methodology-scrum.md` §6.1 |
| Admin con bypass en PRs de producto | Agilidad | Elimina la revisión por pares | Prohibido por inviolabilidad de `enforce_admins` |

## Consecuencias

- Positivas: `main` siempre desplegable; trazabilidad de revisiones.
- Negativas o deuda asumida: las PRs requieren coordinación de revisores (ver `ADR-009`).
- Impacto en pruebas: la suite debe estar en verde en `develop` y en cada PR.
- Impacto en accesibilidad y seguridad: protege contra publicación accidental de código no revisado.

## Referencias

- Commits `4ccc757`, `90b9e87`, `00e9470`, `86bdd04`, `474e864` · PRs `#25`, `#27`, `#29`, `#30`
- `.agent/rules/AGENTS.md` §1, §3, §6 · `.agent/rules/methodology-scrum.md` §6
