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

## Enlaces

- [Definition of Ready](definition-of-ready.md)
- [Definition of Done](definition-of-done.md)
- [Product Backlog](product-backlog.md)
- [Metodología Scrum](../../.agent/rules/methodology-scrum.md)
- [Práctica TDD](../../.agent/rules/methodology-tdd.md)
- [Perfil frontend UI/UX](../../.agent/rules/profile-uiux.md)
