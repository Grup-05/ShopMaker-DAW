/* eslint-disable @typescript-eslint/no-require-imports */
/* global require, process, console */
/**
 * =============================================================================
 * Sincronizador Multiplataforma de Estado en Tablón Scrum (Project #1)
 * (scripts/github/sync-board-status.cjs)
 * =============================================================================
 * Mantiene sincronizados los dos campos de estado del Tablón GitHub Projects v2:
 *   - Campo personalizado "Estado Scrum": Product Backlog | Sprint Backlog |
 *                                         En progreso | En revisión | Hecho
 *   - Campo nativo "Status":              Todo | In Progress | Done
 *
 * Correspondencia garantizada:
 *   - Product Backlog / Sprint Backlog  <->  Todo
 *   - En progreso / En revisión         <->  In Progress
 *   - Hecho                             <->  Done
 *
 * Modos de uso:
 *   node scripts/github/sync-board-status.cjs --in-progress PBI-008
 *   node scripts/github/sync-board-status.cjs --in-progress --branch feature/PBI-008-editor-webs-borradores
 *   node scripts/github/sync-board-status.cjs --in-progress 61 62 79
 *   node scripts/github/sync-board-status.cjs --in-review --branch feature/PBI-008-editor-webs-borradores
 *   node scripts/github/sync-board-status.cjs --done 61 62
 *   node scripts/github/sync-board-status.cjs --reconcile-status
 *   (Añade --dry-run a cualquier comando para simular sin modificar GitHub)
 * =============================================================================
 */

const { execSync } = require('child_process');
const { ghGraphql } = require('./lib/gh-auth.cjs');

const OWNER = process.env.PROJECT_OWNER || process.env.OWNER || 'Grup-05';
const REPO = process.env.REPO_NAME || process.env.REPO || 'ShopMaker-DAW';
const PROJECT_NUMBER = Number(process.env.PROJECT_NUMBER || 1);

const SCRUM_TO_NATIVE_STATUS = {
  'Product Backlog': 'Todo',
  'Sprint Backlog': 'Todo',
  'En progreso': 'In Progress',
  'En revisión': 'In Progress',
  Hecho: 'Done',
};

const SCRUM_ORDER = {
  'Product Backlog': 0,
  'Sprint Backlog': 1,
  'En progreso': 2,
  'En revisión': 3,
  Hecho: 4,
};

function printHelp() {
  console.log(`Uso:
  node scripts/github/sync-board-status.cjs --in-progress [<PBI-###|#N|N>...] [--branch <rama>] [--dry-run]
  node scripts/github/sync-board-status.cjs --in-review   [<PBI-###|#N|N>...] [--branch <rama>] [--dry-run]
  node scripts/github/sync-board-status.cjs --done        [<PBI-###|#N|N>...] [--branch <rama>] [--dry-run]
  node scripts/github/sync-board-status.cjs --reconcile-status [--dry-run]`);
}

function parseArgs(argv) {
  const args = argv.slice(2);
  let mode = null;
  let branch = null;
  let dryRun = false;
  let force = false;
  const targets = [];

  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    if (arg === '--in-progress') {
      mode = 'in-progress';
    } else if (arg === '--in-review') {
      mode = 'in-review';
    } else if (arg === '--done') {
      mode = 'done';
    } else if (arg === '--reconcile-status') {
      mode = 'reconcile-status';
    } else if (arg === '--branch') {
      branch = args[i + 1] || '';
      i += 1;
    } else if (arg === '--dry-run') {
      dryRun = true;
    } else if (arg === '--force') {
      force = true;
    } else if (arg === '-h' || arg === '--help') {
      printHelp();
      process.exit(0);
    } else if (arg.startsWith('--')) {
      console.error(`❌ Opción desconocida: ${arg}`);
      printHelp();
      process.exit(1);
    } else {
      targets.push(arg);
    }
  }

  if (!mode) {
    console.error('❌ Debes indicar un modo: --in-progress, --in-review, --done o --reconcile-status.');
    printHelp();
    process.exit(1);
  }

  return { mode, branch, dryRun, force, targets };
}

