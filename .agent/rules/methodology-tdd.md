---
trigger: always_on
---

# Regla de Práctica: Test-Driven Development (methodology-tdd.md)

Este documento define la práctica obligatoria de Test-Driven Development (TDD) del proyecto **ShopMaker-DAW** y su integración con Specification Driven Development (SDD) y Scrum.

Hereda la Constitución Global definida en [AGENTS.md](AGENTS.md) y complementa [methodology-scrum.md](methodology-scrum.md) y [profile-uiux.md](profile-uiux.md).

En caso de conflicto, prevalece `AGENTS.md`. Las prohibiciones de operaciones autónomas, los hooks y la aprobación humana siguen siendo obligatorias.

---

## 0. Principio fundamental

**No test, no code.**

1. Las pruebas son la **especificación ejecutable** del sistema.
2. Los tests se derivan de la spec y de los criterios de aceptación, nunca de la implementación.
3. TDD no significa "escribir todos los tests al final" ni "escribir toda la suite primero". Significa avanzar en ciclos pequeños: **rojo → verde → refactor**.
4. El código de producción es la consecuencia mínima necesaria para que un test pase.
5. La suite debe quedar siempre en verde antes de integrar en `develop` o abrir un PR.

---

## 1. Compatibilidad con SDD y Scrum

| Marco | Pregunta que responde | Aporte al proyecto |
|---|---|---|
| SDD | ¿Qué debe hacer y por qué? | Requisitos, criterios de aceptación y contrato |
| TDD | ¿Cómo demostramos que lo hace y cómo lo construimos? | Tests que fallan primero y código mínimo para pasar |
| Scrum | ¿Cuándo y con qué prioridad? | Sprint, Sprint Goal, Sprint Backlog y revisión |

Reglas de convivencia:

- La spec se redacta de forma **just-in-time** por PBI.
- Los tests se escriben **dentro del Sprint**, no en una fase posterior.
- Cada criterio de aceptación debe tener al menos una prueba automatizada.
- Si cambia la spec, cambian primero los tests y después la implementación.
- Un Sprint no se considera terminado si sus PBIs no tienen pruebas verdes.
- TDD no sustituye la revisión humana ni la aceptación del PO.

---

## 2. Ciclo TDD obligatorio

Para cada comportamiento:

1. **Leer la spec:** identificar el PBI, el requerimiento funcional y el criterio de aceptación.
2. **Construir la lista de tests:** enumerar los comportamientos pequeños y verificables. No hace falta escribir toda la lista de una vez.
3. **Rojo:** escribir la prueba más pequeña que falle por la razón esperada.
4. **Verificar el rojo:** ejecutar la prueba y comprobar que falla por el motivo correcto, no por un error de configuración.
5. **Verde:** implementar el código mínimo necesario para que la prueba pase.
6. **Refactor:** mejorar código y pruebas sin cambiar el comportamiento, manteniendo la suite en verde.
7. **Repetir** con el siguiente comportamiento.
8. **Commit** en hitos significativos.

Reglas:

- No se escribe código de producción sin una prueba que falle primero.
- No se implementa más de lo que la prueba exige.
- No se refactoriza con la suite en rojo.
- Si una prueba pasa antes de implementar, revisar si la prueba es válida o si ya existía el comportamiento.
- Si una prueba falla por una razón distinta a la esperada, corregir primero la prueba o el entorno.

### 2.1. Corrección de errores

Todo bug debe corregirse con una **prueba de regresión primero**:

1. Reproducir el fallo con un test que falle.
2. Confirmar que el test falla por el bug.
3. Implementar la corrección mínima.
4. Verificar que el test pasa y que no rompe otros.
5. Confirmar con `fix(...)`.

### 2.2. Refactorización

- La suite debe estar en verde antes y después.
- No se cambia comportamiento.
- Se confirma con `refactor(...)`.
- Si el refactor descubre un bug, se trata como corrección aparte.

