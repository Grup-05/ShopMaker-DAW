---
trigger: always_on
---

# Marco de Gobernanza Global y Directrices del Agente (AGENTS.md)

Este documento define la **Constitución de Gobernanza Global**, los estándares de control de versiones Git, las directrices de seguridad (SAS), las reglas de commits y los parámetros operativos obligatorios para los agentes de Inteligencia Artificial y los desarrolladores en este proyecto.

Este marco reside canónicamente en `.agent/rules/AGENTS.md`, permitiendo modularidad, desacoplamiento y compatibilidad transversal entre ramas y entornos de desarrollo.

---

## 1. Arquitectura de Gobernanza y Modelo de Ramas

Para garantizar la estabilidad operativa del repositorio sin restar agilidad a las distintas tareas técnicas, este proyecto adopta un modelo de gobernanza desacoplado:

### 1.1. Núcleo Inmutable de Gobernanza (`main` como Autoridad Única)
1. **Componentes del Núcleo:**
   - `.agent/hooks/` (Scripts de automatización, hooks de Git y puertas de calidad).
   - `.agent/rules/AGENTS.md` (Este documento constitucional).
   - `.github/workflows/` (Flujos transversales de CI/CD y publicación automatizada de releases).
   - `.gitattributes` (Reglas de empaquetado limpio `export-ignore` para excluir activos de gobernanza en los ZIP de releases).
   - **Excepción explícita:** `.agent/hooks/pre-commit-local.sh` es un hook local del proyecto, no forma parte del núcleo protegido y puede crearse o modificarse en ramas secundarias. No puede sustituir, desactivar ni debilitar los hooks universales.
2. **Regla de Inmutabilidad:** Queda terminantemente prohibido modificar los archivos del núcleo de gobernanza en ramas secundarias (`dev/*`, `feature/*`, `fix/*`, `ra<XX>/*`, etc.). Cualquier cambio, ajuste o evolución del marco global debe nacer, validarse y confirmarse exclusivamente en la rama `main`.
3. **Mandato de Propagación Obligatoria desde `main`:**
   - Toda modificación o evolución del núcleo de gobernanza consolidada en `main` **debe propagarse obligatoriamente a todas las ramas activas del repositorio** antes de proseguir con tareas técnicas en ellas.
   - Para garantizar paridad estricta y evitar que el hook de `pre-commit` bloquee confirmaciones en ramas secundarias, la propagación debe realizarse mediante el proceso estático automatizado:
     ```bash
     bash .agent/hooks/sync-governance.sh
     ```
   - El script `sync-governance.sh` ejecuta de forma determinista y desatendida la sincronización en cada rama local, generando los commits atómicos correspondientes.
4. **Sincronización Manual Puntual:** En caso de requerir sincronización individual en una rama específica:
   ```bash
   git restore --source=main -- .agent/hooks/ .agent/rules/AGENTS.md .github/workflows/ .gitattributes
   ```
5. **Blindaje Estático:** El hook de `pre-commit` bloquea a nivel estático cualquier intento de confirmación en ramas distintas de `main` que presente diferencias respecto al núcleo oficial. La única excepción es `.agent/hooks/pre-commit-local.sh`, que se valida y ejecuta como extensión local.
6. **Rol de Administrador de Gobernanza y Bypass Estrictamente Acotado:**
   - Se reconoce el rol de Administrador de Gobernanza (declarado en `docs/scrum/active_roles.env` y `docs/scrum/team.md`).
   - En ramas secundarias o de trabajo, el Administrador de Gobernanza podrá confirmar cambios que evolucionen el núcleo de gobernanza SIEMPRE Y CUANDO:
     1. El commit afecte **única y exclusivamente** a activos de gobernanza y proceso (`.agent/`, `.github/`, `.gitattributes`, `docs/scrum/`, `docs/decisiones/`, `PROXIMOS_PASOS.md`, `scripts/`).
     2. Queda terminantemente vetado mezclar activos de gobernanza con código fuente de la aplicación (`src/`, `package.json`, etc.) bajo pena de anulación automática del bypass.
     3. El commit siga Conventional Commits bajo los tipos `chore(governance)`, `fix(hooks)` o `docs(...)`.
     4. La verificación SAST de seguridad (cero secretos, credenciales o rutas privadas) se mantiene obligatoria e inviolable.
     5. Una vez consolidado el trabajo, los cambios deben integrarse en `main` y propagarse al resto de ramas activas mediante `sync-governance.sh`.
     6. **Prohibición Terminante de Bypass en PRs de Desarrollo de Producto:** La potestad del Administrador de Gobernanza **jamás** habilita para auto-aprobar, forzar el merge (`--admin`) ni desactivar temporalmente las protecciones de rama en GitHub (`enforce_admins`) sobre Pull Requests de funcionalidades o correcciones del producto (`feature/*`, `fix/*`). Todo PR de producto debe someterse obligatoriamente a la revisión y aprobación de otro miembro del equipo (`CODEOWNERS`).