function detectCurrentBranch() {
  try {
    return execSync('git branch --show-current', { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
  } catch {
    return '';
  }
}

function extractPbiFromText(text) {
  const match = String(text || '').match(/\b(PBI-\d{3})\b/i);
  return match ? match[1].toUpperCase() : null;
}

function extractReferencedIssues(text) {
  const regex = /\b(?:close[sd]?|fix(?:e[sd])?|resolve[sd]?|refs?)\s*:?\s*#(\d+)\b/gi;
  const result = new Set();
  let match = regex.exec(String(text || ''));
  while (match) {
    result.add(Number(match[1]));
    match = regex.exec(String(text || ''));
  }
  return result;
}

async function fetchProjectSnapshot() {
  const query = `query ($owner: String!, $repo: String!, $projectNumber: Int!) {
    repository(owner: $owner, name: $repo) {
      pullRequests(first: 25, states: [OPEN], orderBy: {field: CREATED_AT, direction: DESC}) {
        nodes {
          number
          baseRefName
          headRefName
          body
        }
      }
    }
    organization(login: $owner) {
      projectV2(number: $projectNumber) {
        id
        title
        statusField: field(name: "Status") {
          ... on ProjectV2SingleSelectField {
            id
            options { id name }
          }
        }
        scrumField: field(name: "Estado Scrum") {
          ... on ProjectV2SingleSelectField {
            id
            options { id name }
          }
        }
        items(first: 100) {
          nodes {
            id
            fieldValues(first: 15) {
              nodes {
                ... on ProjectV2ItemFieldSingleSelectValue {
                  name
                  field { ... on ProjectV2FieldCommon { name } }
                }
              }
            }
            content {
              ... on Issue {
                number
                title
                state
                labels(first: 15) {
                  nodes { name }
                }
              }
            }
          }
        }
      }
    }
  }`;

  return ghGraphql(query, { owner: OWNER, repo: REPO, projectNumber: PROJECT_NUMBER });
}

function getFieldValue(item, fieldName) {
  const node = (item.fieldValues?.nodes || []).find((fv) => fv?.field?.name === fieldName);
  return node?.name || '';
}

function itemMatchesPbi(item, pbiId) {
  const pbiField = getFieldValue(item, 'PBI').toUpperCase();
  if (pbiField === pbiId) return true;

  const num = pbiId.replace('PBI-', '');
  const labels = (item.content?.labels?.nodes || []).map((l) => l.name.toLowerCase());
  if (labels.includes(`pbi:${num}`)) return true;

  const title = (item.content?.title || '').toUpperCase();
  return title.includes(pbiId);
}

async function updateSingleSelectField(projectId, itemId, fieldId, optionId) {
  const mutation = `mutation ($projectId: ID!, $itemId: ID!, $fieldId: ID!, $optionId: String!) {
    updateProjectV2ItemFieldValue(input: {
      projectId: $projectId,
      itemId: $itemId,
      fieldId: $fieldId,
      value: { singleSelectOptionId: $optionId }
    }) {
      projectV2Item { id }
    }
  }`;
  await ghGraphql(mutation, { projectId, itemId, fieldId, optionId });
}

async function setItemStatuses({ project, item, targetScrum, dryRun, force }) {
  const issueNum = item.content.number;
  const currentScrum = getFieldValue(item, 'Estado Scrum');
  const currentNative = getFieldValue(item, 'Status');
  const targetNative = SCRUM_TO_NATIVE_STATUS[targetScrum] || 'In Progress';

  const currentRank = SCRUM_ORDER[currentScrum] ?? -1;
  const targetRank = SCRUM_ORDER[targetScrum] ?? -1;

  // Evitar retrocesos accidentales (ej. no bajar una issue ya en 'En revisión' o 'Hecho' a 'En progreso')
  if (!force && currentRank > targetRank) {
    return { changed: false, skippedHigher: true };
  }

  let changed = false;

  if (project.scrumField?.id && currentScrum !== targetScrum) {
    const opt = (project.scrumField.options || []).find((o) => o.name === targetScrum);
    if (opt) {
      if (dryRun) {
        console.log(`   [dry-run] #${issueNum} Estado Scrum: '${currentScrum || '—'}' -> '${targetScrum}'`);
      } else {
        await updateSingleSelectField(project.id, item.id, project.scrumField.id, opt.id);
        console.log(`   ✔ [Tablón] #${issueNum} Estado Scrum: '${currentScrum || '—'}' -> '${targetScrum}'`);
      }
      changed = true;
    }
  }

  if (project.statusField?.id && currentNative !== targetNative) {
    const opt = (project.statusField.options || []).find((o) => o.name === targetNative);
    if (opt) {
      if (dryRun) {
        console.log(`   [dry-run] #${issueNum} Status: '${currentNative || '—'}' -> '${targetNative}'`);
      } else {
        await updateSingleSelectField(project.id, item.id, project.statusField.id, opt.id);
        console.log(`   ✔ [Tablón] #${issueNum} Status: '${currentNative || '—'}' -> '${targetNative}'`);
      }
      changed = true;
    }
  }

  return { changed, skippedHigher: false };
}

async function main() {
  const { mode, branch, dryRun, force, targets } = parseArgs(process.argv);

  const data = await fetchProjectSnapshot();
  const project = data?.organization?.projectV2;
  if (!project) {
    console.error(`❌ No se pudo acceder al Project #${PROJECT_NUMBER} de ${OWNER}. Verifica permisos 'project' en tu token.`);
    process.exit(1);
  }

  const issueItems = (project.items?.nodes || []).filter((item) => item?.content?.number);

  if (mode === 'reconcile-status') {
    console.log(`🔄 [Board Sync] Reconciliando 'Estado Scrum' <-> 'Status' en Project #${PROJECT_NUMBER}...`);
    const openPrs = (data?.repository?.pullRequests?.nodes || []).filter(
      (pr) => pr.baseRefName === 'develop' || pr.baseRefName === 'main'
    );
    const inReviewIssues = new Set();
    for (const pr of openPrs) {
      for (const n of extractReferencedIssues(pr.body)) {
        inReviewIssues.add(n);
      }
    }

    let updatedCount = 0;
    for (const item of issueItems) {
      const issueNum = item.content.number;
      const issueState = item.content.state;
      let desiredScrum = getFieldValue(item, 'Estado Scrum') || 'Sprint Backlog';

      if (issueState === 'CLOSED') {
        desiredScrum = 'Hecho';
      } else if (inReviewIssues.has(issueNum)) {
        desiredScrum = 'En revisión';
      }

      const res = await setItemStatuses({
        project,
        item,
        targetScrum: desiredScrum,
        dryRun,
        force: issueState === 'CLOSED' || inReviewIssues.has(issueNum),
      });
      if (res.changed) updatedCount += 1;
    }
    console.log(`✅ [Board Sync] Reconciliación completada (${updatedCount} tarjeta(s) actualizadas).`);
    return;
  }

  const targetPbis = new Set();
  const targetIssues = new Set();

  for (const t of targets) {
    const pbi = extractPbiFromText(t);
    if (pbi) {
      targetPbis.add(pbi);
    } else if (/^#?\d+$/.test(t)) {
      targetIssues.add(Number(t.replace('#', '')));
    } else {
      console.warn(`⚠️  Objetivo ignorado (usa PBI-### o número de issue): '${t}'`);
    }
  }

  if (branch !== null || (targetPbis.size === 0 && targetIssues.size === 0)) {
    const branchName = branch || detectCurrentBranch();
    const pbiFromBranch = extractPbiFromText(branchName);
    if (pbiFromBranch) {
      targetPbis.add(pbiFromBranch);
    } else if (targetPbis.size === 0 && targetIssues.size === 0) {
      console.log(`ℹ️  [Board Sync] La rama '${branchName || '(desconocida)'}' no corresponde a un PBI-###; nada que mover.`);
      return;
    }
  }

  const targetScrum =
    mode === 'in-progress' ? 'En progreso' : mode === 'in-review' ? 'En revisión' : 'Hecho';

  const matchedItems = issueItems.filter((item) => {
    const num = item.content.number;
    if (targetIssues.has(num)) return true;
    for (const pbiId of targetPbis) {
      if (itemMatchesPbi(item, pbiId)) return true;
    }
    return false;
  });

  if (matchedItems.length === 0) {
    console.log(`ℹ️  [Board Sync] No se encontraron issues en Project #${PROJECT_NUMBER} para los objetivos indicados.`);
    return;
  }

  const scopeLabel = [
    ...Array.from(targetPbis),
    ...Array.from(targetIssues).map((n) => `#${n}`),
  ].join(', ');
  console.log(`🔄 [Board Sync] Asegurando estado mínimo '${targetScrum}' (${SCRUM_TO_NATIVE_STATUS[targetScrum]}) para: ${scopeLabel}`);

  let updatedCount = 0;
  for (const item of matchedItems) {
    // Para in-progress e in-review, solo tocamos issues ABIERTAS (nunca reabrimos tarjetas de issues cerradas)
    if (mode !== 'done' && item.content.state === 'CLOSED') {
      continue;
    }
    const res = await setItemStatuses({ project, item, targetScrum, dryRun, force });
    if (res.changed) updatedCount += 1;
  }

  console.log(`✅ [Board Sync] Revisión completada (${updatedCount} tarjeta(s) actualizadas de ${matchedItems.length} evaluadas).`);
}

main().catch((err) => {
  console.error(`❌ [Board Sync] Error: ${err.message}`);
  process.exit(1);
});
