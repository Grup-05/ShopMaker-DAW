# Definition of Done (DoD)

## DoD de un PBI

- [ ] Se cumplen todos los criterios de aceptación.
- [ ] La spec, el plan y las tareas reflejan la implementación final.
- [ ] Cada criterio de aceptación tiene al menos una prueba automatizada.
- [ ] Las pruebas se escribieron antes de la implementación; la rama o el PR lo evidencian.
- [ ] La lista de tests de `tasks.md` está completa.
- [ ] La suite está en verde.
- [ ] Se han cubierto los estados de carga, vacío, error, permisos y sin conexión cuando aplican.
- [ ] Se ha verificado accesibilidad por teclado, foco, contraste y zoom.
- [ ] No hay secretos, tokens, rutas privadas ni patrones prohibidos.
- [ ] El hook SAST de `pre-commit` finaliza limpio.
- [ ] No hay tests desactivados, omitidos o debilitados sin justificación y PBI asociado.
- [ ] Los bugs corregidos tienen prueba de regresión.
- [ ] Los tests son deterministas, independientes y no usan datos reales.
- [ ] La matriz spec-test está actualizada.
- [ ] El código ha sido revisado mediante Pull Request.
- [ ] Las issues del PBI reflejaron su ciclo real en el Tablón Scrum (`En progreso` → `En revisión` → `Hecho`, sincronizado con `Status` nativo; `ADR-015`).
- [ ] `README.md` y `CHANGELOG.md` están actualizados cuando corresponde.
- [ ] `docs/guia-pruebas-funcionales.md` incluye el recorrido de prueba del PBI como cliente, actualizado dentro de la propia PR (o declara que no hay cambios visibles).
- [ ] Toda decisión relevante del PBI está registrada como `ADR-###` en `docs/decisiones/` y en su índice (o la PR indica que no hay ninguna).
- [ ] El PBI es demostrable en el Sprint Review.

## DoD del Incremento de Sprint

- [ ] Todos los PBIs comprometidos cumplen su DoD o han sido devueltos al Product Backlog con transparencia.
- [ ] El Sprint Goal se ha cumplido o se explica formalmente por qué no.
- [ ] La aplicación compila y arranca en el entorno objetivo.
- [ ] La suite completa de pruebas pasa.
- [ ] La cobertura de criterios de aceptación es del **100 %**.
- [ ] No hay tests flaky conocidos sin acción registrada.
- [ ] El Product Owner ha revisado y aceptado el incremento.
- [ ] `review.md` y `retrospective.md` están registrados.
- [ ] Se ha creado el tag anotado de Sprint `v0.<N>.0-S0<N>` sobre el commit de cierre (`AGENTS.md` §5.5).
- [ ] Todas las decisiones relevantes del Sprint tienen su `ADR-###` y el índice está al día.
- [ ] `README.md` de `develop` y `main` refleja el Sprint cerrado y el siguiente.
- [ ] `PROXIMOS_PASOS.md` refleja el estado real.
- [ ] Las acciones de mejora tienen responsable y fecha.
- [ ] No existen defectos críticos conocidos sin registrar.

## Evidencia obligatoria en el Pull Request

1. Enlace al PBI y al Sprint.
2. Resumen de la spec y de los criterios cubiertos.
3. Salida de la suite de pruebas en verde.
4. Matriz spec-test actualizada.
5. Notas de accesibilidad y de seguridad cuando apliquen.
6. Confirmación de que no se han incluido secretos ni datos privados.
7. Sección «Cómo probar esta funcionalidad como cliente» y actualización de `docs/guia-pruebas-funcionales.md` en la propia PR.
8. Enlace al `ADR-###` creado o actualizado (o indicación expresa de que no hay decisión relevante).
