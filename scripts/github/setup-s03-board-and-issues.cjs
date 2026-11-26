/* eslint-disable @typescript-eslint/no-require-imports */
/* global require, __dirname, process, console, setTimeout */
/**
 * =============================================================================
 * Generador y Sincronizador Multiplataforma de Issues y Tablón Scrum S03
 * (scripts/github/setup-s03-board-and-issues.cjs)
 * =============================================================================
 * - Crea o asegura el milestone 'S03' y las etiquetas 'sprint:S03', 'pbi:007',
 *   'pbi:008', 'pbi:009'.
 * - Crea (o actualiza de forma idempotente si ya existen) los 3 PBIs
 *   (PBI-008 -> @FSolaje, PBI-007 -> @Tarrant15, PBI-009 -> @Fernis23228) y
 *   las 18 tareas atómicas del Sprint S03.
 * - Vincula todas las issues al Tablón GitHub Projects v2 (#1) con sus campos
 *   Scrum (Estado Scrum = 'Sprint Backlog', Sprint = 'S03', PBI, Tipo, Estimate).
 * - Imprime en JSON el mapa de números de issue creados para actualizar
 *   sprint-backlog.md y product-backlog.md.
 * =============================================================================
 */

const fs = require('fs');
const path = require('path');
const { ensureGhAuthEnv, ghApiRest, ghGraphql } = require('./lib/gh-auth.cjs');

const OWNER = process.env.PROJECT_OWNER || 'Grup-05';
const REPO_NAME = process.env.REPO_NAME || 'ShopMaker-DAW';
const REPO = `${OWNER}/${REPO_NAME}`;
const PROJECT_NUM = Number(process.env.PROJECT_NUMBER || 1);
const DRY_RUN = process.argv.includes('--dry-run');

const pbis = JSON.parse(fs.readFileSync(path.join(__dirname, 'sprint-s03-pbis.json'), 'utf8'));
const tasks = JSON.parse(fs.readFileSync(path.join(__dirname, 'sprint-s03-tasks.json'), 'utf8'));

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function normalizeType(t) {
  if (t === 'Código' || t === 'Codigo' || t.toLowerCase().includes('digo')) return 'Código';
  if (t === 'Spec') return 'Spec';
  if (t === 'Test') return 'Test';
  if (t === 'Docs') return 'Docs';
  if (t === 'Chore') return 'Chore';
  if (t === 'Refactor') return 'Refactor';
  return 'Código';
}

function typeLabel(t) {
  const norm = normalizeType(t);
  if (norm === 'Código') return 'type:code';
  if (norm === 'Spec') return 'type:spec';
  if (norm === 'Test') return 'type:test';
  if (norm === 'Docs') return 'type:docs';
  if (norm === 'Chore') return 'type:chore';
  if (norm === 'Refactor') return 'type:refactor';
  return 'type:code';
}

function pbiLabel(pbiId) {
  const num = pbiId.replace('PBI-', '');
  return `pbi:${num}`;
}

function priorityLabel(p) {
  return p.toLowerCase() === 'media' ? 'priority:media' : 'priority:alta';
}

async function ensureLabels() {
  const requiredLabels = [
    { name: 'sprint:S03', color: '0052cc', description: 'Sprint S03' },
    { name: 'pbi:007', color: 'b60205', description: 'PBI-007' },
    { name: 'pbi:008', color: 'b60205', description: 'PBI-008' },
    { name: 'pbi:009', color: 'b60205', description: 'PBI-009' },
  ];

  const existing = await ghApiRest('GET', `/repos/${REPO}/labels?per_page=100`);
  const existingNames = new Set(existing.map((l) => l.name));

  for (const lbl of requiredLabels) {
    if (!existingNames.has(lbl.name)) {
      if (DRY_RUN) {
        console.log(`[dry-run] Crear label ${lbl.name}`);
      } else {
        await ghApiRest('POST', `/repos/${REPO}/labels`, lbl);
        console.log(`✔ Label creada: ${lbl.name}`);
      }
    }
  }
}

async function ensureMilestoneS03() {
  const milestones = await ghApiRest('GET', `/repos/${REPO}/milestones?state=all&per_page=50`);
  const found = milestones.find((m) => m.title === 'S03');
  if (found) {
    console.log(`✔ Milestone S03 ya existe (#${found.number})`);
    return found.number;
  }
  if (DRY_RUN) {
    console.log('[dry-run] Crear milestone S03');
    return 3;
  }
  const created = await ghApiRest('POST', `/repos/${REPO}/milestones`, {
    title: 'S03',
    state: 'open',
    description: 'Sprint S03 — Motor de Edición de Webs, Creación/Compra de Módulos y Previsualización Aislada',
    due_on: '2026-12-12T23:59:59Z',
  });
  console.log(`✔ Milestone S03 creado (#${created.number})`);
  return created.number;
}

