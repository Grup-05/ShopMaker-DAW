# Spec — PBI-### <Título>

> Plantilla SDD. Copiar en `specs/PBI-###-<slug>/spec.md`. La spec define el contrato; los tests lo convierten en algo ejecutable.

## Metadatos

| Campo | Valor |
|---|---|
| PBI | `PBI-###` |
| Sprint | S## |
| Autor | <nombre> |
| Fecha | YYYY-MM-DD |
| Estado | Borrador / En revisión / Aprobada |
| Rama | `feature/PBI-###-<slug>` |

## 1. Contexto y problema

<Qué necesita el usuario, qué problema existe y por qué ahora.>

## 2. Historias de usuario y flujos

### Historia principal

**Como** <rol>, **quiero** <capacidad>, **para** <beneficio>.

### Flujo principal

1. <Paso>
2. <Paso>
3. <Resultado observable>

### Flujos alternativos y de error

- <Flujo alternativo o error previsto.>

## 3. Requerimientos funcionales

| ID | Requerimiento | Prioridad |
|---|---|---|
| RF-01 | <El sistema debe…> | Alta |
| RF-02 | <El sistema debe…> | Media |

## 4. Requerimientos no funcionales

| ID | Categoría | Requerimiento |
|---|---|---|
| RNF-01 | Accesibilidad | <WCAG 2.1 AA, teclado, foco, contraste…> |
| RNF-02 | Rendimiento | <presupuesto concreto> |
| RNF-03 | Seguridad | <sanitización, sandbox, permisos…> |
| RNF-04 | Compatibilidad | <sistema objetivo, resoluciones…> |

## 5. Criterios de aceptación

> Formato preferente: Dado / Cuando / Entonces. Cada criterio debe ser observable desde fuera.

| ID | Criterio | RF asociado |
|---|---|---|
| CA-01 | Dado <contexto>, cuando <acción>, entonces <resultado>. | RF-01 |
| CA-02 | Dado <contexto>, cuando <acción>, entonces <resultado>. | RF-02 |

## 6. Estados de interfaz

| Estado | Comportamiento esperado |
|---|---|
| Carga | <…> |
| Vacío | <…> |
| Error | <…> |
| Éxito | <…> |
| Sin permisos | <…> |
| Sin conexión | <…> |
| Deshabilitado | <…> |

## 7. Contrato de API y dependencias

- Endpoint(s): <método y ruta>
- DTO de entrada: <esquema>
- DTO de salida: <esquema>
- Errores normalizados: <códigos y mensajes>
- Adaptador mock: <descripción>
- Dependencias del backend: <versión o acuerdo>

## 8. Fuera de alcance

- <Qué no incluye este PBI.>

## 9. Riesgos y supuestos

| Riesgo / supuesto | Impacto | Mitigación |
|---|---|---|
| <…> | <…> | <…> |

## 10. Preguntas abiertas

- [ ] `[NEEDS CLARIFICATION]` <pregunta que requiere decisión humana.>

## 11. Referencias

- Product Backlog: `docs/scrum/product-backlog.md`
- Decisiones: `docs/decisiones/`
- Diseño visual: `specs/visual-design-specs.md`
