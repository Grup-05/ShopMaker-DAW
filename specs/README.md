# Especificaciones por PBI (SDD)

Cada PBI del Product Backlog tiene su propia carpeta:

```text
specs/
├── PBI-###-<slug>/
│   ├── spec.md
│   ├── plan.md
│   └── tasks.md
├── spec.template.md
├── plan.template.md
├── tasks.template.md
└── visual-design-specs.md
```

## Regla No-Spec-No-Code

Antes de escribir la primera línea de código de producción:

1. El PBI cumple la Definition of Ready.
2. `spec.md`, `plan.md` y `tasks.md` están aprobados.
3. La matriz de trazabilidad spec-test tiene una fila por criterio de aceptación.
4. Se ha confirmado el commit `docs(spec): ...`.

## Plantillas

- [spec.template.md](spec.template.md): qué debe hacer el sistema y por qué.
- [plan.template.md](plan.template.md): cómo se construye, arquitectura y matriz spec-test.
- [tasks.template.md](tasks.template.md): desglose TDD en rojo → verde → refactor.
- [visual-design-specs.template.md](visual-design-specs.template.md): tokens, contraste y decisiones visuales.

## Convención de nombres

- Carpeta: `PBI-###-<slug-en-kebab-case>`.
- Rama: `feature/PBI-###-<slug>`.
- PR: `[PBI-###] <título>`.
- Commits: `docs(spec)`, `test`, `feat`/`fix`, `refactor`, `docs`, con pie `Refs: PBI-###` y `Sprint: S##`.

## Cambios durante el Sprint

Si la spec cambia, primero se actualizan los tests y después el código. El cambio se confirma con un nuevo `docs(spec): ...` y se refleja en la matriz de trazabilidad.
