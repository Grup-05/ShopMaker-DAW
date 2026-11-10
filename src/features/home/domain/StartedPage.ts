/**
 * Página web iniciada por el usuario.
 *
 * El dominio se mantiene deliberadamente mínimo: solo identifica la página
 * y su etiqueta visible. Las reglas del CMS llegarán en PBIs posteriores.
 */
export interface StartedPage {
  readonly id: string;
  readonly name: string;
}
