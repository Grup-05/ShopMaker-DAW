# ShopMaker-DAW

Frontend del **CMS ShopMaker**, una aplicación que permite a los usuarios comprar módulos y construir su propia página web, con alojamiento proporcionado por la plataforma.

Este repositorio contiene **exclusivamente el frontend**. La arquitectura del sistema es de tres capas —frontend, backend/API y base de datos— y toda la lógica de negocio, permisos, compras y datos vive en el backend.

La primera entrega se ejecuta como **aplicación web desktop-first en el navegador**. El stack es **React + TypeScript + Vite** ([ADR-001](docs/decisiones/ADR-001-react-typescript.md)) y el formato de entrega es una **SPA** ([ADR-002](docs/decisiones/ADR-002-aplicacion-web.md)); sin shell nativo ni instaladores.

> [!TIP]
> **🧪 ¿Quieres probar la aplicación como un cliente?** Sigue la **[Guía de pruebas funcionales](docs/guia-pruebas-funcionales.md)**: se actualiza en cada Pull Request hacia `develop`, así que siempre describe cómo probar lo último que se ha integrado.

---

## Estado del proyecto y Roadmap

- **Sprint actual:** Sprint S03 — Motor de Edición de Webs, Creación/Compra de Módulos y Previsualización Aislada (`2026-12-01 → 2026-12-12`).
- **Sprint Goal (S03):** Entregar el primer flujo de valor completo de cara al cliente del CMS ShopMaker: permitir al usuario diseñar la estructura y el contenido de su sitio web en un editor visual por bloques con autoguardado (`PBI-008`), ampliar las capacidades de su web mediante módulos declarativos creables y comprables en la tienda (`PBI-007`), y previsualizar en un entorno seguro y aislado (*mobile-first* `360px` / `768px` / `1280px`) su página web antes de publicarla (`PBI-009`).
- **Hitos completados:**
  - **Sprint S01 (Fundaciones — 100 % completado):** Shell SPA web base (`PBI-001`), sistema visual de tokens semánticos claro/oscuro WCAG 2.1 AA (`PBI-002`), arnés oficial Vitest + Testing Library + Playwright (`PBI-004`) y protección de ramas (`INFRA-01`).
  - **Sprint S02 (Identidad, Contratos Mock y Dashboard CMS — 100 % completado):** Contrato de API y adaptador mock persistente en `localStorage` (`PBI-003`), autenticación simulada, sesión y rutas protegidas (`PBI-005`), y panel Mis Sitios con creación de web e integración con catálogo (`PBI-006`).