### 1.2. Activos Modulares y Flexibles por Proyecto o Rama
- **Reglas Contextuales (`.agent/rules/*.md`):** Cada proyecto o rama extiende este marco incorporando especificaciones técnicas particulares (diseño visual, arquitectura de datos, topologías de red, endpoints, etc.).
- **`.gitignore` Específico:** Cada proyecto añade a la base universal las exclusiones propias de su stack tecnológico (Python, Node.js, Docker, Rust, Java, etc.).
- **Habilidades del Agente (`.agent/skills/`):** Habilidades operativas especializadas que amplían la capacidad del asistente en tareas concretas.

---

## 2. Regla Mandatoria: Conventional Commits v1.0.0

Todos los commits realizados en este repositorio deben seguir **estrictamente** la especificación de [Conventional Commits v1.0.0](https://www.conventionalcommits.org/):

### Formato Obligatorio
```text
<tipo>(<ámbito>): <descripción concisa en imperativo>

[cuerpo opcional detallando el motivo y contexto del cambio]

[pie opcional con notas de rotura o referencias a issues/tareas]
```

### Tipos Permitidos
- **`feat`**: Nueva funcionalidad, servicio o característica orientada al usuario o producto.
- **`fix`**: Corrección de un fallo, bug, error de lógica, configuración o ruta.
- **`docs`**: Cambios exclusivos en documentación técnica, especificaciones, manuales de usuario o `README.md`.
- **`refactor`**: Refactorización o reorganización de código que no altera funcionalidad ni corrige errores.
- **`test`**: Creación o ajuste de pruebas automatizadas, suites unitarias o bancos de verificación.
- **`chore`**: Tareas auxiliares de mantenimiento, dependencias, actualización de `.gitignore` o setup del repositorio.
- **`style`**: Formateo de código, indentación o ajuste visual sin impacto en la lógica o semántica.

### Ámbitos Sugeridos (`scope`)
- **Gobernanza y Repositorio:** `global`, `agent`, `rules`, `hooks`, `security`, `repo`, `ci`, `deps`, `spec`.
- **Versionado y Catálogo:** `release`, `catalog`, `adr`.
- **Específicos del Proyecto:** Ámbitos adaptados a los módulos o arquitectura del proyecto definidos en sus reglas de perfil.

### 2.1. Prohibición Terminante de Commits Híbridos y Atomicidad Estricta
- **Prohibición de Mezcla `fix` + `feat`:** Queda terminantemente vetado agrupar en un mismo commit tipos dispares, en especial correcciones de errores (`fix`) con nuevas características (`feat`). Todo bugfix debe aislarse en su propio commit.
- **Prohibición de Mezcla con Documentación Pública:** Queda estrictamente prohibido empaquetar código funcional o configuraciones (`feat`, `fix`) con manuales de usuario, documentación pública o especificaciones (`docs`).
- **Ciclo Atómico Estándar por Fase:**
  1. `docs(spec): ...`: Diseño de especificación, plan técnico y desglose de tareas (previo al desarrollo).
  2. `feat(...)` o `fix(...)`: Implementación de la lógica funcional o corrección.
  3. `test(...)`: Batería de pruebas unitarias o de integración asociadas.
  4. `docs(...)`: Actualización de documentación de usuario, changelog y manuales públicos.

---

## 3. Navegación Git y Estrategia de Ramas

1. **Comandos Git Modernos Obligatorios (`git switch` y `git restore`):**
   - Queda obsoleto y prohibido el uso del comando sobrecargado `git checkout`.
   - Para cambiar o crear ramas se usará exclusivamente `git switch` (ej. `git switch <rama>` o `git switch -c <nueva-rama>`).
   - Para descartar cambios o gestionar el área de preparación se usará exclusivamente `git restore` (ej. `git restore <archivo>` o `git restore --staged <archivo>`).
2. **`main` como Rama Estricta de Producción y `develop` como Rama de Desarrollo:**
   - **`main` (Producción):** Es exclusivamente la **rama de producción**. Queda **terminantemente prohibido** que `main` contenga código a medias, funcionalidades en desarrollo, especificaciones de PBIs sin implementar (`specs/PBI-*`) o integraciones parciales a mitad de Sprint. En `main` solo residen entregas cerradas de producción y el núcleo de gobernanza global.
   - **`develop` (Integración de Desarrollo):** Todo el desarrollo de los Sprints (especificaciones de PBIs, código fuente, pruebas, refactorizaciones y tareas técnicas desde ramas `feature/*`, `fix/*` o `chore/*`) se integra **única y exclusivamente en `develop`**.
   - **Decisión de Paso a Producción al Cierre del Sprint:** Mientras el Sprint está en curso, se trabaja e integra en `develop`. Solo cuando finaliza el Sprint (con el Incremento completo, verificado en verde y aceptado en la *Sprint Review*), el Product Owner y el equipo deciden si se fusiona `develop` (o `release/vX.Y.Z`) hacia `main` (producción).
3. **Preservación de Histórico e Integridad:**
   - Queda prohibido el uso de `git rebase` destructivo o `git push --force` sobre ramas compartidas o sobre `main`.
   - Cada entrega debe preservar un historial limpio, atómico y verificable.
4. **Sincronización Previa Obligatoria con `develop` antes de Push y Pull Request:**
   - Antes de publicar una rama de trabajo (`feature/*`, `fix/*`, `dev/*`) o abrir/actualizar un Pull Request hacia `develop`, el desarrollador debe obligatoriamente integrar el último estado de `develop` en su rama (`git fetch origin develop && git merge origin/develop`), resolver localmente cualquier conflicto y verificar que la suite completa de pruebas pase en verde.

---

## 4. Automatización de Calidad y Git Hooks (`pre-commit` y `pre-push`)

El repositorio incorpora hooks de Git nativos y versionados en `.agent/hooks/`, activados mediante `git config core.hooksPath .agent/hooks`:

### 4.1. Hook de Pre-commit (`.agent/hooks/pre-commit`)
Se ejecuta de forma automática e imperativa antes de cada commit:
1. **Live Tracking y Telemetría Git:** Si existe `PROXIMOS_PASOS.md`, actualiza de forma automática la rama activa, el último commit y la fecha/hora de sincronización, incorporándolo al staging (`git add PROXIMOS_PASOS.md`).
2. **Blindaje de Inmutabilidad del Núcleo y Protección de `main` como Producción:**
   - En ramas secundarias, aborta el commit si se detectan diferencias no autorizadas respecto a `main` en `.agent/hooks/` o `.agent/rules/AGENTS.md`. Se exceptúa `.agent/hooks/pre-commit-local.sh`, que es el hook local del proyecto.
   - En la rama `main`, bloquea cualquier intento de confirmar o fusionar archivos de desarrollo de producto o PBIs en curso (`src/`, `specs/PBI-*`, etc.) salvo que se trate de un paso a producción formalmente especificado y autorizado (`PRODUCTION_RELEASE_APPROVED=true`).
3. **Escáner SAST de Seguridad en Staging:**
   - Bloquea cualquier archivo procedente del directorio confidencial `user_data/`.
   - Detecta y aborta ante marcadores de conflicto Git sin resolver (`<<<<<<<`, `=======`, `>>>>>>>`).
   - Inspecciona exclusivamente las líneas añadidas (`+`) en `git diff --cached`:
     - Claves privadas (`BEGIN RSA/OPENSSH/DSA/EC/PGP PRIVATE KEY`).
     - Tokens conocidos de API (GitHub PAT, AWS keys, Stripe, OpenAI, Anthropic, Discord webhooks, JWT).
     - Rutas absolutas locales privadas (`/home/<usuario>/`, `/Users/<usuario>/`, `C:\Users\<usuario>\`).
     - Ruta dinámica `$HOME` de la estación de trabajo actual.
     - Patrones confidenciales locales cargados desde `user_data/security/forbidden_patterns.txt` (ignorado en Git).
4. **Hook Chaining Local (Opcional):** Si existe `.agent/hooks/pre-commit-local.sh`, lo ejecuta para comprobaciones específicas del proyecto (linters, compiladores, tests).

### 4.2. Hook de Pre-push (`.agent/hooks/pre-push`)
Se ejecuta de forma automática antes de enviar cambios al repositorio remoto:
1. **Blindaje de `main` como Rama Estricta de Producción:** Bloquea cualquier `git push` hacia `main` que incorpore código de producto, pruebas o especificaciones de PBIs (`src/`, `specs/PBI-*`, etc.) a menos que cuente con especificación de merge a producción y autorización explícita (`PRODUCTION_RELEASE_APPROVED=true`). Permite únicamente la sincronización de activos puros del núcleo de gobernanza.
2. **Validación de Convención de Nombres de Ramas:** Comprueba que la rama a publicar cumpla las convenciones establecidas para el proyecto, auditando la jerarquía de subdirectorios para prevenir colisiones internas en Git.
3. **Verificación de Ancestro con `develop`:** En ramas de trabajo (`feature/*`, `fix/*`, `dev/*`), comprueba que `origin/develop` sea ancestro del commit a publicar (`git merge-base --is-ancestor`). Si `develop` ha avanzado, aborta el push exigiendo hacer `git merge origin/develop` y validar la suite antes de publicar.

### 4.3. Scripts y Herramientas del Núcleo de Gobernanza
- **Instalación y Activación de Hooks:**
  ```bash
  bash .agent/hooks/install-hooks.sh
  ```
- **Propagación Estática entre Ramas:**
  ```bash
  bash .agent/hooks/sync-governance.sh [--dry-run]
  ```
- **Publicación y Automatización de Releases:**
  ```bash
  bash .agent/hooks/publish-release.sh <VERSION> "<DESCRIPCION>" [--update-main-catalog]
  ```

---

## 5. Versionado Semántico (SemVer), Tags y Releases

El repositorio adopta la especificación [Semantic Versioning 2.0.0](https://semver.org/lang/es/) en conjunción con Conventional Commits y las directrices de publicación en GitHub:

### 5.1. Formato de Versión e Identificador de Proyecto en el Tag
```text
<id-proyecto>-v<MAJOR>.<MINOR>.<PATCH>[-<PRERELEASE>]
```
*(En repositorios mononúcleo de un único aplicativo se admite `v<MAJOR>.<MINOR>.<PATCH>[-<PRERELEASE>]`, siendo **obligatorio el prefijo `<id-proyecto>-` en repositorios multirrama/multiproyecto** para evitar colisiones de tags en Git y distinguir las entregas en GitHub Releases).*

- **`<id-proyecto>`:** Identificador corto o slug del proyecto/práctica (ej. `buscadorPeliculas-v1.0.0`, `ra02-films-v1.0.0`). Si se ejecuta desde una rama jerárquica (`ra<XX>/<proyecto>/...`), `publish-release.sh` lo detecta e incorpora automáticamente.
- El bloque SemVer **`v<MAJOR>.<MINOR>.<PATCH>`** es obligatorio en todos los tags (ej. `buscadorPeliculas-v1.0.0`, `buscadorPeliculas-v0.1.0-alpha.1`).
- **`MAJOR` (X.0.0):** Cambios que rompen la compatibilidad hacia atrás (*Breaking Changes*).
- **`MINOR` (X.Y.0):** Nuevas funcionalidades compatibles hacia atrás (*Features*).
- **`PATCH` (X.Y.Z):** Correcciones de errores o bugs compatibles hacia atrás (*Fixes*).
- **`<PRERELEASE>` (`-alpha.N`, `-beta.N`, `-rc.N`):** Versiones preliminares de prueba y validación.

### 5.2. Tags Anotados, Estándar de Contenido de Releases y `CHANGELOG.md`
1. **Tags Anotados Obligatorios:** Queda terminantemente prohibido el uso de tags ligeros (*lightweight*). Siempre se utilizarán tags anotados con identificador de proyecto cuyo asunto (*subject*) siga el formato oficial del título de la release y cuyo cuerpo incluya las notas de la versión:
   ```bash
   git tag -a <id-proyecto>-v1.0.0 -m "<Nombre Proyecto/Aplicación> v1.0.0" -m "<Descripción y notas de la versión>"
   ```
2. **Título Obligatorio de la Release:**
   Toda release publicada (tanto en el asunto del tag anotado como en el título de la GitHub Release) debe seguir estrictamente el formato:
   ```text
   <Nombre del Proyecto o Aplicación> <VERSIÓN>
   ```
   *(Ejemplo: Tag `buscadorPeliculas-v1.0.0` → Título `Buscador Web de Películas (Films) v1.0.0`).*
3. **Estructura Obligatoria de la Descripción (Cuerpo de la Release y `CHANGELOG.md`):**
   Queda prohibido publicar releases que contengan únicamente el enlace automático al *Full Changelog*. Toda release debe incluir obligatoriamente:
   - **Resumen Ejecutivo de la Versión:**
     - **Si es la primera versión del aplicativo (ej. `v1.0.0` inicial o primera entrega):** Una descripción clara que explique qué hace el aplicativo, su propósito funcional y sus capacidades principales.
     - **Si es una versión posterior o evolutiva:** Una descripción concisa de qué cambia de una versión a otra (principales novedades, mejoras arquitectónicas o correcciones introducidas respecto a la versión previa).
   - **Desglose Categorizado (`CHANGELOG.md`):** Listado estructurado de cambios bajo el formato [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/) (`Added`, `Fixed`, `Changed`, `Security`, `Documentation`).
   - **Enlace al Historial Completo (*Full Changelog*):** Conservado al pie de la publicación en GitHub.
4. **Empaquetado Limpio del Archivo ZIP de la Release (`.gitattributes` y Artefactos):**
   - El archivo comprimido (`.zip` / `.tar.gz`) asociado a toda release debe incluir **únicamente los archivos y directorios imprescindibles para el funcionamiento y despliegue del sitio o aplicación**.
   - Queda terminantemente prohibido incluir en el paquete de la release activos de gobernanza interna, hooks o metadatos de seguimiento (`.agent/`, `.agents`, `.github/`, `PROXIMOS_PASOS.md`, `plantillas/`, `specs/`, `.gitignore`, `.gitattributes`, `.vscode/`).
   - Esta exclusión se aplica de forma automática en dos niveles:
     1. Mediante directivas `export-ignore` en `.gitattributes` (que limpian automáticamente los paquetes `Source code (zip/tar.gz)` generados por GitHub y `git archive`).
     2. Mediante la generación de un paquete distribuible limpio `<id-proyecto>-<VERSION>.zip` adjuntado como activo directo en el flujo `.github/workflows/release.yml`.

### 5.3. Checklist Mandatario Pre-Tag / Pre-Release (Aprobación Humana Obligatoria)
Antes de proponer o crear un tag formal de versión, se verificará obligatoriamente:
1. `[CHECK 1 - Build / Lint / Tests]:` Compilación o validación técnica limpia según el stack del proyecto (linters, compiladores o suites de validación si aplica).
2. `[CHECK 2 - Verificación Técnica]:` Comprobación de que configuraciones, scripts y código no contienen errores sintácticos ni referencias rotas.
3. `[CHECK 3 - Escáner SAST de Seguridad]:` Salida limpia de los hooks sin credenciales, tokens ni rutas privadas.
4. `[CHECK 4 - Sincronización de Estado y Metadatos]:` Actualización de `PROXIMOS_PASOS.md`, cierre ordenado de la versión en `CHANGELOG.md` (`[vX.Y.Z] - YYYY-MM-DD`) incluyendo el resumen ejecutivo y las categorías de cambios, y actualización de `README.md` (del proyecto y de `main` si existe catálogo).

### 5.4. Automatización de Releases (`publish-release.sh`)
Para garantizar consistencia y evitar discrepancias documentales, la publicación de un release se apoya en el script estático:
```bash
bash .agent/hooks/publish-release.sh <VERSION_O_TAG> "<DESCRIPCION_RESUMEN>" [--project-id "<ID_PROYECTO>"] [--app-name "<NOMBRE_APLICACION>"] [--update-main-catalog]
```
Este proceso realiza automáticamente:
1. **Determinación del Tag con Identificador y Título Oficial:** Construye el tag `<id-proyecto>-vX.Y.Z` (autodetectando `<id-proyecto>` de la rama o vía `--project-id`) y el título `<Nombre Proyecto/Aplicación> vX.Y.Z` (mediante `--app-name` o extrayéndolo automáticamente de `README.md` / `package.json`).
2. **Actualización de `CHANGELOG.md`:** Convierte la sección `[Unreleased]` en la versión fechada `[<TAG>] - YYYY-MM-DD`, insertando al inicio el resumen ejecutivo (`<DESCRIPCION_RESUMEN>`) seguido del desglose categorizado, y abre un nuevo bloque `[Unreleased]` vacío.
3. **Actualización de `README.md` del Proyecto:** Actualiza el badge o etiqueta de versión (`**Versión de Entrega:** <VERSION>`).
4. **Actualización de `README.md` de `main` (si aplica catálogo):** En repositorios con catálogo central en `main`, actualiza la fila de entrega correspondiente con el nuevo tag y estado.
5. **Commit Atómico y Tag Anotado Enriquecido:** Genera el commit `docs(release): preparar version <TAG> y actualizar changelog/readme` y crea el tag anotado `<id-proyecto>-vX.Y.Z` con el título `<Nombre Proyecto/Aplicación> <VERSION>` y el cuerpo completo de notas de la versión para su publicación íntegra en GitHub Releases.

---

## 6. Gobernanza Git: Prohibición de Operaciones Autónomas

- **Prohibición Terminante de `git push` Autónomo:** Queda estrictamente prohibido que la IA ejecute `git push` sin autorización humana previa.
- **Prohibición de `git commit` Autónomo:** Queda **terminantemente prohibido ejecutar `git commit`** sin cumplir el siguiente protocolo:
  1. Presentar al usuario un resumen claro de los archivos modificados (`git status`, `git diff`).
  2. Ejecutar las validaciones locales pertinentes (linters, compilación o tests).
  3. Ejecutar la verificación de seguridad (confirmar que no existen credenciales, tokens ni datos privados).
  4. Mostrar el reporte de validación limpio.
  5. **Esperar la orden y aprobación humana explícita:** *"Procede con el commit"*.
- **Prohibición Terminante de Crear o Fusionar Pull Requests de Forma Autónoma y de Alterar Protecciones de Rama:**
  - Queda estrictamente prohibido que la IA cree un Pull Request (`gh pr create`) o ejecute su fusión (`gh pr merge`) sin haber presentado previamente el plan al usuario y recibido su autorización explícita.
  - Queda **terminantemente prohibido** que la IA o cualquier desarrollador invoque la API de GitHub para desactivar o relajar reglas de protección de ramas (`enforce_admins`, revisiones de `CODEOWNERS`) con el fin de fusionar PRs de desarrollo (`feature/*`, `fix/*`).
  - Al concluir el desarrollo de un PBI y abrir su PR hacia `develop`, el flujo obligatorio consiste en asignar como revisores a los compañeros de equipo, mover el PBI y sus tareas a la columna **"En revisión"** del tablero Scrum y esperar la aprobación por pares antes de cualquier merge.
- **Prohibición Terminante de Merge o Paso a `main` (Producción) sin Especificación y Orden Explícita:**
  - La rama `main` es exclusivamente una **rama de producción**; nunca puede recibir código a medias, ramas de funcionalidad en curso (`feature/*`) ni desarrollo a mitad de Sprint. Todo el desarrollo del Sprint se realiza y se fusiona en `develop`.
  - Queda **terminantemente prohibido fusionar (`git merge`, PR merge) o promover cambios de producto hacia `main`** sin cumplir obligatoriamente los siguientes pasos:
    1. **Fin de Sprint y Aceptación del Incremento:** Haber concluido el Sprint en `develop` (o preparado la rama `release/vX.Y.Z`) con la totalidad de la suite de pruebas en verde y la aceptación del Product Owner.
    2. **Especificación Formal del Merge hacia `main`:** Antes de ejecutar cualquier fusión hacia `main`, se debe especificar y presentar al usuario un informe detallado del merge que incluya:
       - Origen y destino del merge (ej. `develop -> main` o `release/vX.Y.Z -> main`).
       - Listado exacto de PBIs cerrados y commits que entran en producción.
       - Verificación de que **no existe ningún código ni especificación a mitad de desarrollo**.
       - Estado de las puertas de calidad (build, tests al 100 % en verde, SAST limpio y checklist pre-release).
    3. **Orden Humana Explícita de Paso a Producción:** Esperar la instrucción literal e inequívoca del usuario que autorice el envío a producción: **"Mandar a producción"** o **"Procede con el paso a producción"** (habilitando `PRODUCTION_RELEASE_APPROVED=true` únicamente para esa operación autorizada).

---

## 7. Constitución de Seguridad y Privacidad (SAS)

- **Cero Credenciales y Cero Secretos:**
  - Queda estrictamente prohibido incluir en archivos versionados contraseñas, tokens de API, hashes privados, claves SSH privadas (`id_rsa`, `id_ed25519`), certificados privados, cookies de sesión o cadenas de conexión a bases de datos con credenciales.
  - Queda prohibido incluir rutas absolutas privadas locales (ej. `/home/<usuario>`). Utilizar siempre rutas relativas o variables de entorno estándar.
  - **Políticas de Datos Simulados (Mock Data):** Toda la información de usuario, pruebas de acceso o correos en configuraciones y manuales debe ser ficticia e inventada (ej. `admin@example.org`, `postmaster@domain.local`).
- **Aislamiento Estricto de `user_data/`:**
  - El directorio `user_data/` (herramientas locales, cachés, perfiles o notas confidenciales) queda **SIEMPRE EXCLUIDO** mediante `.gitignore`.
  - Bajo ninguna circunstancia se eliminará `user_data/` del `.gitignore` ni se comitearán archivos de este directorio.
- **Requisito Obligatorio del Entorno Local `user_data/security/` y Perfiles de Acceso:**
  - Cada desarrollador activo debe disponer en su estación de trabajo local del directorio `user_data/security/` (permisos restrictivos `700` y `600` en archivos).
  - Este espacio es estrictamente privado y aloja:
    1. `forbidden_patterns.txt` (Obligatorio para desarrolladores): Rutas privadas locales (`$HOME/`) y patrones confidenciales de la máquina del desarrollador que el escáner SAST utiliza para bloquear fugas antes de cada commit. Se autogenera de forma transparente y sin fricción.
    2. `gh_token.txt` (Opcional por perfil): Token personal de GitHub para gestionar issues, PRs y tableros bajo la identidad del rol activo, sin almacenar credenciales en el repositorio.
  - **Perfiles de Acceso y Fricción Cero:**
    - *Cliente / Evaluador:* Solo clona y ejecuta (`npm run dev` / tests). No requiere instalar hooks ni configurar `user_data/security/`.
    - *Desarrollador Estándar:* Solo programa e integra código con Git habitual. `forbidden_patterns.txt` se autogenera; `gh_token.txt` es **completamente opcional** (no bloquea el trabajo).
    - *Administrador / Gestor Scrum:* Utiliza `gh_token.txt` con permisos de Projects/Issues para automatizar el tablero desde terminal.
  - **Detección, Asistencia y Explicación Automática:** Tanto el instalador de hooks (`install-hooks.sh`) como el hook de `pre-commit` detectan automáticamente si `user_data/security/` no está configurado, explican al desarrollador el motivo y guían interactivamente su configuración (asistida por `scripts/setup/init-user-security.sh`).

- **Arquitectura de Gobernanza Flexible en Tres Capas (Anti-Fricción y Anti-Fugas):**
  Para conciliar la inmutabilidad de la constitución global con la libertad de innovación y personalización en cada rama de desarrollo, se adopta un modelo desacoplado:
  1. *Capa 1 — Núcleo Global (Inmutable en ramas de trabajo):* Vive en `.agent/rules/` y `.agent/hooks/`. Define los mínimos comunes no negociables (SAST, Conventional Commits, no secrets). Solo se modifica en `main` y se propaga con `sync-governance.sh`.
  2. *Capa 2 — Gobernanza Contextual por PBI (Versionada y Mergeable):* Cada funcionalidad define sus directrices, criterios y arquitectura técnica en su propia carpeta `specs/PBI-###-<slug>/` (`spec.md`, `plan.md`, `tasks.md`). Forma parte del incremento, se somete a revisión y se integra limpiamente en `develop`.
  3. *Capa 3 — Overrides y Gobernanza Local del Desarrollador (Aislamiento Total anti-Merge):*
     - Si un desarrollador necesita reglas de IA particulares para su máquina, configuraciones efímeras o hooks locales, se alojan en `user_data/governance/`, `.agent/local/` o en `.agent/hooks/pre-commit-local.sh`.
     - Todos estos espacios están **estrictamente ignorados por `.gitignore`** y excluidos en los scripts de propagación y empaquetado.
     - **Garantía anti-Merge:** Al no ser rastreados por Git, es físicamente imposible que un override o regla particular de un desarrollador se cuele en un Pull Request hacia `develop` o `main`.
- **Gitignore Retroactivo:**
  - Si se modifica `.gitignore` para añadir nuevas exclusiones sobre archivos previamente versionados, la IA purgará la caché mediante `git rm -r --cached <ruta>` y re-indexará antes de presentar los cambios para evitar "Ghost Tracking".

---

## 8. Principios de Metodología y Lifecycle Rules del Agente

- **Think-Before-Act:** Antes de modificar código, configuración o documentación, la IA debe explicar brevemente qué va a realizar, su justificación y a qué objetivo sirve.
- **Read-Before-Edit:** Queda prohibido modificar o sobrescribir un archivo sin haber leído previamente su contenido completo en la sesión activa.
- **Petición de Contexto Obligatoria ("Cero configuraciones a ciegas"):** Cuando el usuario introduzca o solicite una configuración técnica, arquitectónica o parámetro de diseño sin explicar el motivo, el agente **debe preguntarle por la motivación y el contexto técnico** antes de documentarlo o implementarlo, registrando la justificación correspondiente.
- **Trazabilidad y Preservación de Decisiones:** Las decisiones arquitectónicas modificadas o superadas no se eliminan sin dejar rastro; se documentan marcándolas formalmente como sustituidas, registrando el motivo del cambio y la solución que las reemplaza.
- **Desacoplamiento Temprano de Requerimientos:** Si durante el desarrollo se descubre un fallo o bug ajeno a la tarea en curso, se desacoplará inmediatamente; el bugfix se abordará y comiteará en su propio ciclo (`fix(...)`) sin mezclarse con la rama o tarea activa.
- **Uncertainty Marker (`[NEEDS CLARIFICATION]`):** Si se detectan ambigüedades, vacíos de diseño o contradicciones técnicas, la IA se detendrá y lanzará un bloque `[NEEDS CLARIFICATION]` interrogando directamente al usuario, sin asumir ni inventar soluciones.

---

## 9. Continuidad de Sesión y Estado (Live Tracking)

1. **Al iniciar cualquier sesión:**
   - Comprobar automáticamente la existencia del archivo `PROXIMOS_PASOS.md` en el espacio de trabajo.
   - Leer su contenido para retomar el contexto exacto antes de realizar cualquier acción.
2. **Al finalizar un hito o sesión:**
   - Actualizar `PROXIMOS_PASOS.md` reflejando las tareas completadas, el estado del proyecto y los pasos inmediatos siguientes.
   - El hook de pre-commit actualizará automáticamente la telemetría Git asociada en el siguiente commit.

---

## 10. Mantenimiento Mandatorio de la Documentación Pública

Tras el desarrollo o integración de cada nueva característica o corrección:
1. **Actualización Obligatoria de `README.md`:** Reflejar cualquier cambio en capacidades principales, configuración o requisitos.
2. **Actualización Obligatoria de `CHANGELOG.md`:** Registrar los cambios bajo la sección `[Unreleased]` con las categorías correspondientes (`Added`, `Fixed`, `Changed`, `Security`, `Documentation`).
3. **Commit Atómico Independiente de Documentación (`docs:`):**
   - La documentación pública debe comitearse siempre de forma aislada e independiente en un commit posterior al del código funcional o corrección:
     ```bash
     docs: actualizar manual de usuario, readme y changelog
     ```
   - Queda terminantemente prohibido incluir modificaciones a la documentación pública dentro de commits de tipo `feat(...)` o `fix(...)`.

