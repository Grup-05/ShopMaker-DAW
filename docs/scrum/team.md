# Equipo y Roles — ShopMaker-DAW

> Documento vivo. Cualquier cambio de rol o responsabilidad se confirma con `docs(scrum): ...`.

## Composición del equipo

| Integrante | Usuario GitHub | Rol Scrum | Workstream de Desarrollo (S01) | Responsabilidad principal |
|---|---|---|---|---|
| Francisco Tomas | `@FSolaje` | Product Owner / Developer (Dev A) | Fundación y aplicación web (`PBI-001`) | Prioriza el Product Backlog, acepta el incremento y construye la base de la SPA |
| Jesús Hernández | `@Tarrant15` | Scrum Master / Developer (Dev B) | Sistema visual y accesibilidad (`PBI-002`) | Facilita ceremonias, elimina impedimentos, protege el marco e implementa tokens/temas |
| Fernando Ruescas | `@Fernis23228` | Developer (Dev C) | Arnés de pruebas y calidad (`PBI-004`) | Especifica, prueba e implementa el entorno de testing y el hook local |
| Javier Ibañez | — | Cliente / Stakeholder | — | Aporta feedback funcional en el Sprint Review |

En equipos académicos reducidos los roles pueden combinarse, pero las responsabilidades no se diluyen:

- El **Product Owner** es la única figura que prioriza y cambia el alcance del Sprint.
- El **Scrum Master** no asigna tareas técnicas ni actúa como jefe de proyecto.
- Los **Developers** son autoorganizados y responsables de la calidad técnica.
- El **Cliente** no modifica directamente el Sprint Backlog.

## Acuerdos de equipo

- Duración de Sprint: **2 semanas** (ajustable al calendario del taller, fija durante el Sprint).
- Daily Scrum: 15 minutos, mismo horario.
- Tablero: GitHub Projects o tabla Markdown con las columnas `Product Backlog` → `Sprint Backlog` → `En progreso` → `En revisión` → `Hecho`.
- Herramientas: Git + GitHub, Conventional Commits, hooks locales de gobernanza.
- Canal de comunicación y decisiones: issues y PR del repositorio.
- El agente de IA actúa como asistente técnico de los Developers y **nunca** commitea ni publica sin aprobación humana explícita.

## Separación de Poderes y Rotación Dinámica de Roles Scrum

Dado que todos los integrantes son administradores de `Grup-05` y rotarán entre los roles de **Product Owner**, **Scrum Master** y **Developer** a lo largo de los Sprints, la autoridad de decisión se formaliza dinámicamente:

### 1. Matriz de Autoridad y Decisión
- **Product Owner (PO):** Máxima autoridad sobre el valor y los requisitos. Es el único que puede alterar el Product Backlog, cambiar el alcance de un Sprint o aceptar el incremento en el Sprint Review.
- **Scrum Master (SM):** Máxima autoridad sobre el proceso y las definiciones (DoR, DoD). Vela por el cumplimiento de Scrum, elimina impedimentos y protege la dinámica del equipo.
- **Developers:** Máxima autoridad técnica. Estiman, diseñan la arquitectura, aplican SDD/TDD y revisan/aprueban técnicamente los Pull Requests de sus compañeros.
- **Administrador de Gobernanza:** Custodio de la integridad de los hooks, reglas del agente y workflows de CI (`.agent/`, `.github/`). Dispone de bypass controlado en ramas de trabajo únicamente para activos de gobernanza.

### 2. Activación Dinámica y CODEOWNERS
- El estado activo de cada rol en el Sprint en curso se declara en `docs/scrum/active_roles.env`.
- La política de aprobación obligatoria en GitHub se aplica mediante `.github/CODEOWNERS`, vinculando cada ruta al rol que tiene la toma de decisión:
  - Requisitos y Backlog (`/docs/scrum/product-backlog.md`, `/specs/`) → Aprobación obligatoria del **Product Owner**.
  - Proceso Scrum y Definiciones (`/docs/scrum/definition-*.md`, `/docs/scrum/sprints/`) → Aprobación obligatoria del **Scrum Master**.
  - Gobernanza y Hooks (`/.agent/`, `/.github/`, `/.gitattributes`) → Aprobación del **Administrador de Gobernanza**.
  - Código y Pruebas (`/src/`, `/tests/`, `/scripts/`) → Aprobación de los **Developers**.