async function ensureSelectFieldOptions(projectId, field, desiredOptionNames) {
  const existingNames = new Set((field.options || []).map((o) => o.name));
  const missing = desiredOptionNames.filter((n) => !existingNames.has(n));
  if (missing.length === 0 || DRY_RUN) {
    return field.options || [];
  }

  const newOptionsPayload = [
    ...(field.options || []).map((o) => ({
      name: o.name,
      color: o.color || 'BLUE',
      description: o.description || '',
    })),
    ...missing.map((n) => ({
      name: n,
      color: 'BLUE',
      description: n,
    })),
  ];

  try {
    const res = await ghGraphql(
      `mutation($fieldId: ID!, $options: [ProjectV2SingleSelectFieldOptionInput!]!) {
        updateProjectV2Field(input: { fieldId: $fieldId, singleSelectOptions: $options }) {
          projectV2Field {
            ... on ProjectV2SingleSelectField {
              id
              name
              options { id name }
            }
          }
        }
      }`,
      { fieldId: field.id, options: newOptionsPayload }
    );
    return res.updateProjectV2Field.projectV2Field.options;
  } catch (err) {
    console.warn(`Aviso al ampliar opciones del campo ${field.name}: ${err.message}`);
    return field.options || [];
  }
}

async function loadProjectMetadata() {
  const data = await ghGraphql(
    `query($owner: String!, $number: Int!) {
      organization(login: $owner) {
        projectV2(number: $number) {
          id
          fields(first: 30) {
            nodes {
              ... on ProjectV2Field {
                id
                name
              }
              ... on ProjectV2SingleSelectField {
                id
                name
                options { id name color description }
              }
            }
          }
        }
      }
    }`,
    { owner: OWNER, number: PROJECT_NUM }
  );

  const proj = data.organization.projectV2;
  const fieldsByName = {};
  for (const f of proj.fields.nodes) {
    if (f && f.name) {
      fieldsByName[f.name] = f;
    }
  }

  if (fieldsByName['Sprint']) {
    fieldsByName['Sprint'].options = await ensureSelectFieldOptions(proj.id, fieldsByName['Sprint'], ['S03']);
  }
  if (fieldsByName['PBI']) {
    fieldsByName['PBI'].options = await ensureSelectFieldOptions(proj.id, fieldsByName['PBI'], [
      'PBI-007',
      'PBI-008',
      'PBI-009',
    ]);
  }

  return { projectId: proj.id, fieldsByName };
}

async function addAndConfigureProjectItem(projectMeta, contentNodeId, config) {
  if (DRY_RUN) return;
  const addRes = await ghGraphql(
    `mutation($projectId: ID!, $contentId: ID!) {
      addProjectV2ItemById(input: { projectId: $projectId, contentId: $contentId }) {
        item { id }
      }
    }`,
    { projectId: projectMeta.projectId, contentId: contentNodeId }
  );
  const itemId = addRes.addProjectV2ItemById.item.id;

  const setSelect = async (fieldName, optionName) => {
    const field = projectMeta.fieldsByName[fieldName];
    if (!field || !field.options) return;
    const opt = field.options.find((o) => o.name === optionName);
    if (!opt) return;
    await ghGraphql(
      `mutation($projectId: ID!, $itemId: ID!, $fieldId: ID!, $optId: String!) {
        updateProjectV2ItemFieldValue(input: {
          projectId: $projectId,
          itemId: $itemId,
          fieldId: $fieldId,
          value: { singleSelectOptionId: $optId }
        }) { projectV2Item { id } }
      }`,
      { projectId: projectMeta.projectId, itemId, fieldId: field.id, optId: opt.id }
    );
  };

  const setText = async (fieldName, textVal) => {
    const field = projectMeta.fieldsByName[fieldName];
    if (!field) return;
    await ghGraphql(
      `mutation($projectId: ID!, $itemId: ID!, $fieldId: ID!, $text: String!) {
        updateProjectV2ItemFieldValue(input: {
          projectId: $projectId,
          itemId: $itemId,
          fieldId: $fieldId,
          value: { text: $text }
        }) { projectV2Item { id } }
      }`,
      { projectId: projectMeta.projectId, itemId, fieldId: field.id, text: textVal }
    );
  };

  await setSelect('Estado Scrum', 'Sprint Backlog');
  await setSelect('Sprint', 'S03');
  await setSelect('PBI', config.pbiId);
  await setSelect('Tipo', config.tipo);
  if (config.estimate) {
    await setText('Estimate', config.estimate);
  }
}

