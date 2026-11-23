const fs = require('fs');
const path = require('path');
const os = require('os');
const { execSync } = require('child_process');

const REPO = 'Grup-05/ShopMaker-DAW';
const PROJECT_NUM = 1;
const PROJECT_OWNER = 'Grup-05';

const pbis = JSON.parse(fs.readFileSync(path.join(__dirname, 'sprint-s02-pbis.json'), 'utf8'));
const tasks = JSON.parse(fs.readFileSync(path.join(__dirname, 'sprint-s02-tasks.json'), 'utf8'));

const PBI_MAP = {
  'PBI-003': 4,
  'PBI-005': 36,
  'PBI-006': 37,
};

const TASK_MAP = {
  'PBI-003-T01': 38,
  'PBI-003-T02': 39,
  'PBI-003-T03': 40,
  'PBI-003-T04': 41,
  'PBI-003-T05': 42,
  'PBI-003-T06': 43,
  'PBI-005-T01': 44,
  'PBI-005-T02': 45,
  'PBI-005-T03': 46,
  'PBI-005-T04': 47,
  'PBI-005-T05': 48,
  'PBI-005-T06': 49,
  'PBI-006-T01': 50,
  'PBI-006-T02': 51,
  'PBI-006-T03': 52,
  'PBI-006-T04': 53,
  'PBI-006-T05': 54,
  'PBI-006-T06': 55,
};

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function normalizeType(t) {
  if (t === 'Código' || t === 'Codigo' || (t.toLowerCase().includes('c') && t.toLowerCase().includes('digo'))) return 'Código';
  if (t === 'Spec') return 'Spec';
  if (t === 'Test') return 'Test';
  if (t === 'Docs') return 'Docs';
  if (t === 'Chore') return 'Chore';
  if (t === 'Refactor') return 'Refactor';
  return 'Spec';
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

function runCmd(cmd) {
  console.log(`> ${cmd}`);
  return execSync(cmd, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
}

async function main() {
  console.log('=== REANUDACIÓN DE SINCRONIZACIÓN S02 (ISSUES + TABLERO) ===');

  // 1. Configurar PBIs
  for (const pbi of pbis) {
    const issueNum = PBI_MAP[pbi.id];
    console.log(`\n--- Configurando PBI ${pbi.id} (#${issueNum}) ---`);

    const pbiTasks = tasks.filter(t => t.pbi === pbi.id);
    const tasksMd = pbiTasks.map(t => `- [ ] #${TASK_MAP[t.key]} [${t.key}] ${t.title}`).join('\n');

    const bodyContent = `<!-- pbi:${pbi.id} -->\n\n${pbi.body}\n\n## Tareas del Sprint\n\n${tasksMd}\n`;
    const tempFile = path.join(os.tmpdir(), `pbi_${pbi.id}.md`);
    fs.writeFileSync(tempFile, bodyContent, 'utf8');

    const labels = `type:pbi,${pbiLabel(pbi.id)},sprint:S02,${priorityLabel(pbi.priority)}`;

    try {
      runCmd(`gh issue edit ${issueNum} --title "[${pbi.id}] ${pbi.title}" --body-file "${tempFile}" --add-assignee "${pbi.assignee}" --milestone "S02" --add-label "${labels}"`);
    } catch (e) {
      console.warn(`Aviso al editar issue ${issueNum}: ${e.message}`);
    } finally {
      if (fs.existsSync(tempFile)) fs.unlinkSync(tempFile);
    }

    const issueUrl = `https://github.com/${REPO}/issues/${issueNum}`;
    try {
      runCmd(`gh project item-add ${PROJECT_NUM} --owner ${PROJECT_OWNER} --url "${issueUrl}" --format json`);
      await sleep(400);
    } catch (e) {
      console.log(`Item ya en tablero.`);
    }

    try {
      runCmd(`gh project item-edit ${PROJECT_NUM} --owner ${PROJECT_OWNER} --url "${issueUrl}" --field "Estado Scrum" --value "Sprint Backlog"`);
      await sleep(300);
      runCmd(`gh project item-edit ${PROJECT_NUM} --owner ${PROJECT_OWNER} --url "${issueUrl}" --field "Sprint" --value "S02"`);
      await sleep(300);
      runCmd(`gh project item-edit ${PROJECT_NUM} --owner ${PROJECT_OWNER} --url "${issueUrl}" --field "PBI" --value "${pbi.id}"`);
      await sleep(300);
      runCmd(`gh project item-edit ${PROJECT_NUM} --owner ${PROJECT_OWNER} --url "${issueUrl}" --field "Tipo" --value "PBI"`);
      await sleep(300);
      runCmd(`gh project item-edit ${PROJECT_NUM} --owner ${PROJECT_OWNER} --url "${issueUrl}" --field "Estimate" --text "${pbi.estimate}"`);
      await sleep(300);
    } catch (e) {
      console.warn(`Aviso al editar campos de PBI ${issueNum}: ${e.message}`);
    }
  }

  // 2. Configurar Tareas
  for (const task of tasks) {
    const issueNum = TASK_MAP[task.key];
    console.log(`\n--- Configurando Tarea ${task.key} (#${issueNum}) ---`);

    const acceptanceMd = task.acceptance.map(a => `- [ ] ${a}`).join('\n');
    const testsMd = task.tests.map(t => `- \`${t}\``).join('\n');
    const dependsMd = task.depends && task.depends.length ? task.depends.map(d => `- \`${d}\``).join('\n') : '- Ninguna';

    const bodyContent = `<!-- task:${task.key} -->\n\n## PBI\n\n\`${task.pbi}\`\n\n## Contexto y entregable\n\n${task.description}\n\n## Criterios de aceptación\n\n${acceptanceMd}\n\n## Pruebas asociadas\n\n${testsMd}\n\n## Dependencias\n\n${dependsMd}\n\n## Definition of Done\n\n- [ ] Criterios de aceptación cumplidos.\n- [ ] Tests escritos antes de la implementación (si aplica).\n- [ ] Suite completa en verde.\n- [ ] Matriz spec-test actualizada (si aplica).\n- [ ] Sin secretos ni rutas privadas.\n- [ ] PR revisado y mergeado.\n`;

    const tempFile = path.join(os.tmpdir(), `task_${task.key}.md`);
    fs.writeFileSync(tempFile, bodyContent, 'utf8');

    const labels = `type:task,${typeLabel(task.type)},${pbiLabel(task.pbi)},sprint:S02,${priorityLabel(task.priority)}`;
    const normTipo = normalizeType(task.type);

    try {
      runCmd(`gh issue edit ${issueNum} --title "[${task.pbi}][${task.key.split('-')[2]}] ${task.title}" --body-file "${tempFile}" --add-assignee "${task.assignee}" --milestone "S02" --add-label "${labels}"`);
      await sleep(400);
    } catch (e) {
      console.warn(`Aviso al editar issue ${issueNum}: ${e.message}`);
    } finally {
      if (fs.existsSync(tempFile)) fs.unlinkSync(tempFile);
    }

    const issueUrl = `https://github.com/${REPO}/issues/${issueNum}`;
    try {
      runCmd(`gh project item-add ${PROJECT_NUM} --owner ${PROJECT_OWNER} --url "${issueUrl}" --format json`);
      await sleep(400);
    } catch (e) {
      console.log(`Item ya en tablero.`);
    }

    try {
      runCmd(`gh project item-edit ${PROJECT_NUM} --owner ${PROJECT_OWNER} --url "${issueUrl}" --field "Estado Scrum" --value "Sprint Backlog"`);
      await sleep(300);
      runCmd(`gh project item-edit ${PROJECT_NUM} --owner ${PROJECT_OWNER} --url "${issueUrl}" --field "Sprint" --value "S02"`);
      await sleep(300);
      runCmd(`gh project item-edit ${PROJECT_NUM} --owner ${PROJECT_OWNER} --url "${issueUrl}" --field "PBI" --value "${task.pbi}"`);
      await sleep(300);
      runCmd(`gh project item-edit ${PROJECT_NUM} --owner ${PROJECT_OWNER} --url "${issueUrl}" --field "Tipo" --value "${normTipo}"`);
      await sleep(300);
      runCmd(`gh project item-edit ${PROJECT_NUM} --owner ${PROJECT_OWNER} --url "${issueUrl}" --field "Estimate" --text "${task.estimate}"`);
      await sleep(300);
    } catch (e) {
      console.warn(`Aviso al editar campos de tarea ${issueNum}: ${e.message}`);
    }
  }

  console.log('\n=== VERIFICACIÓN Y AUDITORÍA (VERIFY & ASSERT) ===');
  let failures = 0;
  for (const [key, num] of Object.entries({ ...PBI_MAP, ...TASK_MAP })) {
    const raw = runCmd(`gh issue view ${num} --json assignees,labels,milestone,title`);
    const data = JSON.parse(raw);
    const hasAssignee = data.assignees && data.assignees.length > 0;
    const hasMilestone = data.milestone && data.milestone.title === 'S02';
    const hasLabels = data.labels && data.labels.some(l => l.name === 'sprint:S02');

    if (!hasAssignee || !hasMilestone || !hasLabels) {
      console.error(`❌ Fallo en issue #${num} (${key}): Assignee=${hasAssignee}, Milestone=${hasMilestone}, Labels=${hasLabels}`);
      failures++;
    } else {
      console.log(`✅ Issue #${num} (${key}): ${data.assignees[0].login} | MS: ${data.milestone.title} | Labels: ${data.labels.map(l => l.name).join(', ')}`);
    }
  }

  if (failures > 0) {
    throw new Error(`Se encontraron ${failures} issues con metadatos incompletos.`);
  }

  console.log('\n🎉 ¡TODAS LAS ISSUES Y CAMPOS DEL TABLERO HAN SIDO CONFIGURADOS Y VALIDADOS CON ÉXITO!');
}

main().catch(err => {
  console.error('ERROR FATAL:', err);
  process.exit(1);
});

