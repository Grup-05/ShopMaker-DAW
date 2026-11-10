# Checklist de accesibilidad — PBI-001

> Revisión manual de RNF-01 y RNF-04. Fecha: 2026-11-09. Navegadores: Chromium y Firefox.

## RNF-01 — Foco visible y contraste

- [x] El primer enlace de la navegación recibe foco con teclado y muestra un contorno visible de `3px` (`outline: 3px solid #b91c1c`).
- [x] El recorrido por teclado alcanza en orden los enlaces de acceso, el botón de tema, el botón de crear página y los controles de selección/maquetación.
- [x] Activar una página con `Enter` la selecciona y actualiza `aria-pressed`.
- [x] Los botones de crear y maquetar reciben foco y pueden activarse sin ejecutar acciones.
- [x] Contraste de texto del cuerpo: `13,75:1`.
- [x] Contraste de enlaces de navegación: `6,7:1`.
- [x] Contraste del botón primario: `6,7:1`.
- [x] No hay enlace ni página de contactos.

## RNF-04 — Zoom al 200 %

- [x] Con un viewport CSS equivalente al 200 % de `1024×720` (`512×360`), no aparece scroll horizontal.
- [x] El heading «ShopMaker», la navegación, el `main` y el aside siguen visibles y accesibles.
- [ ] Revisión humana final con el zoom nativo del navegador antes del cierre del PBI.

## Observaciones

- La comprobación de zoom se realizó con un proxy de viewport; no sustituye una revisión manual con el control de zoom del navegador.
- El botón «Cambiar tema» no cambia el tema en PBI-001; su comportamiento y anuncio de estado pertenecen a PBI-002.