async function main() {
  ensureGhAuthEnv();
  console.log('=== CREACIÓN Y VINCULACIÓN DE ISSUES SPRINT S03 ===');

  await ensureLabels();
  const milestoneNumber = await ensureMilestoneS03();
  const projectMeta = await loadProjectMetadata();

  const existingIssues = await ghApiRest('GET', `/repos/${REPO}/issues?state=all&per_page=100`);

  const findIssueByMarker = (marker) =>
    existingIssues.find((iss) => !iss.pull_request && typeof iss.body === 'string' && iss.body.includes(marker));

  const taskMap = {};
  const pbiMap = {};

  // 1. Crear o actualizar primero las 18 tareas para tener sus números de issue reales
  for (const task of tasks) {
    const marker = `<!-- task:${task.key} -->`;
    const title = `[${task.pbi}][${task.key.split('-')[2]}] ${task.title}`;
    const acceptanceMd = task.acceptance.map((a) => `- [ ] ${a}`).join('\n');
    const testsMd = task.tests.map((t) => `- \`${t}\``).join('\n');
    const dependsMd =
      task.depends && task.depends.length ? task.depends.map((d) => `- \`${d}\``).join('\n') : '- Ninguna';

    const body = `${marker}\n\n## PBI\n\n\`${task.pbi}\`\n\n## Contexto y entregable\n\n${task.description}\n\n## Criterios de aceptación\n\n${acceptanceMd}\n\n## Pruebas asociadas\n\n${testsMd}\n\n## Dependencias\n\n${dependsMd}\n\n## Definition of Done\n\n- [ ] Criterios de aceptación cumplidos.\n- [ ] Tests escritos antes de la implementación (si aplica).\n- [ ] Suite completa en verde.\n- [ ] Matriz spec-test actualizada (si aplica).\n- [ ] Sin secretos ni rutas privadas.\n- [ ] PR revisado y mergeado.\n`;

    const labels = [
      'type:task',
      typeLabel(task.type),
      pbiLabel(task.pbi),
      'sprint:S03',
      priorityLabel(task.priority),
    ];

    const existing = findIssueByMarker(marker);
    let issueObj;
    if (existing) {
      issueObj = await ghApiRest('PATCH', `/repos/${REPO}/issues/${existing.number}`, {
        title,
        body,
        assignees: [task.assignee],
        milestone: milestoneNumber,
        labels,
      });
      console.log(`✔ Tarea actualizada: ${task.key} -> #${issueObj.number} (@${task.assignee})`);
    } else if (!DRY_RUN) {
      issueObj = await ghApiRest('POST', `/repos/${REPO}/issues`, {
        title,
        body,
        assignees: [task.assignee],
        milestone: milestoneNumber,
        labels,
      });
      console.log(`✔ Tarea creada: ${task.key} -> #${issueObj.number} (@${task.assignee})`);
      await sleep(250);
    }

    if (issueObj) {
      taskMap[task.key] = issueObj.number;
      await addAndConfigureProjectItem(projectMeta, issueObj.node_id, {
        pbiId: task.pbi,
        tipo: normalizeType(task.type),
        estimate: task.estimate,
      });
    }
  }

  // 2. Crear o actualizar los 3 PBIs referenciando las tareas reales creadas
  for (const pbi of pbis) {
    const marker = `<!-- pbi:${pbi.id} -->`;
    const title = `[${pbi.id}] ${pbi.title}`;
    const pbiTasks = tasks.filter((t) => t.pbi === pbi.id);
    const tasksMd = pbiTasks.map((t) => `- [ ] #${taskMap[t.key] || '?'} [${t.key}] ${t.title}`).join('\n');
    const body = `${marker}\n\n${pbi.body}\n\n## Tareas del Sprint\n\n${tasksMd}\n`;
    const labels = ['type:pbi', pbiLabel(pbi.id), 'sprint:S03', priorityLabel(pbi.priority)];

    const existing = findIssueByMarker(marker);
    let issueObj;
    if (existing) {
      issueObj = await ghApiRest('PATCH', `/repos/${REPO}/issues/${existing.number}`, {
        title,
        body,
        assignees: [pbi.assignee],
        milestone: milestoneNumber,
        labels,
      });
      console.log(`✔ PBI actualizado: ${pbi.id} -> #${issueObj.number} (@${pbi.assignee})`);
    } else if (!DRY_RUN) {
      issueObj = await ghApiRest('POST', `/repos/${REPO}/issues`, {
        title,
        body,
        assignees: [pbi.assignee],
        milestone: milestoneNumber,
        labels,
      });
      console.log(`✔ PBI creado: ${pbi.id} -> #${issueObj.number} (@${pbi.assignee})`);
      await sleep(250);
    }

    if (issueObj) {
      pbiMap[pbi.id] = issueObj.number;
      await addAndConfigureProjectItem(projectMeta, issueObj.node_id, {
        pbiId: pbi.id,
        tipo: 'PBI',
        estimate: pbi.estimate,
      });
    }
  }

  console.log('\n=== MAPA DE ISSUES GENERADO ===');
  console.log(JSON.stringify({ pbiMap, taskMap }, null, 2));
}

main().catch((err) => {
  console.error('❌ Error en setup-s03-board-and-issues.cjs:', err.message);
  process.exit(1);
});