---

## 3. De la especificación a los tests

### 3.1. Criterios de aceptación verificables

Los criterios de aceptación deben expresarse preferentemente en formato:

```text
Dado <contexto>
Cuando <acción>
Entonces <resultado observable>
```

Cada criterio debe ser observable desde fuera, sin depender de detalles internos.

### 3.2. Matriz de trazabilidad spec-test

En `plan.md` se incluirá una matriz:

| ID | Requerimiento / Criterio | Tipo de prueba | Test | Estado |
|---|---|---|---|---|
| RF-01 | El usuario puede registrarse | Componente / integración | `registro.spec` | Pendiente |
| RF-02 | El catálogo muestra estados de error | Componente | `catalogo-error.spec` | Pendiente |

Regla: **cada RF y cada criterio de aceptación debe aparecer al menos una vez en la matriz**.

### 3.3. Lista de tests en `tasks.md`

Antes de implementar, `tasks.md` debe contener las tareas TDD:

- [ ] Enumerar los tests del siguiente comportamiento.
- [ ] Escribir el test rojo.
- [ ] Implementar el mínimo verde.
- [ ] Refactorizar.
- [ ] Repetir con el siguiente comportamiento.
- [ ] Verificar la matriz de trazabilidad.

### 3.4. Nomenclatura

Los tests deben describir comportamiento, no implementación. Se recomienda incluir la referencia:

```text
[PBI-012][RF-02] debe mostrar un error cuando la API falla
```

Nunca nombres como `test1`, `prueba`, `funciona` o referencias a métodos privados.

---

## 4. Niveles y tipos de prueba

| Nivel | Qué cubre | Ejemplos |
|---|---|---|
| Unitario | Dominio, validadores, utilidades, estado puro | Cálculo de precios, validación de manifiestos |
| Componente | Comportamiento visible de la UI | Formularios, estados, navegación |
| Integración | Adaptadores y contratos | Cliente de API contra mock/OpenAPI |
| Contrato | Compatibilidad con backend | Esquemas de petición y respuesta |
| E2E | Flujos críticos completos | Registro, compra simulada, publicación de web |
| Visual | Apariencia estable de componentes críticos | Tokens, layouts, previsualización |
| Accesibilidad | Teclado, foco, roles, contraste | Navegación sin ratón, etiquetas |
| Seguridad | Sanitización, permisos, sandbox | Contenido generado por usuarios |
| Despliegue | Arranque de la app web y fallback de SPA | Smoke test en el navegador objetivo |

Reglas:

- Pirámide equilibrada: muchas pruebas unitarias y de componente, menos integración y E2E.
- Probar comportamiento observable, no detalles internos.
- Evitar sobre-mockear; usar dobles solo en fronteras reales.
- Pruebas independientes, deterministas y repetibles.
- Sin red real, sin compras reales, sin datos personales reales.
- Usar fixtures y factorías versionadas.
- Limpiar el estado entre pruebas.

---

## 5. TDD en UI/UX y web

1. **Consultas accesibles:** los tests de componentes deben buscar por rol, etiqueta o texto visible, no por clases CSS ni estructura interna.
2. **Estados obligatorios:** carga, vacío, error, éxito, deshabilitado, sin permisos y sin conexión.
3. **Formularios:** validación, mensajes de error, conservación de datos y confirmación de acciones destructivas.
4. **Editor de webs:** autoguardado, recuperación de borradores, publicación y previsualización aislada.
5. **Compras y módulos:** la UI refleja permisos y titularidad; los tests usan respuestas simuladas del backend.
6. **Aplicación web:** routing, fallback de SPA, carga, viewport mínimo, zoom y atajos de teclado.
7. **Regresión visual:** solo para componentes estables y previsualizaciones; no convertir cada detalle estético en un snapshot frágil.
8. **Accesibilidad:** automatizada con herramientas y revisión manual con teclado y lector de pantalla.

---