- **Stack:** React 19 + TypeScript 5 + Vite 7 + React Router 7 ([ADR-001](docs/decisiones/ADR-001-react-typescript.md), [ADR-006](docs/decisiones/ADR-006-sesion-auth-rutas-protegidas.md)) · SPA web desktop-first ([ADR-002](docs/decisiones/ADR-002-aplicacion-web.md)).
- **Etiquetas de Sprint:** `v0.1.0-S01` y `v0.2.0-S02` (el cierre de S03 será `v0.3.0-S03`); nomenclatura en el [ADR-012](docs/decisiones/ADR-012-tags-de-sprint-y-readme-kickoff.md).
- **Tablero operativo:** [GitHub Projects #1 — ShopMaker](https://github.com/orgs/Grup-05/projects/1)
- **Seguimiento en vivo:** [`PROXIMOS_PASOS.md`](PROXIMOS_PASOS.md)
- **🧪 Guía para probar la aplicación como cliente:** [`docs/guia-pruebas-funcionales.md`](docs/guia-pruebas-funcionales.md) *(actualizada en cada PR hacia `develop`)*
- **📚 Registro de decisiones (ADR):** [`docs/decisiones/`](docs/decisiones/README.md)

---

## Equipo y roles (Sprint S03)

| Integrante | Usuario GitHub | Rol Scrum (S03) | Frente de trabajo en Sprint S03 | Histórico de rotación |
|---|---|---|---|---|
| Francisco Tomas | `@FSolaje` | **Scrum Master** / Developer (Dev A) / **Admin. Gobernanza** | `PBI-008` (`#79`, 30 h) — Editor visual de páginas por bloques (`/editor/:siteId`), inspector de propiedades y autoguardado de borradores (`#61`–`#66`) | S01: PO · S02: Dev · S03: SM |
| Jesús Hernández | `@Tarrant15` | Developer (Dev B) | `PBI-007` (`#80`, 26 h) — Sistema de creación de módulos mediante manifiestos declarativos, ficha técnica y compra/activación por sitio (`#67`–`#72`) | S01: SM · S02: PO · S03: Dev |
| Fernando Ruescas | `@Fernis23228` | **Product Owner** / Developer (Dev C) | `PBI-009` (`#81`, 26 h) — Motor de renderizado sanitizado *mobile-first*, previsualización aislada (`<iframe sandbox>`) y publicación de web (`#73`–`#78`) | S01: Dev · S02: SM · S03: PO |
| Javier Ibañez | — | Cliente / Stakeholder | Feedback funcional y validación de incremento en Sprint Review | — |

Detalle de responsabilidades, acuerdos y rotación dinámica en [`docs/scrum/team.md`](docs/scrum/team.md) y [`docs/scrum/active_roles.env`](docs/scrum/active_roles.env).

---

## Metodología: Scrum + SDD + TDD

El proyecto combina tres marcos complementarios:

| Marco | Pregunta que responde | Dónde se regula |
|---|---|---|
| **Scrum** | ¿Cuándo y con qué prioridad? | [`.agent/rules/methodology-scrum.md`](.agent/rules/methodology-scrum.md) |
| **SDD** | ¿Qué debe hacer y por qué? | [`specs/`](specs/) y [`.agent/rules/profile-uiux.md`](.agent/rules/profile-uiux.md) |
| **TDD** | ¿Cómo lo demostramos y construimos? | [`.agent/rules/methodology-tdd.md`](.agent/rules/methodology-tdd.md) |

Principios rectores: **SOLID**, **KISS/YAGNI**, accesibilidad **WCAG 2.1 AA**, seguridad por diseño y trazabilidad.

### Regla No-Spec-No-Code

Antes de escribir código de producción, cada PBI debe tener:

```text
specs/PBI-###-<slug>/
├── spec.md    # requisitos, criterios de aceptación y contrato
├── plan.md    # arquitectura, estrategia de pruebas y matriz spec-test
└── tasks.md   # desglose TDD: rojo → verde → refactor
```

La spec se redacta de forma *just-in-time* durante el refinamiento y el Sprint Planning. No se diseña todo el producto de una vez.

### Ciclo TDD obligatorio

1. Leer la spec y el criterio de aceptación.
2. Escribir el test más pequeño que falle por la razón esperada (**rojo**).
3. Implementar el mínimo necesario (**verde**).
4. Refactorizar sin cambiar comportamiento (**refactor**).
5. Repetir y mantener la suite en verde antes del PR.

Los tests se derivan de la especificación, no de la implementación. Un bug se corrige con una prueba de regresión previa.

---

## Definition of Ready y Definition of Done

- [Definition of Ready](docs/scrum/definition-of-ready.md): condiciones para que un PBI entre en un Sprint.
- [Definition of Done](docs/scrum/definition-of-done.md): condiciones para considerar terminado un PBI y el incremento.

Resumen de la DoD: criterios de aceptación cumplidos, **100 % de criterios con prueba automatizada**, suite en verde, accesibilidad verificada, SAST limpio, revisión mediante PR y demo en el Sprint Review.

---

## Artefactos Scrum

```text
docs/
├── scrum/
│   ├── team.md
│   ├── active_roles.env
│   ├── definition-of-ready.md
│   ├── definition-of-done.md
│   ├── product-backlog.md
│   ├── plantillas/
│   └── sprints/
│       ├── S01/
│       │   ├── sprint-goal.md
│       │   ├── sprint-backlog.md
│       │   ├── review.md
│       │   └── retrospective.md
│       ├── S02/
│       │   ├── sprint-goal.md
│       │   ├── sprint-backlog.md
│       │   ├── review.md
│       │   └── retrospective.md
│       └── S03/
│           ├── sprint-goal.md
│           └── sprint-backlog.md
└── decisiones/
    ├── README.md
    ├── ADR-001-react-typescript.md
    ├── ADR-002-aplicacion-web.md
    └── ADR-template.md
```

- [Product Backlog](docs/scrum/product-backlog.md)
- [Sprint S03 (Activo) — Sprint Goal](docs/scrum/sprints/S03/sprint-goal.md) · [Sprint Backlog](docs/scrum/sprints/S03/sprint-backlog.md)
- [Sprint S02 (Cerrado) — Sprint Goal](docs/scrum/sprints/S02/sprint-goal.md) · [Sprint Backlog](docs/scrum/sprints/S02/sprint-backlog.md) · [Review](docs/scrum/sprints/S02/review.md) · [Retrospective](docs/scrum/sprints/S02/retrospective.md)
- [Sprint S01 (Cerrado) — Sprint Goal](docs/scrum/sprints/S01/sprint-goal.md) · [Sprint Backlog](docs/scrum/sprints/S01/sprint-backlog.md) · [Review](docs/scrum/sprints/S01/review.md) · [Retrospective](docs/scrum/sprints/S01/retrospective.md)

El **Sprint no es una rama**: es un intervalo temporal que agrupa PBIs y ramas cortas de GitFlow. Al inicio de cada Sprint (*Kick-off*) es obligatorio actualizar este `README.md` tanto en `develop` como en `main`.

---

## Convención de ramas: GitFlow

### Ramas principales

- `main`: versiones estables y desplegables. Cada versión se identifica con un tag anotado.
- `develop`: integración del trabajo terminado para la próxima versión.

### Ramas de trabajo

- `feature/PBI-###-<slug>`: funcionalidad nueva, creada desde `develop`.
- `fix/PBI-###-<slug>`: corrección planificada, creada desde `develop`.
- `release/vX.Y.Z`: preparación de versión, creada desde `develop`.
- `hotfix/<slug>`: corrección urgente, creada desde `main`.

### Flujo habitual

1. Actualizar `develop`.
2. Crear la rama de trabajo desde `develop` con `git switch -c`.
3. Especificar el PBI (`spec.md`, `plan.md`, `tasks.md`) y confirmar `docs(spec): ...`.
4. Implementar con TDD en ciclos pequeños.
5. Integrar en `develop` mediante Pull Request con la suite en verde.
6. Preparar `release/vX.Y.Z` cuando corresponda y etiquetar en `main`.

Reglas:

- Ramas cortas: deben integrarse antes de cerrar el Sprint.
- No se confirma directamente en `main` ni en `develop`.
- Prohibido `git rebase` destructivo y `git push --force` sobre ramas compartidas.
- El núcleo de gobernanza solo se modifica en `main` y se propaga con `bash .agent/hooks/sync-governance.sh`.

---

## Convención de commits: Conventional Commits

Formato obligatorio:

```text
<tipo>(<ámbito>): <descripción concisa en imperativo>

[cuerpo opcional]

Refs: PBI-###
Sprint: S##
```

Tipos permitidos: `feat`, `fix`, `docs`, `refactor`, `test`, `chore`, `style`.

### Secuencia atómica TDD

```text
docs(spec): definir spec, plan, tareas y matriz de pruebas de PBI-###
test(scope): añadir pruebas rojas de PBI-### RF-##
feat(scope): implementar PBI-### RF-##
refactor(scope): simplificar implementación de PBI-### RF-##
docs(scope): actualizar documentación y changelog de PBI-###
```

Prohibido mezclar `feat` con `fix`, o código funcional con documentación pública en el mismo commit. Los tests rojos solo permanecen en la rama de trabajo.

---

## Gobernanza y seguridad

El proyecto usa el marco de [`.agent/rules/AGENTS.md`](.agent/rules/AGENTS.md), con hooks locales en `.agent/hooks/` y puertas estáticas en `scripts/github/`:

- `pre-commit`: telemetría de `PROXIMOS_PASOS.md`, blindaje del núcleo, escáner SAST de secretos, tokens y rutas privadas, y ejecución de `pre-commit-local.sh` (`typecheck`, `lint`, `vitest`).
- `pre-push` y `scripts/github/pre-pr-gate.sh`: protección de `main` como rama estricta de producción, validación de nombres de rama y verificación estática de 5 puertas antes de cada push o Pull Request:
  1. **[Gate 1]** Herramientas CLI y token personal obligatorio en `user_data/security/gh_token.txt` según rol en `docs/scrum/active_roles.env` con acceso al Tablón `Project #1`.
  2. **[Gate 2]** Sincronización previa obligatoria con `origin/develop` y ausencia de conflictos.
  3. **[Gate 3]** Paridad estricta con el núcleo de gobernanza global de `main`.
  4. **[Gate 4]** Suite local de calidad en verde (`typecheck`, `lint`, `vitest`).
  5. **[Gate 5]** Reconciliación automática de issues (`Closes #XX`) y columna `"Hecho"` en GitHub Projects (`scripts/github/sync-pr-issues.sh --reconcile`).

Reglas clave:

- Cero credenciales, tokens o datos personales en el repositorio (ni en GitHub Secrets).
- `user_data/` está siempre excluido y nunca se versiona.
- No se ejecuta `git commit`, `git push`, creación/merge de PR ni paso a producción (`main`) sin aprobación humana explícita.
- En cada *Kick-off* de Sprint es obligatorio actualizar `README.md`, `docs/scrum/active_roles.env` y `.github/CODEOWNERS` en `develop` y `main`.
- Cada PR de funcionalidad actualiza la [guía de pruebas funcionales](docs/guia-pruebas-funcionales.md) y, si introduce una decisión relevante, su [ADR](docs/decisiones/README.md).
- Al cerrar cada Sprint se crea el tag anotado `v0.<N>.0-S0<N>`.
- Los paquetes de release excluyen activos de gobernanza mediante `.gitattributes`.

### Inicio rápido según tu perfil

#### Para evaluar o probar la aplicación (Clientes / Stakeholders / Evaluadores)
No requiere instalar hooks ni configurar credenciales locales:
```bash
git clone https://github.com/Grup-05/ShopMaker-DAW.git
cd ShopMaker-DAW
npm install
npm run dev
```

> 🧪 Una vez arrancada, sigue la **[Guía de pruebas funcionales](docs/guia-pruebas-funcionales.md)** para recorrer cada funcionalidad como un cliente (cuenta demo incluida).

#### Para miembros del Equipo Scrum (Entorno de contribución obligatorio)
```bash
# 1. Instalar hooks de Git y protecciones SAST:
bash .agent/hooks/install-hooks.sh

# 2. Inicializar y comprobar entorno local de seguridad (autogenera forbidden_patterns.txt):
bash scripts/setup/init-user-security.sh --init

# 3. Configurar token personal de GitHub CLI en user_data/security/gh_token.txt (obligatorio para roles Scrum):
bash scripts/github/gh-auth-env.sh --login

# 4. Ejecutar la puerta estática de 5 controles antes de abrir o actualizar una PR:
bash scripts/github/pre-pr-gate.sh --pre-pr
```

---

## Estructura del repositorio

```text
.
├── .agent/               # Gobernanza: reglas, hooks y scripts de sincronización
├── .github/              # CODEOWNERS dinámico y workflows de CI/CD y Tablón Scrum
├── .gitattributes        # Normalización LF y empaquetado limpio de releases
├── .gitignore            # Exclusiones de seguridad (user_data/) y stack
├── docs/
│   ├── scrum/            # Artefactos Scrum, roles activos y seguimiento S01, S02, S03
│   └── decisiones/       # Registro de decisiones arquitectónicas (ADR-001, ADR-002)
├── scripts/              # Puerta pre-PR (pre-pr-gate.sh), reconciliación de tablón y rotación de roles
├── specs/                # Especificaciones SDD por PBI (PBI-001 a PBI-009) y plantillas
├── src/                  # Aplicación React + TypeScript organizada por capas (SOLID)
│   ├── app/              # Shell, rutas protegidas, guardia de sesión y proveedor de API
│   ├── domain/ports/     # Contratos hexagonales (AuthApiPort, SitesApiPort, ModulesApiPort, ApiError)
│   ├── infrastructure/   # Adaptador mock persistente en localStorage y fixtures deterministas
│   ├── features/         # Módulos funcionales (home, theme, auth, dashboard)
│   └── shared/           # Tokens CSS semánticos y utilidades compartidas
├── tests/                # Arnés oficial: setup.ts, unit/ y e2e/
├── CHANGELOG.md
├── PROXIMOS_PASOS.md
└── README.md
```

`src/` sigue una arquitectura limpia por capas (`presentation`, `application`, `domain`, `infrastructure`) con inversión de dependencias mediante puertos en `src/domain/ports/`. Las pruebas viven en `tests/` (`setup.ts`, `unit/` y `e2e/`) y junto a las features, con alias `@` hacia `src/`.

---

## Documentación de referencia

- [Gobernanza global](.agent/rules/AGENTS.md)
- [Perfil frontend UI/UX](.agent/rules/profile-uiux.md)
- [Metodología Scrum](.agent/rules/methodology-scrum.md)
- [Práctica TDD](.agent/rules/methodology-tdd.md)
- [Especificaciones](specs/README.md)
- [Guía de pruebas funcionales (como cliente)](docs/guia-pruebas-funcionales.md)
- [Registro de decisiones (ADR)](docs/decisiones/README.md)
- [Registro de cambios](CHANGELOG.md)

---

## Estado de pruebas

| Elemento | Estado |
|---|---|
| Arnés de pruebas | Vitest + React Testing Library + Playwright (`PBI-004`, consolidado) |
| Comando de suite | `npm test` (unitarias, componente, contrato y arquitectura) y `npm run test:e2e` (E2E) |
| Calidad estática | `npm run typecheck`, `npm run lint` y `npm run build` en verde |
| Cobertura de criterios de aceptación | **100 %** de los criterios de aceptación de los Sprints S01 (`PBI-001`, `PBI-002`, `PBI-004`) y S02 (`PBI-003`, `PBI-005`, `PBI-006`) cubiertos por pruebas automatizadas |
| Suite total consolidada | `npm test`: **107 tests en 20 archivos** (`PBI-001` a `PBI-006`); `npm run test:e2e`: **8 tests E2E** (4 × Chromium y Firefox) |
| Tests flaky conocidos | Ninguno registrado (`0 %`) |

La cobertura se mide por **criterios de aceptación cubiertos**, no por porcentaje de líneas. El objetivo es el 100 % de los criterios comprometidos en cada Sprint.

### Contrato de API y Adaptador Mock Persistente (`PBI-003`)

El frontend se desacopla del backend mediante los puertos de dominio en [`src/domain/ports/`](src/domain/ports/index.ts) (`AuthApiPort`, `SitesApiPort`, `ModulesApiPort` y el error normalizado `ApiError`) y el adaptador mock persistente en [`src/infrastructure/api/mock/`](src/infrastructure/api/mock/index.ts):

```ts
import { createMockApiAdapter, InMemoryStorage } from '@/infrastructure/api/mock';

// En navegador (persistencia en localStorage bajo 'shopmaker.mock.state.v1' y latencia 200-500 ms):
const api = createMockApiAdapter();

// En pruebas unitarias deterministas (sin latencia y en memoria):
const testApi = createMockApiAdapter({
  storage: new InMemoryStorage(),
  minLatencyMs: 0,
  maxLatencyMs: 0,
});
```

La guía completa de consumo, simulación de errores HTTP (`400`, `401`, `404`, `409`, `500`) y fixtures iniciales (`demo@shopmaker.local` y catálogo base de módulos) se documenta en [`specs/PBI-003-contrato-api-mock/evidence.md`](specs/PBI-003-contrato-api-mock/evidence.md).

### Comandos de desarrollo y pruebas

```bash
npm install            # instalar dependencias
npm run dev            # servidor de desarrollo Vite
npm test               # suite de componente, contratos y arquitectura (Vitest)
npm run test:e2e       # suite E2E (Playwright, Chromium y Firefox)
npm run typecheck      # comprobación de tipos
npm run lint           # ESLint
npm run build          # build de producción
```

La evidencia de los ciclos rojo → verde está en [`specs/PBI-001-aplicacion-web/evidence.md`](specs/PBI-001-aplicacion-web/evidence.md) y [`specs/PBI-003-contrato-api-mock/evidence.md`](specs/PBI-003-contrato-api-mock/evidence.md).
