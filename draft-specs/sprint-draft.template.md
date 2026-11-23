# Borrador de Planificación — Sprint S## (CMS ShopMaker)

> **Documento de trabajo preparatorio:** Esta plantilla estandarizada consolida los objetivos, la rotación de roles, la arquitectura desacoplada, la matriz de tareas y las directrices multiplataforma para el Sprint S##.
> Debe completarse durante el refinamiento previo para que el equipo pueda iniciar el *Sprint Planning* sin fricciones.

---

## 1. Rotación de Roles Scrum para el Sprint S##

Conforme al marco de gobernanza definido en `docs/scrum/team.md` y `scripts/scrum/rotate-roles.sh`, los roles rotan de forma circular para garantizar la corresponsabilidad en el equipo, **manteniendo inmutable el rol de Administrador de Gobernanza**:

| Rol Scrum | Titular Sprint Anterior | **Titular Sprint S##** | Responsabilidad en S## |
|---|---|---|---|
| **Product Owner (PO)** | <Usuario Anterior> | **<Usuario Nuevo>** | Lidera el *QUÉ*: prioriza el Backlog, valida historias de usuario y acepta el incremento. |
| **Scrum Master (SM)** | <Usuario Anterior> | **<Usuario Nuevo>** | Facilita el *CÓMO*: organiza y modera el Sprint Planning, vela por el tablero y elimina impedimentos. |
| **Developer Core / CI** | Francisco Tomás (`@FSolaje`) | **Francisco Tomás (`@FSolaje`)** | Trabajo técnico enfocado a desarrollo, arnés, integración y contratos. |
| **Administrador de Gobernanza** | Francisco Tomás (`@FSolaje`) | **Francisco Tomás (`@FSolaje`)** | *Inmutable*: Custodia de `.agent/`, `.github/`, hooks y protección de ramas. |

### Comando de activación de roles al inicio de S##:
```bash
bash scripts/scrum/rotate-roles.sh --sprint S## --po <UsuarioPO> --sm <UsuarioSM> --gov-admin FSolaje
```

---

## 2. Sprint Goal Propuesto (S##)

> **«<Frase clara, concisa y medible que defina el objetivo de negocio e incremento funcional que el equipo entregará al finalizar el Sprint S##.>»**

---

## 3. Reparto de Trabajo Independiente (Workstreams Paralelos)

Para garantizar que los desarrolladores trabajen **sin bloqueos mutuos** durante todo el Sprint, la arquitectura se divide en frentes desacoplados mediante el patrón de **Puertos y Adaptadores**:

```text
┌────────────────────────────────────────────────────────────────────────┐
│                        SPRINT S## — WORKSTREAMS                        │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
       ┌────────────────────────────┼────────────────────────────┐
       ▼                            ▼                            ▼
 [Workstream 1]               [Workstream 2]               [Workstream 3]
  Dev A: @FSolaje             Dev B: <Usuario>             Dev C: <Usuario>
  PBI-### (<Área>)            PBI-### (<Área>)             PBI-### (<Área>)
  • Entregable 1              • Entregable 1               • Entregable 1
  • Entregable 2              • Entregable 2               • Entregable 2
```

---

## 4. Tabla Oficial de PBIs del Sprint S##

| ID | Título | Estimación Total | Responsable | Prioridad | Dependencias | Rama de Trabajo |
|---|---|---|---|---|---|---|
| `PBI-###` | <Título descriptivo del PBI> | ## h | Dev <A/B/C> (`@usuario`) | Alta / Media | <Contratos/ADRs> | `feature/PBI-###-<slug>` |

---

## 5. Matriz Atómica de Tareas del Sprint S##

> **Regla de atomicidad obligatoria:** Ninguna tarea puede superar las **8 horas**. Si un desarrollo requiere más tiempo, debe dividirse en subtareas atómicas antes de generar las issues.

| Clave | PBI | Tipo | Título de la Tarea | Resp. | Est. | Depende de | Criterios de Aceptación / Entregable | Pruebas Previstas |
|---|---|---|---|---|---|---|---|---|
| `PBI-###-T01` | `PBI-###` | `Spec` | Redactar spec funcional y plan técnico | Dev A | 4 h | — | `specs/PBI-###-<slug>/` redactada y aprobada por el PO. | N/A |
| `PBI-###-T02` | `PBI-###` | `Test` | Test rojo: <comportamiento inicial> | Dev A | 4 h | `T01` | Test que falla antes de implementar el código. | `[PBI-###][CA-01] test-name` |
| `PBI-###-T03` | `PBI-###` | `Código`| Implementar <funcionalidad mínima> | Dev A | 6 h | `T02` | Código mínimo para poner el test en verde. | `[PBI-###][CA-01] test-name` |
| `PBI-###-T04` | `PBI-###` | `Docs` | Documentación y guía de integración | Dev A | 2 h | `T03` | Documentación actualizada en README/specs. | N/A |

*Tipos válidos:* `Spec`, `Test`, `Código`, `Refactor`, `Docs`, `Chore`.

---

## 6. Archivos JSON Estructurados para Automatización

Junto a este borrador, deben mantenerse sincronizados los dos archivos de datos estructurados:
1. `scripts/github/sprint-s##-pbis.json`: Array con ID, título, prioridad, estimación, responsable, cuerpo Markdown y sprint.
2. `scripts/github/sprint-s##-tasks.json`: Array con clave `T##`, PBI asociado, tipo, título, responsable (`A`/`B`/`C`), estimación, dependencias, descripción, criterios de aceptación y pruebas.

