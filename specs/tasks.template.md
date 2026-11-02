# Tareas TDD — PBI-### <Título>

> Plantilla SDD/TDD. Copiar en `specs/PBI-###-<slug>/tasks.md`. Las tareas se ejecutan en orden y cada ciclo termina con la suite en verde.

## Metadatos

| Campo | Valor |
|---|---|
| PBI | `PBI-###` |
| Spec | `specs/PBI-###-<slug>/spec.md` |
| Plan | `specs/PBI-###-<slug>/plan.md` |
| Responsable | <nombre> |
| Estado | Pendiente / En progreso / Terminado |

## 0. Preparación

- [ ] Leer la spec y localizar los RF y CA aplicables.
- [ ] Revisar la matriz spec-test del plan.
- [ ] Confirmar fixtures, mocks y entorno de pruebas.
- [ ] Confirmar que la rama `feature/PBI-###-<slug>` está creada desde `develop`.
- [ ] Confirmar el commit `docs(spec): ...`.

## 1. Lista de tests

> Enumerar comportamientos pequeños y verificables antes de escribir código.

- [ ] `[PBI-###][RF-01] <comportamiento esperado>`
- [ ] `[PBI-###][CA-01] <comportamiento esperado>`
- [ ] `[PBI-###][RF-02] <comportamiento esperado>`

## 2. Ciclos TDD

### Ciclo 1 — <comportamiento>

- [ ] **Rojo:** escribir la prueba y verificar que falla por la razón esperada.
- [ ] **Verde:** implementar el mínimo necesario.
- [ ] **Refactor:** simplificar sin cambiar comportamiento.
- [ ] Actualizar la matriz spec-test a `Verde`.
- [ ] Commit `test(...)` y `feat(...)` según corresponda.

### Ciclo 2 — <comportamiento>

- [ ] **Rojo:** escribir la prueba y verificar que falla por la razón esperada.
- [ ] **Verde:** implementar el mínimo necesario.
- [ ] **Refactor:** simplificar sin cambiar comportamiento.
- [ ] Actualizar la matriz spec-test a `Verde`.
- [ ] Commit `test(...)` y `feat(...)` según corresponda.

> Repetir tantos ciclos como comportamientos tenga el PBI.

## 3. Estados y calidad transversal

- [ ] Carga.
- [ ] Vacío.
- [ ] Error con reintento.
- [ ] Sin permisos.
- [ ] Sin conexión.
- [ ] Contenido largo.
- [ ] Navegación por teclado y foco visible.
- [ ] Contraste y zoom al 200 %.
- [ ] Sanitización y ausencia de secretos.

## 4. Cierre

- [ ] Suite completa en verde.
- [ ] Matriz spec-test al 100 % de CA cubiertos.
- [ ] Sin tests omitidos o debilitados sin justificación.
- [ ] Revisión de código mediante PR.
- [ ] `README.md` y `CHANGELOG.md` actualizados si corresponde.
- [ ] PBI demostrable en el Sprint Review.

## 5. Evidencia

| Elemento | Enlace / resultado |
|---|---|
| Comando de pruebas | `<comando>` |
| Resultado de la suite | <verde / rojo> |
| PR | <enlace> |
| Commits | <hashes> |
| Notas de accesibilidad | <…> |
| Notas de seguridad | <…> |
