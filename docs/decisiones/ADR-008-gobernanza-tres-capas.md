# ADR-008 — Gobernanza en tres capas, núcleo inmutable y entorno local `user_data/security/`

## Metadatos

| Campo | Valor |
|---|---|
| ID | `ADR-008` |
| Fecha | 2026-11-03 (ampliada el 2026-11-04) |
| Estado | Aceptado |
| Sprint / PBI | S01 · `INFRA-01` (`#22`) |
| Decisores | Equipo Grup-05 (implementado por `@FSolaje`) |
| Registro | Retroactivo (2026-11-26), reconstruido desde el historial Git, `AGENTS.md` §1 y §7 y `docs/scrum/team.md` |
| Sustituye a | — |
| Sustituido por | — |

## Contexto

Se heredó una *Plantilla Universal de Gobernanza de IA*. Había que conciliar inmutabilidad del marco global con libertad de cada desarrollador, sin fugas de rutas privadas ni credenciales.

## Decisión

1. **Capa 1 — Núcleo global** (`.agent/hooks/`, `.agent/rules/AGENTS.md`, `.github/workflows/`, `.gitattributes`): solo se modifica en `main` y se propaga con `sync-governance.sh`; `pre-commit` bloquea diferencias en ramas secundarias.
2. **Capa 2 — Gobernanza contextual por PBI** (`specs/PBI-###-<slug>/`): versionada y fusionable.
3. **Capa 3 — Overrides locales** (`user_data/governance/`, `.agent/local/`, `pre-commit-local.sh`): ignorados por Git, imposible que lleguen a un PR.
4. **Administrador de Gobernanza** con bypass acotado: puede confirmar cambios del núcleo en ramas de trabajo solo si el commit afecta exclusivamente a activos de gobernanza/proceso y supera el SAST.
5. **`user_data/security/`** obligatorio en cada estación (`forbidden_patterns.txt` autogenerado; `gh_token.txt` para miembros del equipo Scrum).
6. Perfiles de onboarding diferenciados: Core Admin, Developer estándar, Cliente/Evaluador y Fork.

## Alternativas consideradas

| Alternativa | Ventajas | Inconvenientes | Motivo de descarte |
|---|---|---|---|
| Gobernanza solo en `main`, sin bypass | Máxima rigidez | Bloquea evolución del marco en ramas | Se acotó el bypass en lugar de eliminarlo |
| Reglas privadas versionadas | Compartidas | Riesgo de fugas | Se aíslan en capa 3 ignorada |
| Token único compartido | Simple | Sin trazabilidad de autoría | Token personal por miembro |

## Consecuencias

- Positivas: marco estable, innovación local sin riesgo de merge.
- Negativas o deuda asumida: complejidad de `sync-governance.sh`; los cambios del núcleo requieren el Administrador de Gobernanza.
- Impacto en pruebas: `client-boundary.test.ts` y SAST de `pre-commit`.
- Impacto en accesibilidad y seguridad: cero secretos y cero rutas privadas versionadas.

## Referencias

- Commits `4bbe7a7`, `f4a25d5`, `8371a96`, `1ead389` · `docs/scrum/team.md` · `AGENTS.md` §1 y §7
