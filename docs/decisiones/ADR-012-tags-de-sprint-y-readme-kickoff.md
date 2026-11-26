# ADR-012 — Etiquetas anotadas por Sprint (`v0.N.0-S0N`) y `README.md` de `main` actualizado en cada Kick-off

## Metadatos

| Campo | Valor |
|---|---|
| ID | `ADR-012` |
| Fecha | 2026-11-26 |
| Estado | Aceptado |
| Sprint / PBI | S03 · gobernanza |
| Decisores | Equipo Grup-05 (propuesta aceptada por el usuario en sesión de trabajo) |
| Registro | Original |
| Sustituye a | — |
| Sustituido por | — |

## Contexto

Al auditar el repositorio no existía ningún tag (`git ls-remote --tags origin` vacío): ni S01 ni S02 quedaron marcados, y `methodology-scrum.md` §6.4 decía que publicar versión en cada Sprint «no es obligatorio». Además, la portada de `main` mostraba el Sprint S01 cuando ya se cerraba S02.

## Decisión

1. Al cierre de **cada Sprint**, tras la aceptación del PO en la Sprint Review, se crea un **tag anotado** `v0.<N>.0-S0<N>` (`N` = número de Sprint): `v0.1.0-S01`, `v0.2.0-S02`, `v0.3.0-S03`…
2. El tag apunta al último commit de `develop` que integra el incremento del Sprint. El mensaje resume Sprint Goal, PBIs cerrados y estado de la suite.
3. `v1.0.0` y posteriores se reservan para releases de producción en `main` (`publish-release.sh`, `AGENTS.md` §5).
4. Etiquetado retroactivo: `v0.1.0-S01` en `753bdef` (último PBI de S01, PR `#35`) y `v0.2.0-S02` en `0baef80` (último PBI de S02, PR `#59`).
5. En cada **Kick-off** se actualiza `README.md` (Sprint, objetivo, roles, roadmap, métricas) en `develop` y `main`, junto con `active_roles.env` y `CODEOWNERS`.
6. Publicar un tag es un `git push`: requiere aprobación humana explícita.

## Alternativas consideradas

| Alternativa | Ventajas | Inconvenientes | Motivo de descarte |
|---|---|---|---|
| `sprint-S0N-v0.N.0` | Agrupa por prefijo | Menos estándar SemVer | Se prefirió SemVer con sufijo |
| `v0.N.0` sin sufijo | Más corto | El Sprint solo aparece en el mensaje | Menos visible |
| Sin tag por Sprint | Menos trabajo | Sin hitos recuperables | Fue la situación que se corrige |

## Consecuencias

- Positivas: cada Sprint es recuperable y comparable; la portada de `main` refleja el estado real.
- Negativas o deuda asumida: orden SemVer — `v0.1.0-S01` es **anterior** a `v0.1.0-alpha.1` (se compara «S01» con «alpha» en orden ASCII); `v0.1.0-alpha.1` figura en `CHANGELOG.md` pero nunca se etiquetó. Los tags de Sprint se crean sobre `develop`, no sobre `main`.
- Impacto en pruebas: la suite debe estar en verde en el commit etiquetado.
- Impacto en accesibilidad y seguridad: ninguno directo.

## Referencias

- `AGENTS.md` §5.5 y §10 · `methodology-scrum.md` §3.2, §3.4 y §6.4 · `scripts/scrum/rotate-roles.sh`
