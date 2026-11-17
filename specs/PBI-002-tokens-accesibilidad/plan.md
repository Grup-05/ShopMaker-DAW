# Plan técnico — PBI-002 Definir tokens de diseño, tema claro/oscuro y accesibilidad base

> Plan técnico SDD que articula la solución de tokens semánticos, gestión de temas y accesibilidad para ShopMaker.

## Metadatos

| Campo | Valor |
|---|---|
| PBI | `PBI-002` |
| Spec | `specs/PBI-002-tokens-accesibilidad/spec.md` |
| Autor | Fernando Ruescas (`@Fernis23228`, Dev C) |
| Fecha | 2026-11-12 |
| Estado | Borrador — Pendiente de aprobación humana |

---

## 1. Resumen de la solución

Se establece una arquitectura de tokens CSS en dos niveles:
1. **Tokens primitivos:** valores fijos de paleta (`--palette-gray-50` a `900`, `--palette-blue-*`, `--palette-red-*`), escalas de espaciado (`--spacing-xs` a `xl`), radios de borde (`--radius-sm`, `md`, `lg`) y tipografía.
2. **Tokens semánticos:** variables contextuales que cambian según el tema activo (`--color-bg`, `--color-surface`, `--color-text`, `--color-text-muted`, `--color-border`, `--color-primary`, `--color-focus`).

El elemento `<html>` actúa como punto de montaje del atributo `data-theme="light"` o `data-theme="dark"`. Un caso de uso puro desacoplado gestiona la conmutación de tema, la consulta a `window.matchMedia` y la persistencia segura en `localStorage` con fallback resiliente en memoria.

---

## 2. Decisiones técnicas

| ID | Decisión | Alternativas | Justificación |
|---|---|---|---|
| DT-01 | Tokens basados en CSS Custom Properties nativas con `data-theme` | CSS-in-JS (Emotion / Styled-Components) o Tailwind CSS | Evita dependencias pesadas, garantiza cero tiempo de compilación extra, soporte nativo del navegador y ejecución instantánea sin FOUC. |
| DT-02 | Separación estricta de tokens primitivos y semánticos | Variables planas sin diferenciar primitivas de semánticas | Facilita la creación de nuevos temas o ajustes de accesibilidad sin modificar los componentes que consumen tokens semánticos (Principio Abierto/Cerrado). |
| DT-03 | Persistencia con clave `shopmaker-theme` y fallback en memoria | Almacenar en cookies o IndexedDB | `localStorage` es sincrónico y ligero para un valor escalar (`light`/`dark`). El envoltorio seguro previene roturas en navegadores con almacenamiento restringido. |
| DT-04 | Pruebas unitarias de contraste con algoritmo WCAG 2.1 matemático | Pruebas manuales o depender exclusivamente de herramientas visuales | Permite verificar en CI/CD que ningún cambio en la paleta degrade el ratio de contraste por debajo de 4.5:1 o 3:1. |

---

## 3. Arquitectura y capas

```text
src/
├── features/theme/
│   ├── domain/
│   │   └── Theme.ts              # Tipo Theme ('light' | 'dark') y validador
│   ├── application/
│   │   ├── ThemeService.ts       # Caso de uso: conmutar, resolver preferido, sincronizar
│   │   └── ThemeRepository.ts    # Puerto para persistencia
│   └── infrastructure/
│       └── LocalStorageThemeRepository.ts # Adaptador de persistencia con try/catch
└── shared/
    ├── styles/
    │   ├── primitives.css        # Paleta fija, espaciados y radios base
    │   ├── tokens.css            # Tokens semánticos para light y dark
    │   └── global.css            # Reseteo y aplicación global de tokens
    └── hooks/
        └── useTheme.ts           # Hook React para enlazar estado de presentación
```

### Reglas de dependencia aplicadas:
- `useTheme` y los componentes de presentación dependen del servicio de aplicación (`ThemeService`), nunca de `localStorage` directamente.
- El dominio `Theme.ts` es puro y no importa nada de React ni del DOM.
- La infraestructura (`LocalStorageThemeRepository`) implementa el puerto `ThemeRepository`.

---

## 4. Archivos y responsabilidades

| Archivo | Responsabilidad |
|---|---|
| `src/shared/styles/primitives.css` | Define las constantes de color, espaciado, radio y tipografía. |
| `src/shared/styles/tokens.css` | Mapea las primitivas a variables semánticas bajo `:root` y `[data-theme="dark"]`. |
| `src/features/theme/domain/Theme.ts` | Tipado `'light' \| 'dark'`, constantes y guardia de tipo `isTheme`. |
| `src/features/theme/application/ThemeRepository.ts` | Interfaz (puerto) para guardar y recuperar el tema. |
| `src/features/theme/infrastructure/LocalStorageThemeRepository.ts` | Implementación con manejo de errores y fallback transparente. |
| `src/features/theme/application/ThemeService.ts` | Orquestador: decide tema inicial (almacenado > SO > fallback) y aplica el atributo en el DOM. |
| `src/shared/hooks/useTheme.ts` | Hook de React que expone `theme`, `toggleTheme` y listeners de cambio de SO. |
| `src/features/home/presentation/HomePage.tsx` | Integración del botón de tema con `useTheme` y actualización de `aria-label`. |
| `src/shared/lib/colorContrast.ts` | Utilidad matemática que calcula la luminancia relativa y el contraste WCAG 2.1. |
| `tests/unit/tokens/contrast.test.ts` | Test unitario que valida el ratio de contraste de todos los tokens semánticos. |

