# Spec — PBI-003 Contrato de API y Adaptador Mock Persistente

> Especificación SDD del contrato de API y adaptador mock con persistencia local y simulación de red/errores.

## Metadatos

| Campo | Valor |
|---|---|
| PBI | `PBI-003` |
| Sprint | `S02` |
| Autor | Francisco Tomás (`@FSolaje`, Dev A) |
| Fecha | 2026-11-17 |
| Estado | Borrador inicial — pendiente de revisión |
| Rama prevista | `feature/PBI-003-contrato-api-mock` |

---

## 1. Contexto y problema

ShopMaker es un frontend desacoplado de tres capas. Para desarrollar y probar la funcionalidad completa del CMS sin requerir un servidor backend en ejecución, se necesita un contrato de interfaces TypeScript formal y un adaptador mock determinista, persistente en el navegador (`localStorage` / `IndexedDB`), capaz de simular latencia y códigos de error HTTP.

---

## 2. Requerimientos funcionales

| ID | Requerimiento | Prioridad |
|---|---|---|
| RF-01 | Implementar `AuthApiPort` con persistencia de credenciales y tokens simulados en almacenamiento local. | Alta |
| RF-02 | Implementar `SitesApiPort` permitiendo listar, crear y borrar sitios asociados al usuario. | Alta |
| RF-03 | Implementar `ModulesApiPort` con catálogo inicial de aplicaciones (E-commerce, Contacto, Blog, SEO). | Alta |
| RF-04 | Simulación configurable de latencia de red (rango 200–500 ms) para verificar estados de carga. | Media |
| RF-05 | Simulación determinista de errores HTTP (401 Unauthorized, 409 Conflict, 500 Network/Server Error). | Alta |

---

## 3. Criterios de aceptación (CA)

- [ ] **CA-01:** El adaptador mock implementa el 100 % de los métodos de `AuthApiPort`, `SitesApiPort` y `ModulesApiPort`.
- [ ] **CA-02:** Los datos guardados persisten tras recargar la página (verificado contra `localStorage`).
- [ ] **CA-03:** Las llamadas asíncronas respetan el retardo configurado de red simulada.
- [ ] **CA-04:** Las pruebas unitarias de contrato validan la estructura estricta de todos los DTOs.
