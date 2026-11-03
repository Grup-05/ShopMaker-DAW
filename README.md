# ShopMaker-DAW

Frontend del **CMS ShopMaker**, una aplicación que permite a los usuarios comprar módulos y construir su propia página web, con alojamiento proporcionado por la plataforma.

Este repositorio contiene **exclusivamente el frontend**. La arquitectura del sistema es de tres capas —frontend, backend/API y base de datos— y toda la lógica de negocio, permisos, compras y datos vive en el backend.

La primera entrega se ejecuta como **aplicación web desktop-first en el navegador**. El stack es **React + TypeScript + Vite** ([ADR-001](docs/decisiones/ADR-001-react-typescript.md)) y el formato de entrega es una **SPA** ([ADR-002](docs/decisiones/ADR-002-aplicacion-web.md)); no hay shell nativo ni instalador.

---

## Estado del proyecto

- **Fase actual:** Sprint S01 — Sprint 0 de fundaciones.
- **Incremento:** entorno base, sistema visual accesible, contrato de API con mock y arnés de pruebas.
- **Stack:** React + TypeScript + Vite ([ADR-001](docs/decisiones/ADR-001-react-typescript.md)).
- **Entrega:** aplicación web SPA, desktop-first ([ADR-002](docs/decisiones/ADR-002-aplicacion-web.md)).
- **Versión:** `v0.1.0-alpha.1` (inicialización de gobernanza).
- **Seguimiento:** [`PROXIMOS_PASOS.md`](PROXIMOS_PASOS.md).

---

## Equipo y roles

| Integrante | Rol |
|---|---|
| Jesús Hernández | Scrum Master |
| Francisco Tomas | Product Owner |
| Fernando Ruescas | Developer |
| Javier Ibañez | Cliente / Stakeholder |

Detalle de responsabilidades en [`docs/scrum/team.md`](docs/scrum/team.md).

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
│   ├── definition-of-ready.md
│   ├── definition-of-done.md
│   ├── product-backlog.md
│   ├── plantillas/
│   └── sprints/
│       └── S01/
│           ├── sprint-goal.md
│           ├── sprint-backlog.md
│           ├── review.md
│           └── retrospective.md
└── decisiones/
    ├── README.md
    └── ADR-template.md
```

- [Product Backlog](docs/scrum/product-backlog.md)
- [Sprint S01 — Sprint Goal](docs/scrum/sprints/S01/sprint-goal.md)
- [Sprint S01 — Sprint Backlog](docs/scrum/sprints/S01/sprint-backlog.md)

El **Sprint no es una rama**: es un intervalo temporal que agrupa PBIs y ramas cortas de GitFlow.

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

El proyecto usa el marco de [`.agent/rules/AGENTS.md`](.agent/rules/AGENTS.md), con hooks locales en `.agent/hooks/`:

- `pre-commit`: telemetría de `PROXIMOS_PASOS.md`, blindaje del núcleo y escáner SAST de secretos, tokens y rutas privadas.
- `pre-push`: protección de `main` y validación de nombres de rama.

Reglas clave:

- Cero credenciales, tokens o datos personales en el repositorio.
- `user_data/` está siempre excluido y nunca se versiona.
- No se ejecuta `git commit` ni `git push` sin aprobación humana explícita.
- Los paquetes de release excluyen activos de gobernanza mediante `.gitattributes`.

Instalación y validación de hooks:

```bash
bash .agent/hooks/install-hooks.sh
bash -n .agent/hooks/pre-commit
```

---

## Estructura del repositorio

```text
.
├── .agent/               # Gobernanza: reglas, hooks y scripts
├── .gitattributes        # Empaquetado limpio de releases
├── .gitignore            # Exclusiones de seguridad y stack
├── docs/
│   ├── scrum/            # Artefactos Scrum
│   └── decisiones/       # ADR
├── specs/                # Especificaciones por PBI y plantillas
├── draft-specs/          # Borradores informales (no fuente de verdad)
├── CHANGELOG.md
├── PROXIMOS_PASOS.md
└── README.md
```

La estructura de código (`src/`) se definirá en el `plan.md` del PBI-001 conforme al stack React + TypeScript + Vite.

---

## Documentación de referencia

- [Gobernanza global](.agent/rules/AGENTS.md)
- [Perfil frontend UI/UX](.agent/rules/profile-uiux.md)
- [Metodología Scrum](.agent/rules/methodology-scrum.md)
- [Práctica TDD](.agent/rules/methodology-tdd.md)
- [Especificaciones](specs/README.md)
- [Decisiones arquitectónicas (ADR)](docs/decisiones/README.md)
- [Registro de cambios](CHANGELOG.md)

---

## Estado de pruebas

| Elemento | Estado |
|---|---|
| Arnés de pruebas | Pendiente (PBI-004) |
| Comando de suite | Pendiente |
| Cobertura de criterios de aceptación | Pendiente |
| Tests flaky conocidos | Ninguno registrado |

La cobertura se mide por **criterios de aceptación cubiertos**, no por porcentaje de líneas. El objetivo es el 100 % de los criterios comprometidos en cada Sprint.
