# ADR-004 — Tokens CSS en dos niveles y tema claro/oscuro con `data-theme`

## Metadatos

| Campo | Valor |
|---|---|
| ID | `ADR-004` |
| Fecha | 2026-11-12 |
| Estado | Aceptado |
| Sprint / PBI | S01 · `PBI-002` (`#3`) |
| Decisores | Equipo Grup-05 (`@Fernis23228` como autor del plan) |
| Registro | Retroactivo (2026-11-26), reconstruido desde `specs/PBI-002-tokens-accesibilidad/plan.md` |
| Sustituye a | — |
| Sustituido por | — |

## Contexto

`profile-uiux.md` §3.3 exige tokens semánticos y prohíbe colores dispersos. Se necesitaba tema claro/oscuro, contraste WCAG 2.1 AA verificable y persistencia de la preferencia.

## Decisión

1. **CSS Custom Properties nativas** en dos niveles: primitivos (`primitives.css`) y semánticos (`tokens.css`, `--color-*`).
2. El tema se aplica con el atributo `data-theme="light|dark"` en `<html>`.
3. Persistencia en `localStorage` con clave `shopmaker-theme` y *fallback* en memoria; orden de resolución: valor guardado > preferencia del sistema (`prefers-color-scheme`) > claro.
4. El contraste se verifica con una utilidad pura (`colorContrast.ts`) y tests que exigen ≥ 4.5:1 (texto) y ≥ 3:1 (controles).
5. Un test prohíbe `#hex`, `rgb()` y `hsl()` directos en los CSS de componentes.

## Alternativas consideradas

| Alternativa | Ventajas | Inconvenientes | Motivo de descarte |
|---|---|---|---|
| CSS-in-JS (Emotion / Styled-Components) | Estilos acoplados al componente | Dependencia pesada, coste de ejecución | CSS nativo evita dependencias y FOUC |
| Tailwind CSS | Productividad | Nueva herramienta de compilación | Incumple KISS/YAGNI en esta fase |
| Cookies o IndexedDB para el tema | — | Excesivo para un valor escalar | `localStorage` basta |

## Consecuencias

- Positivas: temas nuevos sin tocar componentes; contraste verificado en CI local.
- Negativas o deuda asumida: el documento HTML generado para la web del cliente (PBI-009) vive en un `iframe` aislado y usa su propio CSS (ver `ADR-011`).
- Impacto en pruebas: `tests/unit/tokens/contrast.test.ts`, `tests/unit/theme/*`.
- Impacto en accesibilidad y seguridad: foco visible de 3 px y botón «Cambiar tema» accesible.

## Referencias

- `specs/PBI-002-tokens-accesibilidad/` · Issue `#3` · PR `#35`