---

## 7. Directriz Multiplataforma para Creación de Issues (Windows vs Linux)

Dado que los miembros del equipo utilizan distintos sistemas operativos (**Linux** y **Windows**), queda terminantemente **prohibido concatenar texto multilínea directamente en el flag `--body "..."`** de la CLI `gh`, ya que en Windows `cmd.exe` los saltos de línea (`\n`) rompen la instrucción y descartan los argumentos subsiguientes (`--assignee`, `--milestone`, `--label`).

### 7.1. Protocolo de Autodetección de Entorno
Todo script o asistente que interactúe con la creación/edición de issues en GitHub debe seguir el siguiente flujo de autodetección:

```mermaid
flowchart TD
    A[Inicio de Automatización de Issues] --> B{¿Detección automática de SO/Consola?}
    B -- Windows detectado<br/>(process.platform=='win32' / $IsWindows / OS=='Windows_NT') --> C[Modo Windows Seguro]
    B -- Linux/macOS detectado<br/>(process.platform=='linux' / $OSTYPE / uname=='Linux') --> D[Modo Linux / POSIX]
    B -- Detección Ambigua / Desconocida --> E[Preguntar al usuario interactivo:<br/>'¿Estás ejecutando en Windows o Linux? [W/L]']
    E -- Responde Windows --> C
    E -- Responde Linux --> D
    C --> F[1. Escribir body en archivo temporal .md<br/>2. Usar gh issue create --body-file=temp.md<br/>3. O usar gh api con JSON serializado]
    D --> G[1. Usar gh issue create --body-file=temp.md<br/>o heredoc limpio cat <<'EOF'<br/>2. O usar gh api con JSON serializado]
    F --> H[Bucle de Verificación y Asignación<br/>Verify & Assert]
    G --> H
```

### 7.2. Implementación Técnica según el SO Detectado

#### En Windows (`win32` / PowerShell / cmd.exe):
1. **Nunca** pasar texto con saltos de línea directo en `--body "..."`.
2. **Método A (Recomendado - Archivo Temporal):**
   ```bash
   # Escribir cuerpo en archivo temporal UTF-8
   printf '%s\n' "$BODY_CONTENT" > "$TEMP_DIR/issue_body.md"
   gh issue create --repo "$REPO" --title "$TITLE" --body-file "$TEMP_DIR/issue_body.md" \
     --assignee "$ASSIGNEE" --milestone "$MILESTONE" --label "$LABELS"
   rm "$TEMP_DIR/issue_body.md"
   ```
3. **Método B (Node.js / Scripting Multiplataforma):**
   Escribir el cuerpo con `fs.writeFileSync(tempPath, body)` y llamar a `gh` con `--body-file`, o usar `gh api repos/:owner/:repo/issues --input payload.json`.

#### En Linux / macOS (`linux` / `darwin` / Bash POSIX):
1. Se puede utilizar `--body-file` (método universal preferido) o un heredoc seguro:
   ```bash
   gh issue create --repo "$REPO" --title "$TITLE" \
     --body "$(cat <<'EOF'
   ## Contexto
   Texto con saltos de línea seguro en Linux.
   EOF
   )" --assignee "$ASSIGNEE" --milestone "$MILESTONE" --label "$LABELS"
   ```

#### Si la autodetección falla o es ambigua:
El script debe detenerse y solicitar confirmación expresa:
```text
⚠️  [Autodetección SO] No se pudo determinar el entorno con certeza.
¿En qué sistema operativo estás ejecutando?
  [1] Windows (PowerShell / cmd.exe / Git Bash montado)
  [2] Linux / macOS (Nativo / WSL / Contenedor)
Selecciona [1/2]:
```

---

## 8. Bucle de Verificación Obligatorio (*Verify & Assert*)

Inmediatamente después de ejecutar la creación de cada issue, el script debe auditar los metadatos creados:

```bash
gh issue view "$ISSUE_NUMBER" --repo "$REPO" --json assignees,labels,milestone
```

**Condiciones de Aceptación:**
- `assignees` **no** puede estar vacío (`length > 0`).
- `milestone` **debe** coincidir con `S##`.
- `labels` **debe** contener al menos `type:pbi` o `type:task`, más `sprint:S##` y `pbi:###`.

Si alguna aserción falla, el script debe **abortar y notificar el fallo** en lugar de reportar éxito falso.

---

## 9. Checklist de Cierre del Sprint Planning (Definition of Ready del Tablero)

Antes de autorizar el inicio del desarrollo:

- [ ] **1. Roles rotados:** `docs/scrum/active_roles.env` y `.github/CODEOWNERS` actualizados.
- [ ] **2. Milestone activo:** Creado en GitHub con fecha de entrega límite.
- [ ] **3. PBIs creados:** Cada PBI tiene su responsable, etiquetas `type:pbi`, `sprint:S##` y prioridad.
- [ ] **4. Tareas atómicas creadas y asignadas:** Cada tarea técnica tiene su desarrollador asignado, tipo (`type:task` + subtipo), PBI (`pbi:###`) y milestone.
- [ ] **5. Trazabilidad en PBI:** El PBI padre contiene en su cuerpo la lista interactiva (`- [ ] #XX`) enlazando todas sus tareas hijas.
- [ ] **6. Tablero GitHub Projects:** Tarjetas ubicadas en la columna *Sprint Backlog* con estimación y responsable visibles.
