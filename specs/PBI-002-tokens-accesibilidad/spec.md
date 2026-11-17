# Spec — PBI-002 Definir tokens de diseño, tema claro/oscuro y accesibilidad base

> Especificación SDD (Specification Driven Development) para la base de diseño, tokens semánticos y alternancia de temas del CMS ShopMaker.

## Metadatos

| Campo | Valor |
|---|---|
| PBI | `PBI-002` |
| Sprint | `S01` (Sprint 0: Fundaciones) |
| Autor | Fernando Ruescas (`@Fernis23228`, Dev C) |
| Fecha | 2026-11-12 |
| Estado | Borrador — Pendiente de aprobación humana |
| Rama | `feature/PBI-002-tokens-accesibilidad` |

---

## 1. Contexto y problema

El CMS ShopMaker necesita una base visual sólida, coherente y accesible que permita construir la interfaz de usuario de manera estandarizada y sin fatiga visual. 

En la entrega inicial de `PBI-001`, se estructuró el scaffold de la aplicación web y se incluyó un archivo de estilos provisional (`global.css`) con variables preliminares y un botón «Cambiar tema» inerte en la navegación superior. Sin embargo, no existe una arquitectura formal de tokens de diseño, no se garantiza el cumplimiento normativo de contraste WCAG 2.1 AA, y no existe la lógica para alternar ni persistir temas entre sesiones.

Este PBI define formalmente los tokens primitivos y semánticos, implementa el soporte completo para tema claro y tema oscuro mediante el atributo `data-theme`, añade la detección de `prefers-color-scheme` y persistencia en `localStorage`, y valida el cumplimiento estricto de accesibilidad visual y contraste.

---

## 2. Historias de usuario y flujos

### Historia principal

**Como** usuario del CMS ShopMaker,  
**quiero** disponer de una interfaz legible, estandarizada y adaptable a tema claro y tema oscuro,  
**para** utilizar el CMS sin fatiga visual, en cualquier condición de iluminación y con soporte garantizado de contraste y accesibilidad.

### Flujo principal (Alternancia y Persistencia)

1. El usuario accede a la aplicación web.
2. El sistema comprueba si existe una preferencia de tema almacenada en `localStorage` (clave `shopmaker-theme`).
3. Si existe, aplica inmediatamente el tema guardado (`light` o `dark`) inyectando el atributo `data-theme` en el elemento raíz `<html>`.
4. Si no existe preferencia almacenada, el sistema consulta la preferencia del sistema operativo mediante la media query `(prefers-color-scheme: dark)`. Si es positiva, aplica `dark`; en caso contrario, aplica `light`.
5. El usuario pulsa el botón «Cambiar tema» situado en la barra de navegación superior (o lo activa mediante teclado con `Enter` o `Espacio`).
6. La aplicación alterna instantáneamente entre `light` y `dark`, actualiza las propiedades CSS semánticas en cascada, actualiza los atributos de accesibilidad del botón (`aria-label`) y guarda la nueva preferencia en `localStorage`.

### Flujos alternativos y de error

- **`localStorage` no disponible o bloqueado:** Si el almacenamiento local está restringido por políticas de privacidad o modo incógnito estricto, la aplicación no lanza excepciones y continúa funcionando en memoria durante la sesión respetando `prefers-color-scheme`.
- **Preferencia corrupta o no reconocida:** Si el valor en `localStorage` no es ni `'light'` ni `'dark'`, se descarta y se restablece la detección automática del sistema.

---

## 3. Requerimientos funcionales

| ID | Requerimiento | Prioridad |
|---|---|---|
| RF-01 | La aplicación debe definir una arquitectura de tokens de diseño en dos niveles (tokens primitivos y tokens semánticos) que cubra colores, superficies, tipografías, espaciados y radios. | Alta |
| RF-02 | El sistema debe implementar soporte para tema claro (`light`) y tema oscuro (`dark`), aplicados dinámicamente mediante el atributo `data-theme` en el elemento `<html>`. | Alta |
| RF-03 | La preferencia de tema seleccionada por el usuario debe persistirse de forma no sensible en `localStorage` (clave `shopmaker-theme`). | Alta |
| RF-04 | En ausencia de selección explícita del usuario, la aplicación debe sincronizarse automáticamente con la preferencia del sistema operativo mediante `(prefers-color-scheme: dark)`. | Alta |
| RF-05 | El botón «Cambiar tema» presente en la navegación debe conectarse al servicio/hook de tema para ejecutar la conmutación y reflejar de forma accesible su estado (`aria-label="Cambiar a tema oscuro"` / `"Cambiar a tema claro"`). | Alta |

---

## 4. Requerimientos no funcionales