## 6. TDD dentro de Scrum

### 6.1. Refinamiento

- Los criterios de aceptación deben ser testeables.
- Se identifican datos de prueba, fixtures y dependencias.
- Se detectan requisitos no funcionales que necesitan pruebas específicas.

### 6.2. Sprint Planning

- Las tareas de prueba se estiman y forman parte del Sprint Backlog.
- No existe una "fase de pruebas" separada al final del Sprint.
- Se define el entorno de pruebas y los mocks necesarios.

### 6.3. Sprint Backlog

Cada PBI incluye tareas visibles:

- Lista de tests.
- Test rojo.
- Implementación verde.
- Refactor.
- Pruebas de regresión.

### 6.4. Daily Scrum

- Se mencionan tests rojos, bloqueos de entorno y dependencias.
- Un test rojo no es un fracaso: es una señal de progreso si se entiende.

### 6.5. Sprint Review

- Se muestra la suite en verde y la matriz de criterios cubiertos.
- El PO acepta el incremento con evidencia, no solo con una demo visual.

### 6.6. Sprint Retrospective

- Se revisan tests frágiles, lentos o duplicados.
- Se identifican huecos de cobertura de criterios.
- Las mejoras de testing se convierten en acciones con responsable.

---

## 7. Commits y trazabilidad

### 7.1. Orden recomendado

```text
docs(spec): definir requerimientos, plan, tareas y matriz de pruebas para PBI-###
test(scope): añadir pruebas rojas para PBI-### RF-##
feat(scope): implementar PBI-### RF-##
refactor(scope): simplificar implementación de PBI-### RF-##
docs(scope): actualizar documentación y changelog de PBI-###
```

Esta secuencia es una **variante válida del ciclo atómico** de `AGENTS.md`. Cada commit contiene un único tipo y el PR solo se abre con la suite en verde.

### 7.2. Reglas

- Los tests rojos se quedan en la rama de trabajo; nunca en `develop` ni en `main`.
- No se hace merge de una rama con tests rojos.
- No se eliminan, desactivan ni debilitan tests para obtener verde.
- No se cambia una aserción sin justificar el cambio en la spec o en el PR.
- Todo PR debe incluir evidencia de la suite y de la matriz de trazabilidad.
- Los tests también se revisan como código.

### 7.3. Cobertura

- **100 % de criterios de aceptación cubiertos.**
- La cobertura de líneas es una guía, no un objetivo dogmático.
- No se persiguen porcentajes inflando tests triviales.
- Un criterio sin test es un criterio no terminado.

---

## 8. Prohibiciones

- Escribir código de producción sin test previo.
- Implementar funcionalidad no cubierta por la spec.
- Añadir tests después del código y llamarlo TDD.
- Desactivar hooks, tests o comprobaciones para conseguir verde.
- Usar datos reales, secretos o información personal en tests.
- Crear tests dependientes del orden de ejecución.
- Testear métodos privados o detalles de implementación.
- Aceptar tests frágiles o flaky sin registrarlos y corregirlos.
- Abrir PR con la suite en rojo.

---

## 9. Métricas de calidad

- Criterios de aceptación cubiertos: **100 %**.
- Suite verde en `develop` y en el PR.
- Tasa de tests flaky en `main`: **0**.
- Tiempo de la suite dentro del presupuesto acordado.
- Defectos escapados por Sprint: se revisan en la retrospectiva.
- La cobertura de líneas se consulta, pero no se usa para presionar al equipo.

---

## 10. Excepciones

- **Spikes:** código desechable para investigar; no se integra como producción y produce un documento de hallazgos.
- **Código generado o configuración trivial:** se justifica en el PR y se acompaña de un smoke test.
- **Código legado:** se escriben tests de caracterización antes de modificarlo.
- **Hotfix urgente:** se intenta primero la prueba de regresión; si no es posible, se documenta y se crea un PBI de seguimiento para añadirla.