- Para rotar roles al inicio de cada Sprint, basta con ejecutar:
  ```bash
  bash scripts/scrum/rotate-roles.sh --sprint S02 --po <usuario> --sm <usuario> --gov-admin <usuario>
  ```
  Esto actualiza `active_roles.env` y regenera `.github/CODEOWNERS` automáticamente.

## Onboarding y Entorno de Seguridad Obligatorio (`user_data/security/`)

Para garantizar que ningún desarrollador filtre accidentalmente rutas locales ni credenciales, y para posibilitar el uso de la CLI de GitHub bajo la identidad de cada miembro, **la carpeta `user_data/security/` es obligatoria en la estación de trabajo de cada integrante**.

### 1. ¿Por qué es obligatoria?
1. **Aislamiento SAS (Constitución `AGENTS.md` §7):** `user_data/` está rigurosamente ignorada en `.gitignore`. Ningún contenido ubicado aquí se versionará jamás en Git.
2. **Prevención de fugas de rutas privadas (`forbidden_patterns.txt`):** Cada máquina tiene rutas personales absolutas (`$HOME/`). El escáner SAST de `pre-commit` bloquea cualquier commit que contenga cadenas coincidentes con este archivo para evitar exponer nombres de usuario locales o rutas de disco en commits públicos.
3. **Autenticación personal multiusuario (`gh_token.txt`):** Cada rol que opera sobre issues, pull requests o tableros de GitHub utiliza su propio token con permisos UNIX `600`, impidiendo fugas o uso indebido de sesiones globales.

### 2. Detección y Configuración Guiada
Si un nuevo miembro clona el repositorio o cambia de equipo:
- Los hooks `install-hooks.sh` y `pre-commit` detectan automáticamente si falta `user_data/security/` y la crean con permisos restrictivos `700` y `600`.
- Para inicializar o verificar el entorno en cualquier momento:
  ```bash
  # Verificar estado:
  bash scripts/setup/init-user-security.sh --check

  # Inicializar estructura guiada:
  bash scripts/setup/init-user-security.sh --init
  ```
- Para registrar o actualizar el token personal de GitHub:
  ```bash
  bash scripts/github/gh-auth-env.sh --login
  ```

## Gobernanza de Tokens y Rotación de Roles (`gh` CLI)

Dado que todos los integrantes son administradores de `Grup-05` y rotarán entre los roles de **Product Owner**, **Scrum Master** y **Developer** a lo largo de los Sprints, cada miembro debe operar con su **propio token personal** para garantizar trazabilidad de autoría (issues, PRs, revisiones cruzadas y movimientos en el tablón) y cumplir la Constitución de Seguridad (`AGENTS.md` §7):

1. **Ubicación local aislada por estación de trabajo:**
   - Archivo: `user_data/security/gh_token.txt` (excluido por `.gitignore`, con permisos `600` forzados y protegido por el escáner SAST del hook `pre-commit`).
2. **Permisos requeridos al generar el token en GitHub:**
   - **Opción recomendada (Fine-grained PAT):**
     - *Resource owner:* `Grup-05`
     - *Repository access:* Only select repositories → `Grup-05/ShopMaker-DAW`
     - *Repository permissions:* `Actions` (Read & write), `Contents` (Read & write), `Issues` (Read & write), `Pull requests` (Read & write), `Metadata` (Read-only).
     - *Organization permissions:* `Projects` (**Read and write**).
   - **Opción alternativa (Classic PAT):**
     - Scopes: `repo`, `workflow`, `project`, `read:org`.
3. **Validación y carga automática:**
   - Ejecutar `bash scripts/github/gh-auth-env.sh --check` para verificar permisos (`600`), identidad (`@FSolaje`, `@Tarrant15` o `@Fernis23228`), acceso al repositorio y acceso al tablero de `Grup-05` sin exponer jamás el token en consola.
   - Para cargar el token en la sesión actual de terminal: `source scripts/github/gh-auth-env.sh`.
   - El script `scripts/github/setup-sprint-board.sh` lo carga automáticamente si existe.

## Enlaces

- [Definition of Ready](definition-of-ready.md)
- [Definition of Done](definition-of-done.md)
- [Product Backlog](product-backlog.md)
- [Metodología Scrum](../../.agent/rules/methodology-scrum.md)
- [Práctica TDD](../../.agent/rules/methodology-tdd.md)
- [Perfil frontend UI/UX](../../.agent/rules/profile-uiux.md)
