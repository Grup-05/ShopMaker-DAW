# Sprint Review — S02 (Identidad, Contratos Mock y Dashboard CMS)

## Identificación

| Campo | Valor |
|---|---|
| Sprint | S02 |
| Fecha | 2026-11-25 |
| Duración | 2026-11-17 → 2026-11-25 |
| Product Owner | Jesús Hernández (`@Tarrant15`) |
| Scrum Master | Fernando Ruescas (`@Fernis23228`) |
| Participantes | Francisco Tomás (`@FSolaje`), Jesús Hernández (`@Tarrant15`), Fernando Ruescas (`@Fernis23228`) |

## Sprint Goal

> «Dotar a ShopMaker de un ciclo completo de identidad (registro, login y rutas protegidas), respaldado por un contrato de API con mock persistente, y desplegar el panel de administración (Dashboard) con gestión de sitios web y catálogo preliminar de módulos, avanzando hacia la experiencia de un CMS maduro.»

**Resultado:** **Cumplido al 100 %.** Todos los PBIs comprometidos se han integrado en `develop` mediante Pull Request con revisión cruzada y suite en verde.

## Incremento demostrado

| PBI | Título | Resultado | Criterios aceptados | Evidencia |
|---|---|---|---|---|
| PBI-003 (`#4`) | Contrato de API y adaptador mock persistente | Completado e integrado | 5/5 (100 %) | PR `#56` (`b9579bb`) |
| PBI-005 (`#36`) | Registro, inicio de sesión y rutas protegidas | Completado e integrado | 4/4 (100 %) | PR `#59` (`0baef80`) |
| PBI-006 (`#37`) | Dashboard de administración y catálogo base | Completado e integrado | 4/4 (100 %) | PR `#58` (`a780f71`) |

## Estado de pruebas

- Comando de la suite: `npm test` (Vitest + RTL)
- Resultado: **Verde** — 20 archivos de test / 107 tests pasando tras la integración de los 3 PBIs en `develop`.
- Criterios de aceptación cubiertos: **100 %** en los 3 PBIs.
- Tests flaky conocidos: ninguno.

## Feedback del Product Owner y stakeholders

- Los 3 PBIs cumplen la Definition of Done y se aceptan para cerrar el incremento del Sprint S02.
- El flujo completo desde el registro/login hasta el dashboard, creación de sitios y exploración del catálogo es funcional de extremo a extremo sobre `LocalStorageMockApiAdapter`.

## Cambios en el Product Backlog

| Acción | PBI | Motivo |
|---|---|---|
| Cerrado (`Terminado`) | PBI-003, PBI-005, PBI-006 | Integrados en `develop` y aceptados en Sprint Review |
| Priorizados para S03 | PBI-007, PBI-008 | Siguiente paso natural del flujo CMS: compra simulada y editor de webs |

## Decisiones y acuerdos

- Dar por finalizado el Sprint S02 a fecha 2026-11-25 e iniciar la planificación del Sprint S03.
- Rotar los roles Scrum para S03: PO `@Fernis23228`, SM `@FSolaje`, Dev `@Tarrant15`.

## Próximo Sprint

- Foco propuesto: **Sprint S03 — Detalle de módulos con compra simulada (`PBI-007`) y Editor de webs con autoguardado y borradores (`PBI-008`)**.
- Riesgos detectados: necesidad de ampliar `ModulesApiPort` / `SitesApiPort` para checkout de módulos y persistencia de contenido/borradores del editor sin romper contratos existentes.
