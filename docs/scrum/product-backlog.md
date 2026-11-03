# Product Backlog — ShopMaker-DAW

> Fuente de verdad de requisitos. El Product Owner prioriza; los Developers refinan y estiman.
> Los PBIs marcados como **Propuesto** requieren validación del Product Owner antes de entrar en un Sprint.

## Estados

`Nuevo` · `Refinado` · `En Sprint` · `Terminado` · `Descartado`

## Visión del producto

ShopMaker es un CMS que permite a los usuarios **comprar módulos y construir su propia página web**, con alojamiento proporcionado por la plataforma. Este repositorio contiene **solo el frontend**, que en su primera entrega se ejecuta como **aplicación web desktop-first en el navegador**.

## Tabla de PBIs

| ID | Título | Prioridad | Estimación | Estado | Sprint | Spec |
|---|---|---|---|---|---|---|
| PBI-001 | Inicializar la aplicación web y la estructura base | Alta | 36 h (30 h en S01) | En Sprint | S01 | Pendiente |
| PBI-002 | Definir tokens de diseño, tema claro/oscuro y accesibilidad base | Alta | 36 h (21 h en S01) | En Sprint | S01 | Pendiente |
| PBI-003 | Definir el contrato de API y el adaptador mock | Alta | 38 h | Refinado | S02 | Pendiente |
| PBI-004 | Configurar el arnés de pruebas y el hook local de calidad | Alta | 30 h (25 h en S01) | En Sprint | S01 | Pendiente |
| PBI-005 | Registro e inicio de sesión de usuarios | Alta | — | Nuevo | — | Pendiente |
| PBI-006 | Catálogo de módulos comprables con búsqueda y filtros | Alta | — | Nuevo | — | Pendiente |
| PBI-007 | Detalle de módulo y compra simulada | Alta | — | Nuevo | — | Pendiente |
| PBI-008 | Editor de webs con autoguardado y borradores | Alta | — | Nuevo | — | Pendiente |
| PBI-009 | Previsualización aislada y segura de la web | Alta | — | Nuevo | — | Pendiente |
| PBI-010 | Publicación de la web y panel de alojamiento | Media | — | Nuevo | — | Pendiente |
| PBI-011 | Gestión de módulos activos y permisos | Media | — | Nuevo | — | Pendiente |
| PBI-012 | Accesibilidad transversal y navegación por teclado | Alta | — | Nuevo | — | Pendiente |

> Las prioridades y el orden son propuestas iniciales. El Product Owner debe confirmarlos en el refinamiento.

---

## Detalle de los PBIs del Sprint S01

### PBI-001 — Inicializar la aplicación web y la estructura base

**Como** Developer, **quiero** disponer de una aplicación web mínima y de una estructura por capas, **para** construir las features del CMS sobre una base testeable y segura.

**Valor:** desbloquea todo el desarrollo posterior.

**Criterios de aceptación**

- [ ] La aplicación arranca en el navegador y muestra la pantalla base en 1280×800; el layout funciona en 1024×720 sin scroll horizontal.
- [ ] Existe separación entre presentación, aplicación/estado, dominio e infraestructura.
- [ ] El código del cliente no accede a Node ni al sistema de archivos; solo usa APIs del navegador.
- [ ] La navegación básica funciona con teclado y ratón.
- [ ] Existe una prueba de humo de arranque en navegador.

**Estimación:** 36 h totales (30 h comprometidas en S01: `T01–T06`; 6 h en S02: `T07–T08`).
**Dependencias:** ADR-001 (React + TypeScript + Vite) y ADR-002 (aplicación web).
**Riesgos:** confundir desktop-first con una aplicación nativa; sobreconfiguración inicial; falta de fallback de SPA en el hosting.

**Spec:** `specs/PBI-001-aplicacion-web/` (pendiente).

### PBI-002 — Definir tokens de diseño, tema claro/oscuro y accesibilidad base

**Como** usuario, **quiero** una interfaz legible y accesible en tema claro y oscuro, **para** usar el CMS sin fatiga visual y con apoyos técnicos.

**Criterios de aceptación**

- [ ] Todos los colores, espaciados, radios y tipografías usan tokens semánticos.
- [ ] El contraste de texto cumple ≥ 4.5:1 y el de controles ≥ 3:1.
- [ ] El foco es visible y el orden de tabulación es lógico.
- [ ] No se transmite información únicamente mediante color.
- [ ] El zoom al 200 % no oculta contenido ni funcionalidad.

**Estimación:** 36 h totales (21 h comprometidas en S01: `T01–T05`; 15 h en S02: `T06–T08`).
**Spec:** `specs/PBI-002-tokens-accesibilidad/` (pendiente).

### PBI-003 — Definir el contrato de API y el adaptador mock

**Como** Developer, **quiero** un contrato de API documentado y un adaptador mock, **para** desarrollar el frontend sin depender del backend y probar de forma determinista.

**Criterios de aceptación**

- [ ] El contrato define los endpoints, DTO y errores normalizados que consume el frontend.
- [ ] Todo acceso a red pasa por un adaptador de infraestructura.
- [ ] Existe un adaptador mock para desarrollo y pruebas.
- [ ] La UI contempla carga, vacío, error, reintento y sin conexión.
- [ ] Los DTO se validan en la frontera.

**Estimación:** 38 h (pospuesto a Sprint S02 por ajuste de capacidad en S01).
**Spec:** `specs/PBI-003-contrato-api/` (pendiente).

### PBI-004 — Configurar el arnés de pruebas y el hook local de calidad

**Como** Developer, **quiero** un entorno de pruebas reproducible y un hook local, **para** aplicar TDD y detectar regresiones antes de abrir un PR.

**Criterios de aceptación**

- [ ] Existe un comando único para ejecutar la suite completa.
- [ ] La suite se ejecuta de forma determinista y sin red real.
- [ ] Existe una prueba de ejemplo que falla antes de implementar y pasa después.
- [ ] `.agent/hooks/pre-commit-local.sh` ejecuta linters y tests del proyecto.
- [ ] La documentación explica cómo añadir y ejecutar pruebas.

**Estimación:** 30 h totales (25 h comprometidas en S01: `T01–T05`; 5 h en S02: `T06–T07`).
**Spec:** `specs/PBI-004-arnes-pruebas/` (pendiente).

---

## Plantilla de alta de PBI

Usa [plantillas/product-backlog.template.md](plantillas/product-backlog.template.md) y añade la fila correspondiente a la tabla superior.