---

## 5. Estrategia de pruebas

- **Pruebas Unitarias de Contraste:** Evaluar las combinaciones semánticas (`--color-text` / `--color-bg`, `--color-primary` / `--color-surface`, etc.) asegurando ≥ 4.5:1 (texto) y ≥ 3:1 (controles) en ambos modos.
- **Pruebas Unitarias de Ausencia de Colores Hardcodeados:** Analizar los archivos `.css` de componentes para asegurar que no se usan `#hex`, `rgb(...)` o `hsl(...)` directos.
- **Pruebas de Componente / Hook:** Renderizar el botón «Cambiar tema» con React Testing Library y verificar que al hacer clic se llama a la conmutación y se actualiza el `aria-label`.
- **Accesibilidad:** Comprobación de indicador de foco visible (3px) y compatibilidad con teclado (`Tab`, `Space`, `Enter`).

---

## 6. Matriz de trazabilidad spec-test

| ID | Requerimiento / Criterio | Tipo de prueba | Test previsto | Estado |
|---|---|---|---|---|
| RF-01 | Tokens primitivos y semánticos en dos niveles | Unitaria | `[PBI-002][RF-01] tokens-structure-valid` | Verde |
| RF-02 | Conmutación de tema mediante `data-theme` | Componente / Hook | `[PBI-002][RF-02] theme-toggle-updates-dom` | Verde |
| RF-03 | Persistencia en `localStorage` | Unitaria / Integración | `[PBI-002][RF-03] theme-persists-in-localstorage` | Verde |
| RF-04 | Detección de `prefers-color-scheme` del sistema | Unitaria | `[PBI-002][RF-04] theme-detects-system-preference` | Verde |
| RF-05 | Botón de tema accesible con `aria-label` | Componente | `[PBI-002][RF-05] theme-button-accessible-label` | Verde |
| CA-01 | Ratios de contraste WCAG AA (≥ 4.5:1 texto, ≥ 3:1 controles) | Unitaria (Algorítmica) | `[PBI-002][CA-01] tokens-contraste-aa` | Verde |
| CA-02 | Ausencia de colores hardcodeados en componentes | Unitaria (Linter/RegExp) | `[PBI-002][CA-02] sin-color-exclusivo` | Verde |
| CA-03 | Alternancia y persistencia entre recargas | Integración | `[PBI-002][CA-03] tema-persistente` | Verde |
| CA-04 | Fallback a preferencia del sistema operativo | Unitaria | `[PBI-002][CA-04] tema-fallback-sistema` | Verde |
| CA-05 | Foco visible por teclado en controles interactivos | Componente | `[PBI-002][CA-05] foco-visible-teclado` | Verde |

---

## 7. Plan TDD por incrementos

```text
Incremento 1: Utilidad de contraste y verificación de tokens semánticos (CA-01, CA-02)
   └── Test rojo: contrast.test.ts (falla porque no existen los tokens o no alcanzan el ratio)
   └── Implementación verde: primitives.css + tokens.css
   └── Refactor: pulir paletas y asegurar exactitud matemática.

Incremento 2: Dominio y Servicio de Tema (RF-02, RF-03, RF-04, CA-03, CA-04)
   └── Test rojo: themeService.test.ts (falla por ausencia de servicio y adaptador)
   └── Implementación verde: Theme.ts, LocalStorageThemeRepository.ts, ThemeService.ts
   └── Refactor: manejo de fallos y fallback en memoria.

Incremento 3: Hook de React e integración con UI (RF-05, CA-05)
   └── Test rojo: useTheme.test.tsx y HomePageTheme.test.tsx (falla por botón desconectado)
   └── Implementación verde: useTheme.ts y conexión en HomePage.tsx
   └── Refactor: limpieza de estilos antiguos en global.css.
```

---

## 8. Riesgos técnicos

| Riesgo | Probabilidad | Impacto | Mitigación |
|---|---|---|---|
| Fórmulas de contraste complejas en testing | Baja | Media | Utilizar la fórmula estándar de luminancia relativa W3C en una utilidad pura `colorContrast.ts`. |
| Conflictos de especificidad CSS con `global.css` | Baja | Baja | Reemplazar variables monolíticas de `global.css` importando `primitives.css` y `tokens.css`. |
