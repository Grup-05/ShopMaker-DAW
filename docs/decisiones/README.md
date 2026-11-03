# Decisiones Arquitectónicas (ADR)

Este directorio registra las decisiones arquitectónicas relevantes del frontend de ShopMaker.

## Cuándo crear un ADR

- Elección de stack, formato de entrega o shell de escritorio.
- Estrategia de estado, routing o composición de módulos.
- Contrato de API y política de errores.
- Estrategia de previsualización y sandbox.
- Cualquier decisión que afecte a varias features o sea difícil de revertir.

## Formato

```text
ADR-###-<slug>.md
```

Cada ADR incluye: contexto, decisión, alternativas consideradas, consecuencias y estado (`Propuesto`, `Aceptado`, `Sustituido`).

## Regla de trazabilidad

Una decisión sustituida **no se elimina**: se marca como `Sustituido por ADR-###` y se documenta el motivo del cambio.

## Índice

| ADR | Título | Estado | Fecha |
|---|---|---|---|
| ADR-001 | React y TypeScript como stack del frontend | Aceptado | 2026-11-03 |
| ADR-002 | Aplicación web en navegador como formato de entrega | Aceptado | 2026-11-03 |
