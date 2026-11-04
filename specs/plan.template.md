# Plan técnico — PBI-### <Título>

> Plantilla SDD. Copiar en `specs/PBI-###-<slug>/plan.md`. El plan conecta la spec con la implementación y con los tests.

## Metadatos

| Campo | Valor |
|---|---|
| PBI | `PBI-###` |
| Spec | `specs/PBI-###-<slug>/spec.md` |
| Autor | <nombre> |
| Fecha | YYYY-MM-DD |
| Estado | Borrador / Aprobado |

## 1. Resumen de la solución

<Enfoque elegido en 3–5 líneas, sin entrar en detalles de código.>

## 2. Decisiones técnicas

| ID | Decisión | Alternativas | Justificación |
|---|---|---|---|
| DT-01 | <decisión> | <alternativas> | <motivo> |

> Si la decisión afecta a varias features, crear un ADR en `docs/decisiones/`.

## 3. Arquitectura y capas

- **Presentación:** <componentes y páginas afectadas>
- **Aplicación/estado:** <casos de uso y estado>
- **Dominio:** <entidades y reglas>
- **Infraestructura:** <adaptadores, almacenamiento, APIs del navegador>

### Dependencias permitidas

```text
presentación → aplicación → dominio
infraestructura → puertos de aplicación/dominio
```

Prohibido: presentación → infraestructura directa.

## 4. Archivos y estructura prevista

```text
src/
├── app/…
├── features/<feature>/
│   ├── components/…
│   ├── domain/…
│   ├── application/…
│   ├── infrastructure/…
│   └── tests/…
└── shared/…
```

| Archivo / módulo | Responsabilidad |
|---|---|
| `<ruta>` | <responsabilidad> |

## 5. Estrategia de pruebas

- **Unitarias:** <qué se cubre>
- **Componente:** <qué se cubre>
- **Integración/contrato:** <qué se cubre>
- **E2E:** <flujos críticos>
- **Accesibilidad:** <herramientas y revisión manual>
- **Visual:** <componentes estables>
- **Seguridad:** <sanitización, sandbox, permisos>

### Datos y mocks

- Fixtures: <ubicación>
- Adaptador mock: <descripción>
- Sin red real ni datos personales.

## 6. Matriz de trazabilidad spec-test

> Obligatoria. Cada RF y cada criterio de aceptación debe aparecer al menos una vez.

| ID | Requerimiento / Criterio | Tipo de prueba | Test previsto | Estado |
|---|---|---|---|---|
| RF-01 | <requerimiento> | Unitaria / Componente / Integración | `<nombre-del-test>` | Pendiente |
| CA-01 | <criterio> | Componente | `<nombre-del-test>` | Pendiente |

## 7. Plan TDD por incrementos

| Incremento | Comportamiento | Test rojo | Implementación mínima | Refactor |
|---|---|---|---|---|
| 1 | <comportamiento> | `<test>` | <qué se implementa> | <qué se simplifica> |
| 2 | <comportamiento> | `<test>` | <qué se implementa> | <qué se simplifica> |

## 8. Riesgos técnicos

| Riesgo | Probabilidad | Impacto | Mitigación |
|---|---|---|---|
| <…> | Alta/Media/Baja | Alto/Medio/Bajo | <…> |

## 9. Checklist de aprobación del plan

- [ ] La arquitectura respeta SOLID y KISS.
- [ ] No se introducen dependencias sin justificar.
- [ ] La matriz spec-test cubre todos los RF y CA.
- [ ] Hay estrategia para estados de error, vacío, permisos y sin conexión.
- [ ] Hay estrategia de accesibilidad y seguridad.
- [ ] El plan es implementable dentro del Sprint.
