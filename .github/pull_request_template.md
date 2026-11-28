## PBI y Sprint

- **PBI:** PBI-###
- **Sprint:** S##
- **Issue:** Closes #
- **Spec:** `specs/PBI-###-<slug>/`

## Resumen

<Qué cambia y por qué.>

## Criterios cubiertos

- [ ] CA-01
- [ ] CA-02

## Evidencia de pruebas

```text
<salida del comando único de suite>
```

- [ ] Suite completa en verde.
- [ ] Matriz spec-test actualizada.
- [ ] Tests escritos antes de la implementación (enlaces a commits `test(...)`).

## 🧪 Cómo probar esta funcionalidad como cliente

> Resume aquí los pasos y enlaza la sección de [`docs/guia-pruebas-funcionales.md`](../docs/guia-pruebas-funcionales.md) que has actualizado en esta PR. Quien revise la PR debe poder probarla siguiendo la guía.

1. <Paso 1>
2. <Paso 2>
3. <Resultado esperado>

- [ ] `docs/guia-pruebas-funcionales.md` actualizada en esta PR (o declarado en ella que el PBI no tiene cambios visibles para el cliente).

## 📚 Decisiones (ADR)

- [ ] Si esta PR introduce o cambia una decisión relevante (arquitectura, contratos, dependencias, seguridad, proceso), se ha creado o actualizado el `ADR-###` en `docs/decisiones/` y su índice.
- [ ] Si no hay decisión relevante, se indica aquí: <ninguna / motivo>.

## Accesibilidad y seguridad

- [ ] Navegación por teclado y foco visible.
- [ ] Contraste y zoom al 200 %.
- [ ] Sin secretos, tokens ni rutas privadas.
- [ ] Sin `eval`, `new Function` ni HTML sin sanitizar.

## Checklist

- [ ] La spec, el plan y las tareas reflejan la implementación.
- [ ] Todas las issues abarcadas por esta PR pasaron por `En progreso` (`In Progress`) y quedan en `En revisión` en el Tablón Scrum (ninguna permanece en `Sprint Backlog` / `Todo`).
- [ ] `CHANGELOG.md` y `README.md` actualizados si corresponde.
- [ ] No se han debilitado ni omitido tests sin justificación.
- [ ] El PBI es demostrable en el Sprint Review.
