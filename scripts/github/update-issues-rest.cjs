const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const REPO = 'Grup-05/ShopMaker-DAW';
const MILESTONE_ID = 2; // S02

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

function normalizeType(t) {
  if (t === 'Código' || t === 'Codigo' || (t.toLowerCase().includes('c') && t.toLowerCase().includes('digo'))) return 'code';
  if (t === 'Spec') return 'spec';
  if (t === 'Test') return 'test';
  if (t === 'Docs') return 'docs';
  if (t === 'Chore') return 'chore';
  if (t === 'Refactor') return 'refactor';
  return 'code';
}

function pbiLabel(pbiId) {
  const num = pbiId.replace('PBI-', '');
  return `pbi:${num}`;
}

function priorityLabel(p) {
  return p.toLowerCase() === 'media' ? 'priority:media' : 'priority:alta';
}

function patchIssue(num, payload) {
  const jsonStr = JSON.stringify(payload);
  const res = execSync(`gh api repos/${REPO}/issues/${num} -X PATCH --input -`, {
    input: jsonStr,
    encoding: 'utf8'
  });
  return JSON.parse(res);
}

async function main() {
  console.log('=== ACTUALIZACIÓN REST DE ISSUES S02 ===');

  // 1. PBIs
  for (const pbi of pbis) {
    const num = PBI_MAP[pbi.id];
    console.log(`Actualizando PBI ${pbi.id} (#${num})...`);
    const pbiTasks = tasks.filter(t => t.pbi === pbi.id);
    const tasksMd = pbiTasks.map(t => `- [ ] #${TASK_MAP[t.key]} [${t.key}] ${t.title}`).join('\n');
    const bodyContent = `<!-- pbi:${pbi.id} -->\n\n${pbi.body}\n\n## Tareas del Sprint\n\n${tasksMd}\n`;

    const payload = {
      title: `[${pbi.id}] ${pbi.title}`,
      body: bodyContent,
      milestone: MILESTONE_ID,
      assignees: [pbi.assignee],
      labels: ['type:pbi', pbiLabel(pbi.id), 'sprint:S02', priorityLabel(pbi.priority)]
    };

    const res = patchIssue(num, payload);
    console.log(`✅ PBI #${num} actualizado: Assignee=${res.assignees.map(a => a.login).join(',')} | MS=${res.milestone ? res.milestone.title : 'null'}`);
  }

  // 2. Tasks
  for (const task of tasks) {
    const num = TASK_MAP[task.key];
    console.log(`Actualizando Tarea ${task.key} (#${num})...`);
    const acceptanceMd = task.acceptance.map(a => `- [ ] ${a}`).join('\n');
    const testsMd = task.tests.map(t => `- \`${t}\``).join('\n');
    const dependsMd = task.depends && task.depends.length ? task.depends.map(d => `- \`${d}\``).join('\n') : '- Ninguna';

    const bodyContent = `<!-- task:${task.key} -->\n\n## PBI\n\n\`${task.pbi}\`\n\n## Contexto y entregable\n\n${task.description}\n\n## Criterios de aceptación\n\n${acceptanceMd}\n\n## Pruebas asociadas\n\n${testsMd}\n\n## Dependencias\n\n${dependsMd}\n\n## Definition of Done\n\n- [ ] Criterios de aceptación cumplidos.\n- [ ] Tests escritos antes de la implementación (si aplica).\n- [ ] Suite completa en verde.\n- [ ] Matriz spec-test actualizada (si aplica).\n- [ ] Sin secretos ni rutas privadas.\n- [ ] PR revisado y mergeado.\n`;

    const payload = {
      title: `[${task.pbi}][${task.key.split('-')[2]}] ${task.title}`,
      body: bodyContent,
      milestone: MILESTONE_ID,
      assignees: [task.assignee],
      labels: ['type:task', `type:${normalizeType(task.type)}`, pbiLabel(task.pbi), 'sprint:S02', priorityLabel(task.priority)]
    };

    const res = patchIssue(num, payload);
    console.log(`✅ Tarea #${num} actualizada: Assignee=${res.assignees.map(a => a.login).join(',')} | MS=${res.milestone ? res.milestone.title : 'null'}`);
  }

  console.log('\n=== VERIFICACIÓN FINAL DE TODAS LAS ISSUES ===');
  let missing = 0;
  for (const [key, num] of Object.entries({ ...PBI_MAP, ...TASK_MAP })) {
    const res = JSON.parse(execSync(`gh api repos/${REPO}/issues/${num}`, { encoding: 'utf8' }));
    const okAssignee = res.assignees && res.assignees.length > 0;
    const okMilestone = res.milestone && res.milestone.title === 'S02';
    const okLabels = res.labels && res.labels.some(l => l.name === 'sprint:S02');

    if (!okAssignee || !okMilestone || !okLabels) {
      console.error(`❌ #${num} (${key}) fallo: Assignee=${okAssignee}, MS=${okMilestone}, Labels=${okLabels}`);
      missing++;
    } else {
      console.log(`✅ #${num} (${key}): @${res.assignees[0].login} | MS:${res.milestone.title} | ${res.labels.map(l => l.name).join(', ')}`);
    }
  }

  if (missing > 0) {
    throw new Error(`Hay ${missing} issues que no cumplen con los metadatos requeridos.`);
  }

  console.log('\n🎉 ¡TODAS LAS 21 ISSUES DE S02 TIENEN SUS ASIGNACIONES, MILESTONE S02 Y ETIQUETAS COMPLETAS!');
}

main().catch(err => {
  console.error('ERROR:', err);
  process.exit(1);
});
