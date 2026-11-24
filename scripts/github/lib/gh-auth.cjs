/* eslint-disable @typescript-eslint/no-require-imports */
/* global require, module, __dirname, process, console, fetch */
/**
 * =============================================================================
 * Cargador Multiplataforma de Autenticación GitHub (scripts/github/lib/gh-auth.cjs)
 * =============================================================================
 * Homólogo en Node.js de scripts/github/gh-auth-env.sh para compatibilidad
 * nativa en Windows (PowerShell / CMD / Git Bash), macOS y Linux.
 *
 * Funcionalidades:
 *   1. Resuelve GH_TOKEN desde entorno (GH_TOKEN / GITHUB_TOKEN) o lee
 *      automáticamente user_data/security/gh_token.txt.
 *   2. Inyecta GH_TOKEN en process.env y amplía PATH con rutas habituales de
 *      GitHub CLI en Windows y Linux.
 *   3. Expone helpers REST y GraphQL nativos (fetch) para no depender de 'jq'
 *      ni requerir obligatoriamente el binario 'gh' en operaciones API.
 * =============================================================================
 */

const fs = require('fs');
const path = require('path');
const os = require('os');
const { execSync } = require('child_process');

const REPO_ROOT = path.resolve(__dirname, '../../..');
const TOKEN_FILE = path.join(REPO_ROOT, 'user_data', 'security', 'gh_token.txt');

/**
 * Carga y valida el token desde variables de entorno o user_data/security/gh_token.txt
 * @param {{ quiet?: boolean }} [options]
 * @returns {string}
 */
function loadGhToken(options = {}) {
  const quiet = Boolean(options.quiet);

  let token = (process.env.GH_TOKEN || process.env.GITHUB_TOKEN || '').trim();

  if (!token && fs.existsSync(TOKEN_FILE)) {
    const raw = fs.readFileSync(TOKEN_FILE, 'utf8');
    const lines = raw
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line.length > 0 && !line.startsWith('#'));

    if (lines.length > 0) {
      token = lines[0].replace(/\s+/g, '');
    }

    // En sistemas POSIX (Linux/macOS), asegurar permisos 600 como gh-auth-env.sh
    if (process.platform !== 'win32') {
      try {
        fs.chmodSync(path.dirname(TOKEN_FILE), 0o700);
        fs.chmodSync(TOKEN_FILE, 0o600);
      } catch {
        // Ignorar si el sistema de archivos no soporta chmod (ej. exFAT/NTFS montado)
      }
    }
  }

  if (!token) {
    if (!quiet) {
      console.error('❌ [Auth Gobernanza] No se encontró GH_TOKEN en el entorno ni en user_data/security/gh_token.txt.');
      console.error('   Configura tu token personal en user_data/security/gh_token.txt (permisos 600).');
    }
    throw new Error('GH_TOKEN no disponible');
  }

  return token;
}

/**
 * Prepara process.env con GH_TOKEN y rutas multiplataforma (Windows/Linux/macOS) para 'gh'
 * @returns {NodeJS.ProcessEnv}
 */
function ensureGhAuthEnv() {
  const token = loadGhToken();
  process.env.GH_TOKEN = token;

  const extraPaths = [];
  if (process.platform === 'win32') {
    extraPaths.push(
      'C:\\Program Files\\GitHub CLI',
      'C:\\Program Files (x86)\\GitHub CLI',
      path.join(os.homedir(), 'AppData', 'Local', 'Programs', 'GitHub CLI'),
      path.join(os.homedir(), 'scoop', 'shims')
    );
  } else {
    extraPaths.push(
      path.join(os.homedir(), '.local', 'bin'),
      '/usr/local/bin'
    );
  }

  const currentPath = process.env.PATH || '';
  const pathSep = path.delimiter;
  const mergedPaths = [...extraPaths, ...currentPath.split(pathSep)].filter(Boolean);
  process.env.PATH = Array.from(new Set(mergedPaths)).join(pathSep);

  return process.env;
}

/**
 * Ejecuta un comando de GitHub CLI ('gh ...') inyectando el entorno autenticado
 * @param {string} cmd
 * @param {{ input?: string, quiet?: boolean }} [options]
 * @returns {string}
 */
function runGhCli(cmd, options = {}) {
  const env = ensureGhAuthEnv();
  if (!options.quiet) {
    console.log(`> ${cmd}`);
  }
  return execSync(cmd, {
    encoding: 'utf8',
    env,
    input: options.input,
    stdio: options.input !== undefined ? ['pipe', 'pipe', 'pipe'] : ['ignore', 'pipe', 'pipe'],
  });
}

/**
 * Petición REST directa a la API de GitHub mediante fetch nativo de Node.js (100 % multiplataforma sin requerir 'gh' ni 'jq')
 * @param {string} method
 * @param {string} endpoint - Ej: '/repos/Grup-05/ShopMaker-DAW/issues/36' o 'repos/...'
 * @param {object} [payload]
 * @returns {Promise<any>}
 */
async function ghApiRest(method, endpoint, payload) {
  const token = loadGhToken();
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = `https://api.github.com${cleanEndpoint}`;

  const response = await fetch(url, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'Content-Type': 'application/json',
      'User-Agent': 'ShopMaker-DAW-Governance-Node',
    },
    body: payload !== undefined ? JSON.stringify(payload) : undefined,
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`GitHub REST Error (${response.status} ${method} ${cleanEndpoint}): ${errText}`);
  }

  if (response.status === 204) {
    return null;
  }
  return response.json();
}

/**
 * Consulta o mutación GraphQL directa a la API de GitHub mediante fetch nativo de Node.js
 * @param {string} query
 * @param {object} [variables]
 * @returns {Promise<any>}
 */
async function ghGraphql(query, variables = {}) {
  const token = loadGhToken();
  const response = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: {
      Authorization: `bearer ${token}`,
      'Content-Type': 'application/json',
      'User-Agent': 'ShopMaker-DAW-Governance-Node',
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`GitHub GraphQL HTTP Error (${response.status}): ${errText}`);
  }

  const body = await response.json();
  if (body.errors && body.errors.length > 0) {
    throw new Error(`GitHub GraphQL Error: ${JSON.stringify(body.errors)}`);
  }
  return body.data;
}

module.exports = {
  REPO_ROOT,
  TOKEN_FILE,
  loadGhToken,
  ensureGhAuthEnv,
  runGhCli,
  ghApiRest,
  ghGraphql,
};
