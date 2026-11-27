# ADR-013 — Guía viva de pruebas funcionales actualizada en cada PR a `develop`

## Metadatos

| Campo | Valor |
|---|---|
| ID | `ADR-013` |
| Fecha | 2026-11-26 |
| Estado | Aceptado |
| Sprint / PBI | S03 · gobernanza |
| Decisores | Equipo Grup-05 (propuesta del usuario en sesión de trabajo) |
| Registro | Original |
| Sustituye a | — |
| Sustituido por | — |

## Contexto

No existía un documento para probar la aplicación como un cliente. Quien revisaba una PR debía deducir cómo probarla del código o de los tests. Además, una guía dada solo en el chat contenía errores (nombres de botones y un paso de «instalar módulo» que aún no está conectado en la interfaz).

## Decisión

1. El documento canónico es `docs/guia-pruebas-funcionales.md`, enlazado de forma destacada en `README.md`.
2. **Cada PR de funcionalidad (`feature/*`) hacia `develop` debe actualizarla dentro de la propia PR**, para que el revisor pruebe antes de aprobar.
3. Está organizada por secciones de PBI para minimizar conflictos entre ramas paralelas; si un PBI no cambia nada visible para el cliente, lo declara explícitamente.
4. Las etiquetas de botones y textos se copian del código real, no de memoria.
5. Control: plantilla de PR, Definition of Done y `pre-pr-gate.sh` (falla en modo `--pre-pr` si una rama `feature/*` no modifica la guía respecto a `origin/develop`).

## Alternativas consideradas

| Alternativa | Ventajas | Inconvenientes | Motivo de descarte |
|---|---|---|---|
| Guía solo al cierre del Sprint | Una sola vez | El revisor no puede probar la PR | No cumple el objetivo |
| Guía en la descripción de cada PR | Contextual | Se pierde tras el merge | No es un documento vivo |
| Mantenerla solo en el chat | Sin coste | Sin trazabilidad y con errores | Origen del problema |

## Consecuencias

- Positivas: revisión basada en uso real; onboarding de evaluadores y cliente.
- Negativas o deuda asumida: coste de mantenimiento por PR; la guía puede quedar desfasada si se omite.
- Impacto en pruebas: complementa (no sustituye) la suite automatizada.
- Impacto en accesibilidad y seguridad: incluye comprobaciones manuales de teclado.

## Referencias

- `docs/guia-pruebas-funcionales.md` · `.github/pull_request_template.md` · `scripts/github/pre-pr-gate.sh`
