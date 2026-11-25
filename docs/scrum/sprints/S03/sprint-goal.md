# Sprint Goal — S03 (CMS ShopMaker)

## Identificación

| Campo | Valor |
|---|---|
| Sprint | S03 — Editor de Webs, Detalle de Módulos y Compra Simulada |
| Fechas | 2026-12-01 → 2026-12-12 (2 semanas) |
| Duración | 10 días laborables |
| Scrum Master | Francisco Tomás (`@FSolaje`) |
| Product Owner | Fernando Ruescas (`@Fernis23228`) |

## Sprint Goal

> **«Permitir al usuario autenticado acceder al detalle de un módulo, realizar una compra simulada y abrir el editor de webs con autoguardado y recuperación de borradores, completando así el flujo central del CMS desde el catálogo hasta la construcción de la web.»**

---

## Preguntas que responde el Planning

- **¿Qué?**
  - **PBI-007:** Detalle de módulo y compra simulada — pantalla de módulo con descripción, precio y flujo de checkout simulado con actualización de titularidad.
  - **PBI-008:** Editor de webs con autoguardado y borradores — workspace de edición por bloques, autoguardado periódico y recuperación de borrador al reabrir.
- **¿Cómo?**
  - **Arquitectura de Puertos y Adaptadores:** Los nuevos casos de uso (`useModuleDetail`, `usePurchase`, `useEditor`) dependen de los puertos ya definidos en PBI-003 (`ModulesApiPort`, `SitesApiPort`). Ningún componente llama a `fetch` directamente.
  - **Desarrollo con mock persistente (PBI-003):** El adaptador mock ya implementado simula latencia, errores HTTP y persistencia en `localStorage`; la compra simulada actualiza la titularidad del módulo sin backend real.
  - **TDD estricto:** test rojo → implementación verde → refactor. Cada criterio de aceptación tiene al menos un test automatizado antes de la primera línea de código funcional.

---

## PBIs comprometidos en S03

| PBI | Título | Estimación S03 | Responsable | Estado inicial |
|---|---|---|---|---|
| PBI-007 | Detalle de módulo y compra simulada | ~24 h | Dev B (`@Tarrant15`) | En Sprint |
| PBI-008 | Editor de webs con autoguardado y borradores | ~28 h | Dev C (`@Fernis23228`) | En Sprint |

**Total planificado:** ~52 h en 2 workstreams paralelos.

> Las estimaciones son orientativas y deben confirmarse en el Sprint Planning con el equipo completo.

---

## Capacidad y riesgos

- **Capacidad estimada:** 3 developers × 10 días × 7–8 h ≈ 210–240 h brutas; **~52 h comprometidas en PBIs principales** con holgura para ceremonias, refinamiento, integración y testing continuo.
- **Reparto por workstream:**
  - **Workstream 1 (Dev B — `@Tarrant15`):** PBI-007 (~24 h) — Detalle y compra.
  - **Workstream 2 (Dev C — `@Fernis23228`):** PBI-008 (~28 h) — Editor y borradores.
  - **Dev A (`@FSolaje`):** Soporte de integración, revisión de PRs y calidad transversal.
- **Riesgos y mitigaciones:**
  - *Riesgo:* Complejidad del flujo de checkout con estados intermedios (selección → confirmación → éxito/error).
    *Mitigación:* Desglosar en tareas atómicas de TDD; cubrir estados de carga, error y confirmación en tests de componente.
  - *Riesgo:* El editor de bloques puede crecer en complejidad; riesgo de YAGNI.
    *Mitigación:* Implementar solo los tipos de bloque mínimos definidos en la spec (texto, imagen, separador); el sistema debe ser extensible por manifiesto, no hardcodeado.
  - *Riesgo:* Pérdida de borradores al recargar la pestaña.
    *Mitigación:* Autoguardado en `localStorage`/IndexedDB cada 30 s y al perder el foco de la ventana; prueba de regresión obligatoria.
  - *Riesgo:* PBI-005 (sesión) y PBI-006 (dashboard) deben estar mergeados en `develop` antes del Día 1.
    *Mitigación:* Verificar que PR `#58` (PBI-006) está mergeado; si no, bloquear el inicio de S03 y escalarlo al PO.

---

## Criterio de éxito (Incremento Demostrable)

Al final del Sprint S03 debe ser demostrable en la Sprint Review:

1. Un usuario autenticado navega al catálogo, abre el detalle de un módulo y completa el flujo de compra simulada; el módulo aparece como «Activo» en su panel y la titularidad persiste al recargar.
2. Desde el Dashboard, el usuario abre una web en el editor; puede añadir, reordenar y eliminar bloques de contenido básicos.
3. Si el usuario cierra el editor sin publicar y lo reabre, recupera automáticamente el borrador guardado.
4. Toda la suite de pruebas (unitarias, de componente, integración con mock) pasa en verde sin dependencias de red externa.
5. No hay tests desactivados, omitidos ni debilitados; la cobertura de criterios de aceptación es del 100 %.