| ID | Categoría | Requerimiento |
|---|---|---|
| RNF-01 | Accesibilidad | Cumplimiento estricto de WCAG 2.1 Nivel AA: contraste de texto normal ≥ 4.5:1, texto grande ≥ 3:1 y elementos interactivos/controles ≥ 3:1 frente a superficies adyacentes tanto en tema claro como oscuro. |
| RNF-02 | Accesibilidad | No transmitir información ni estados funcionales de forma exclusiva mediante color (uso complementario de texto, bordes o iconos). |
| RNF-03 | Accesibilidad | Indicador de foco visible (`outline`) de al menos 3px con contraste ≥ 3:1 frente a fondos adyacentes en todos los controles interactivos. |
| RNF-04 | Rendimiento y UX | Prevención de parpadeo de contenido no estilizado (FOUC) al cargar la página con tema oscuro. Transición suave o instantánea sin bloqueo del hilo principal. |
| RNF-05 | Seguridad | Cero datos sensibles o tokens de autenticación en la gestión de estilos y persistencia de temas; validación estricta de valores permitidos (`light` o `dark`). |
| RNF-06 | Compatibilidad | Funcionamiento idéntico en resoluciones 1280×800 y viewport mínimo 1024×720; compatibilidad con zoom del navegador al 200 % sin truncamiento ni scroll horizontal. |

---

## 5. Criterios de aceptación

| ID | Criterio (Dado / Cuando / Entonces) | RF / RNF asociado |
|---|---|---|
| CA-01 | **Dado** cualquier elemento de texto o control interactivo en tema claro o tema oscuro, **cuando** se calcula el ratio de contraste entre su color y el fondo adyacente, **entonces** el ratio es ≥ 4.5:1 para texto normal y ≥ 3:1 para controles y bordes interactivos. | RF-01, RNF-01 |
| CA-02 | **Dado** cualquier componente o layout del CMS, **cuando** se inspecciona su código CSS, **entonces** todos los valores de color, espaciado, radio y tipografía consumen tokens semánticos (`var(--color-*)`, etc.), sin colores hexadecimales o RGB fijos. | RF-01, RNF-02 |
| CA-03 | **Dado** un usuario que pulsa el botón «Cambiar tema», **cuando** el tema conmuta entre claro y oscuro, **entonces** la interfaz cambia inmediatamente su paleta, se actualiza el atributo `data-theme` y la preferencia se almacena en `localStorage`. Al recargar la página, se mantiene el tema seleccionado. | RF-02, RF-03, RF-05 |
| CA-04 | **Dado** un nuevo usuario sin preferencia previa guardada, **cuando** abre la aplicación con el sistema operativo en modo oscuro, **entonces** la aplicación arranca automáticamente en tema oscuro; si el sistema está en modo claro, arranca en tema claro. | RF-04, RNF-04 |
| CA-05 | **Dado** el botón «Cambiar tema» y los controles interactivos, **cuando** se navega usando el teclado (`Tab`), **entonces** el anillo de foco es claramente visible (outline ≥ 3px) y cumple ratio de contraste ≥ 3:1. | RNF-01, RNF-03 |

---

## 6. Estados de interfaz

| Estado | Comportamiento esperado |
|---|---|
| **Tema Claro (`light`)** | Superficies claras (`--color-surface: #ffffff`), fondo general neutro (`--color-bg: #f5f7fa`), texto de alto contraste (`--color-text: #1f2933`). |
| **Tema Oscuro (`dark`)** | Superficies oscuras (`--color-surface: #1e293b`), fondo general oscuro (`--color-bg: #0f172a`), texto claro de alto contraste (`--color-text: #f8fafc`). |
| **Foco Activo** | Contorno de foco visible `--color-focus` de 3px con `outline-offset: 2px` en cualquier interactivo enfocado por teclado. |
| **Persistencia Inaccesible** | Modo degradado transparente: la aplicación conmuta el tema en memoria sin emitir errores de consola si `localStorage` está bloqueado. |

---

## 7. Contrato de API y dependencias

- **Frontend puro:** No depende de endpoints de backend ni bases de datos.
- **APIs del Navegador:** `window.matchMedia('(prefers-color-scheme: dark)')`, `window.localStorage`, `document.documentElement.setAttribute('data-theme', ...)`.

---

## 8. Fuera de alcance (en Sprint S01)

- Paletas personalizadas o temas arbitrarios definidos por el usuario (solo se contempla claro y oscuro).
- Modos de alto contraste forzado específicos (se cubre mediante el cumplimiento estándar de WCAG AA).
- Componentes complejos del editor de páginas o catálogo de módulos (corresponden a PBIs futuros).
- Tareas `T06`, `T07`, `T08` de PBI-002 (pospuestas a Sprint S02 según [sprint-backlog.md](file:///c:/Users/ferna/Videos/PI_EQUIPO/ShopMaker-DAW/docs/scrum/sprints/S01/sprint-backlog.md)).

---

## 9. Riesgos y supuestos

| Riesgo / supuesto | Impacto | Mitigación |
|---|---|---|
| Parpadeo visual (FOUC) al recargar en modo oscuro | Medio | Inyectar el tema directamente en el script de arranque o en la inicialización inmediata del documento antes del primer pintado. |
| Inconsistencias de contraste en bordes de botones | Bajo | Pruebas unitarias automatizadas que evalúan contrastes con algoritmo WCAG 2.1 formal. |
| Dispersión de variables CSS no estandarizadas | Medio | Documentar el catálogo cerrado de tokens en `specs/visual-design-specs.md` y verificar en tests la ausencia de colores literales. |

---

## 10. Referencias

- Product Backlog: `docs/scrum/product-backlog.md` (`PBI-002`)
- Sprint Backlog: `docs/scrum/sprints/S01/sprint-backlog.md`
- Perfil UI/UX: `.agent/rules/profile-uiux.md`
- Guía WCAG 2.1 AA (W3C Web Content Accessibility Guidelines)
