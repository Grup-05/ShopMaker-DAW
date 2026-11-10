/**
 * Convierte un texto en un slug URL-friendly normalizado.
 *
 * Elimina diacríticos (tildes), sustituye espacios y caracteres no alfanuméricos
 * por guiones y pasa el resultado a minúsculas.
 *
 * @param text - Texto original a convertir.
 * @returns Cadena convertida en slug en minúsculas.
 */
export function slugify(text: string): string {
  return text
    .normalize('NFD') // Descompone caracteres con acento
    .replace(/[\u0300-\u036f]/g, '') // Elimina diacríticos
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-') // Sustituye no alfanuméricos por un guion
    .replace(/^-+|-+$/g, ''); // Elimina guiones iniciales o finales
}
