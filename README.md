# Nombre del proyecto

Breve descripción del proyecto y del problema que resuelve.

## Equipo y roles

| Integrante | Rol |
|---|---|
| Jesús Hernández | Scrum Master |
| Francisco Tomas | Product Owner |
| Fernando Ruescas | Developer |
| Javier Ibañez | Cliente |

## Definición de tarea terminada

**Por definir.**

Esta sección se completará cuando el equipo acuerde los criterios que debe cumplir una tarea para considerarse terminada.

## Convención de ramas: GitFlow

Usaremos **GitFlow** para organizar el trabajo y las versiones del proyecto.

### Ramas principales

- `main`: contiene las versiones estables y listas para producción. Cada versión publicada se identifica con una etiqueta, por ejemplo, `v1.0.0`.
- `develop`: rama de integración. Contiene los cambios preparados para la próxima versión.

### Ramas de trabajo

- `feature/<nombre>`: para desarrollar funcionalidades nuevas. Se crean desde `develop` y se integran de nuevo en `develop`.
  - Ejemplo: `feature/inicio-sesion`
- `release/<version>`: para preparar una versión. Se crean desde `develop`; aquí se realizan ajustes finales y correcciones. Al terminar, se integran en `main` y en `develop`.
  - Ejemplo: `release/1.0.0`
- `hotfix/<nombre>`: para corregir errores urgentes en producción. Se crean desde `main` y, al terminar, se integran en `main` y `develop`.
  - Ejemplo: `hotfix/error-autenticacion`

### Flujo habitual

1. Actualizar `develop`.
2. Crear una rama `feature/<nombre>` desde `develop`.
3. Realizar cambios y commits siguiendo la convención del proyecto.
4. Integrar la rama en `develop` mediante una solicitud de incorporación (*pull request*).
5. Cuando se prepare una versión, crear `release/<version>`.
6. Tras validar la versión, integrarla en `main` y `develop`, y etiquetar la versión en `main`.

## Convención de commits: Conventional Commits

Los mensajes de commit seguirán el formato:

```text
<tipo>[ámbito opcional]: <descripción>
