# Especificaciones del Sistema de Diseño Visual: {{PROJECT_NAME}}

## 1. Fundamentos y Tokens de Diseño

### 1.1. Paleta Cromática Semántica y Contraste WCAG AA
| Token | Valor Hex | Rol Semántico | Ratio Contraste Mínimo |
| :--- | :--- | :--- | :--- |
| `--color-primary` | `#...` | Botones de acción, enlaces activos | ≥ 4.5:1 |
| `--color-surface` | `#FFFFFF` | Fondo de tarjetas y contenedores | N/A |
| `--color-background` | `#...` | Fondo base de la aplicación | N/A |
| `--color-text-main` | `#...` | Títulos y cuerpo de texto | ≥ 4.5:1 |
| `--color-text-muted` | `#...` | Leyendas y textos secundarios | ≥ 4.5:1 |
| `--color-border` | `#...` | Bordes y divisores estructurales | ≥ 3:1 |

### 1.2. Escala Tipográfica
- **Fuente Principal:** Inter / Roboto / System Font.
- **Títulos (`h1` - `h3`):** 
- **Cuerpo (`body`):** 16px (1rem), line-height: 1.5.
- **Áreas interactivas mínimas:** 44x44px.

---

## 2. Registro de Decisiones Visuales (DV)

| ID | Fecha | Decisión | Justificación Ergonómica / Visual | Origen | Estado |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `DV-001` | {{DATE}} | Paleta corporativa accesible | Garantizar cumplimiento WCAG AA en móvil | Agente/Usuario | Vigente |
