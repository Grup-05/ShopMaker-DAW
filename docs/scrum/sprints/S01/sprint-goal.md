# Sprint Goal — S01 (Sprint 0: Fundaciones)

## Identificación

| Campo | Valor |
|---|---|
| Sprint | S01 — Sprint 0 de fundaciones |
| Fechas | Pendiente de confirmar por el equipo |
| Duración | 2 semanas (orientativa) |
| Scrum Master | Jesús Hernández |
| Product Owner | Francisco Tomas |

## Sprint Goal

> Dejar preparado un entorno de desarrollo verificable —shell de escritorio, sistema visual accesible, contrato de API con mock y arnés de pruebas— para que el primer PBI funcional del CMS pueda construirse con SDD y TDD sin bloqueos técnicos.

## Preguntas que responde el Planning

- **¿Qué?** PBI-001 a PBI-004, orientados a fundaciones técnicas y de gobernanza.
- **¿Cómo?** Decisiones de stack documentadas, tokens y accesibilidad base, contrato de API con adaptador mock y suite de pruebas ejecutable con hooks locales.

## PBIs comprometidos

| PBI | Título | Estimación | Estado inicial |
|---|---|---|---|
| PBI-001 | Inicializar el shell de escritorio y la estructura base | Pendiente | En Sprint |
| PBI-002 | Definir tokens de diseño, tema claro/oscuro y accesibilidad base | Pendiente | En Sprint |
| PBI-003 | Definir el contrato de API y el adaptador mock | Pendiente | En Sprint |
| PBI-004 | Configurar el arnés de pruebas y el hook local de calidad | Pendiente | En Sprint |

## Capacidad y riesgos

- Capacidad estimada del equipo: pendiente de confirmar en el Planning.
- Riesgo: elegir un shell de escritorio sin justificar → decisión documentada en ADR y validada por el equipo.
- Riesgo: acoplar la UI al backend antes de definir el contrato → adaptador mock obligatorio (PBI-003).
- Dependencia externa: disponibilidad del contrato de API del backend.

## Criterio de éxito

Al final del Sprint debe ser posible:

1. Arrancar el shell de escritorio en el sistema objetivo.
2. Ver una pantalla base con tokens y foco visible.
3. Ejecutar la suite de pruebas con un comando único y obtener verde.
4. Consumir datos simulados a través del adaptador mock.
5. Demostrar el flujo TDD con al menos un test rojo convertido en verde.

> Este Sprint 0 no entrega funcionalidad de negocio completa, pero sí un entorno listo para el primer incremento funcional.
