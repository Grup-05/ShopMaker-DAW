const HTML_ESCAPE_MAP: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};

const DANGEROUS_TAG_PAIRS =
  /<\s*(script|iframe|object|embed|style|link|meta|base|form|svg)\b[^>]*>[\s\S]*?<\s*\/\s*\1\s*>/gi;

const DANGEROUS_SELF_CLOSING_TAGS =
  /<\s*(script|iframe|object|embed|style|link|meta|base|form|svg)\b[^>]*\/?>/gi;

const EVENT_HANDLER_DOUBLE = /\s+on[a-z0-9_-]+\s*=\s*"[^"]*"/gi;
const EVENT_HANDLER_SINGLE = /\s+on[a-z0-9_-]+\s*=\s*'[^']*'/gi;
const EVENT_HANDLER_UNQUOTED = /\s+on[a-z0-9_-]+\s*=\s*[^\s>]+/gi;

const UNSAFE_ATTR_URI =
  /(\s(?:href|src|xlink:href|formaction)\s*=\s*)(["'])\s*(?:javascript|vbscript|data\s*:\s*text\/html):[^"']*\2/gi;

/**
 * Escapa caracteres especiales HTML para texto plano seguro.
 */
export function escapeHtml(input: string): string {
  return input.replace(/[&<>"']/g, (char) => HTML_ESCAPE_MAP[char] ?? char);
}

/**
 * Valida y sanitiza URLs permitiendo únicamente http(s) y rutas relativas seguras.
 */
export function sanitizeUrl(rawUrl: string): string {
  const trimmed = rawUrl.trim();
  if (!trimmed) {
    return '';
  }

  const normalized = [...trimmed]
    .filter((char) => char.charCodeAt(0) > 32)
    .join('')
    .toLowerCase();
  if (
    normalized.startsWith('javascript:') ||
    normalized.startsWith('vbscript:') ||
    normalized.startsWith('data:')
  ) {
    return '';
  }

  if (
    normalized.startsWith('https://') ||
    normalized.startsWith('http://') ||
    trimmed.startsWith('/') ||
    trimmed.startsWith('./')
  ) {
    return trimmed;
  }

  return '';
}

/**
 * Elimina etiquetas ejecutables, manejadores de eventos inline y esquemas peligrosos.
 */
export function sanitizeHtml(rawHtml: string): string {
  if (!rawHtml) {
    return '';
  }

  return rawHtml
    .replace(DANGEROUS_TAG_PAIRS, '')
    .replace(DANGEROUS_SELF_CLOSING_TAGS, '')
    .replace(EVENT_HANDLER_DOUBLE, '')
    .replace(EVENT_HANDLER_SINGLE, '')
    .replace(EVENT_HANDLER_UNQUOTED, '')
    .replace(UNSAFE_ATTR_URI, '$1$2#$2')
    .trim();
}
