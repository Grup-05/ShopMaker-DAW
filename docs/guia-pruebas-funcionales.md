# Guía de pruebas funcionales (como cliente) — ShopMaker-DAW

> **Documento vivo.** Cada Pull Request de funcionalidad hacia `develop` **debe actualizar esta guía** dentro de la propia PR ([ADR-013](decisiones/ADR-013-guia-viva-pruebas-funcionales.md)). Quien revise una PR la usa para probar el cambio antes de aprobar.

Estado de la guía en `develop`:

| Sección | PBI | Estado en `develop` |
|---|---|---|
| [1. Portada y tema](#1-portada-y-tema-pbi-001-pbi-002) | `PBI-001`, `PBI-002` | ✅ Disponible |
| [2. Cuentas y sesión](#2-cuentas-y-sesión-pbi-005) | `PBI-005` | ✅ Disponible |
| [3. Panel «Mis Sitios Web» y catálogo](#3-panel-mis-sitios-web-y-catálogo-pbi-006) | `PBI-006` | ✅ Disponible |
| [4. Previsualización aislada y publicación](#4-previsualización-aislada-y-publicación-pbi-009) | `PBI-009` | ✅ Disponible |
| [5. Editor visual por bloques](#5-editor-visual-por-bloques-pbi-008) | `PBI-008` | ✅ Disponible en PR `#83` |
| 6. Módulos por manifiesto y compra simulada | `PBI-007` | ⏳ Pendiente |

---

## 0. Preparación

```bash
git clone https://github.com/Grup-05/ShopMaker-DAW.git   # o actualiza tu copia: git switch develop && git pull
cd ShopMaker-DAW
npm install            # en unidades exFAT/NTFS: npm install --no-bin-links
npm run dev            # abre la URL que muestre Vite (normalmente http://localhost:5173)
```

- **Requisito:** Node ≥ 22.19.0.
- **Para probar la rama de una PR:** `git fetch origin && git switch <rama-de-la-PR>` y repite `npm install` si cambió `package-lock.json`.
- **Cuenta demo:** `demo@shopmaker.local` · `DemoPassword2026!`
- **Datos de prueba:** son ficticios y viven en `localStorage` (clave `shopmaker.mock.state.v1`). Para empezar de cero, en la consola del navegador (`F12` → *Console*):

  ```js
  localStorage.clear(); location.reload();
  ```

- **Calidad automática** (opcional): `npm test` (Vitest), `npm run test:e2e` (Playwright), `npm run typecheck`, `npm run lint`, `npm run build`.

---

## 1. Portada y tema (`PBI-001`, `PBI-002`)

1. Abre `/`. Verás el título **ShopMaker**, la navegación con **Iniciar sesión** y **Registrarse**, y el botón **Cambiar tema**.
2. En el aside izquierdo aparece **Ninguna Web en Progreso** y en el centro **Seleccione una web para visualizar**.
3. Pulsa **Cambiar tema**: la interfaz alterna entre claro y oscuro. Recarga la página (`F5`): el tema elegido se conserva.
4. **Teclado:** con `Tab` recorre enlaces y botones; el foco debe verse siempre.
5. **Ventana:** reduce el ancho hasta 1024 px; no debe aparecer scroll horizontal.

> Los botones **Crear página** y de maquetación están habilitados pero **no ejecutan acciones** (previstos para PBIs futuros).

---

## 2. Cuentas y sesión (`PBI-005`)

1. **Registro** (`/register`): rellena nombre, correo, contraseña y confirmación; escribe una contraseña y observa el medidor (**Débil → Media → Fuerte**). Acepta los términos y pulsa **Crear cuenta**. Entras en `/dashboard`.
2. **Correo duplicado:** intenta registrar `demo@shopmaker.local` → mensaje «Ya existe una cuenta registrada con este correo electrónico.»
3. **Inicio de sesión** (`/login`): con la cuenta demo entras en `/dashboard`. Con una contraseña incorrecta aparece «Las credenciales introducidas no son válidas.» y se conserva el correo escrito.
4. **Recuperar contraseña** (`/recover`): página informativa (el formulario real no está en este incremento).
5. **Rutas protegidas:** sin sesión, abre `/dashboard` → te redirige a `/login?redirect=%2Fdashboard`. Con sesión iniciada, abrir `/login` o `/register` te lleva a `/dashboard`.
6. **Cerrar sesión:** menú de usuario → **Cerrar sesión**; vuelves a la portada.

---

## 3. Panel «Mis Sitios Web» y catálogo (`PBI-006`)

1. Con sesión iniciada, en `/dashboard` el menú lateral muestra **Mis Sitios**, **Catálogo de Módulos** y **Configuración**.
2. **Mis Sitios Web:** verás **Tienda Demo Artesanal** (`tienda-demo-artesanal.shopmaker.local`) con la insignia **Borrador** y el botón **Editar**.
3. **Crear sitio:** pulsa **Crear Nueva Web**; escribe un nombre (por ejemplo, `Mi Panadería`) y el campo **Subdominio simulado** se rellena solo con `mi-panaderia.shopmaker.local` mientras no lo edites a mano; elige categoría y pulsa **Crear sitio**. Prueba `Escape` para cerrar el modal y comprueba que con `Tab` el foco no sale del diálogo.
4. **Catálogo de Módulos:** usa el buscador («Buscar módulos por nombre o descripción…») y los filtros de categoría (indican su estado con `aria-pressed`).

> ⚠️ **Limitación actual:** el botón **Instalar** del catálogo todavía **no está conectado** a ninguna acción (la compra/activación por sitio llega con `PBI-007`). Para probar el editor con módulos instalados antes de `PBI-007`, ver el truco de la sección 5 (cuando se fusione `PBI-008`).

---

## 4. Previsualización aislada y publicación (`PBI-009`)

1. En **Mis Sitios Web**, pulsa **Previsualizar** en una tarjeta. Se abre un diálogo con el sitio dentro de un `iframe` aislado.
2. Pulsa **Móvil (360px)**, **Tablet (768px)** y **Escritorio (1280px)**: el ancho del marco cambia y el botón activo queda marcado. Mientras el sitio no tenga bloques, verás una sección de bienvenida («Bienvenido a …»).
3. Cierra con `Escape` o **Cerrar**.
4. **Publicar:** pulsa **Publicar Web** (en la tarjeta o dentro del visor). La insignia pasa de **Borrador** a **Publicado** y el botón desaparece; recarga la página y el estado se conserva.
5. **Seguridad:** el visor usa `sandbox=""`; no debe ejecutarse ningún script del contenido del sitio.

---

## 5. Editor visual por bloques (`PBI-008`)

1. En **Mis Sitios Web**, pulsa el botón **Editar** en cualquier tarjeta de sitio. Se abre la ruta protegida `/editor/:siteId` con la barra superior (`Editor: <nombre del sitio>`) y 3 columnas: **Paleta de bloques**, **Lienzo de bloques** e **Inspector de propiedades**.
2. **Añadir bloques estructurales:** en la paleta izquierda pulsa **+ Hero / Portada**, **+ Bloque de Texto**, **+ Características** o **+ Pie de Página**. Cada bloque aparece inmediatamente en el lienzo central y queda seleccionado.
3. **Reordenar, duplicar y eliminar con confirmación:**
   - Usa **↑ Subir** y **↓ Bajar** en la barra de acciones del bloque para cambiar el orden (puedes hacerlo también navegando con `Tab` y `Enter`).
   - Pulsa **Duplicar** para clonar el bloque justo debajo con el sufijo `(copia)`.
   - Pulsa **Eliminar** sobre un bloque con texto: aparece la barra de alerta con **Confirmar eliminación** y **Cancelar** antes de borrarlo.
4. **Editar en tiempo real (Inspector de propiedades):** selecciona un bloque en el lienzo y edita en el panel derecho **Título del bloque**, **Subtítulo secundario**, **Contenido del bloque** o **Texto del botón CTA**. El lienzo se actualiza al instante.
5. **Autoguardado y recuperación:**
   - Comprueba en la barra superior el indicador accesible **Borrador guardado automáticamente**.
   - **Recarga la página (`F5`)** o pulsa **← Volver al Dashboard** y vuelve a entrar en **Editar**: todos tus bloques y textos se recuperan intactos desde `localStorage`.
6. **Previsualización desde el editor:** pulsa **Previsualizar Web** arriba a la derecha para abrir el visor aislado `<iframe sandbox="">` con tus bloques actuales y alternar entre **Móvil (360px)**, **Tablet (768px)** y **Escritorio (1280px)**.
7. *(Opcional — probar bloques de módulos instalados antes de `PBI-007`):* hasta que `PBI-007` conecte el botón «Instalar» del catálogo, puedes simular un módulo instalado en `site-demo-01` ejecutando en la consola (`F12`):
   ```js
   const s = JSON.parse(localStorage.getItem('shopmaker.mock.state.v1'));
   s.installedModulesBySite['site-demo-01'] = ['mod-ecommerce-cart'];
   localStorage.setItem('shopmaker.mock.state.v1', JSON.stringify(s));
   location.reload();
   ```
   Al recargar `/editor/site-demo-01`, verás **+ Carrito E-commerce** bajo **Módulos instalados** en la paleta izquierda y podrás añadirlo al lienzo.

---

## Cómo añadir tu sección en una PR

1. Crea (o amplía) una sección `## N. <Título> (`PBI-###`)` con: pasos numerados, textos exactos de botones **copiados del código**, resultado esperado y limitaciones conocidas.
2. Actualiza la tabla de estado del principio de este documento.
3. Si tu PBI no cambia nada visible para el cliente, escribe en su sección: «Sin cambios visibles para el cliente» y el motivo.
4. Enlaza la sección desde la casilla correspondiente de la plantilla de PR.
