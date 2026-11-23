const { execSync } = require('child_process');

try {
  const query = JSON.stringify({
    query: `
      query {
        organization(login: "Grup-05") {
          projectV2(number: 1) {
            items(first: 100) {
              totalCount
              nodes {
                id
                content {
                  ... on Issue {
                    number
                    title
                  }
                }
                fieldValues(first: 20) {
                  nodes {
                    ... on ProjectV2ItemFieldSingleSelectValue {
                      name
                      field {
                        ... on ProjectV2FieldCommon {
                          name
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    `
  });
  const res = execSync('gh api graphql --input -', { input: query, encoding: 'utf8' });
  const data = JSON.parse(res);
  const items = data.data.organization.projectV2.items.nodes;
  console.log('Total items in Project 1:', data.data.organization.projectV2.items.totalCount);
  const s02Numbers = [4, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55];
  for (const num of s02Numbers) {
    const item = items.find(i => i.content && i.content.number === num);
    if (item) {
      const estadoField = item.fieldValues.nodes.find(fv => fv.field && fv.field.name === 'Estado Scrum');
      console.log(`#${num}: En tablero (${item.id}) | Estado Scrum: ${estadoField ? estadoField.name : 'SIN ESTADO'}`);
    } else {
      console.log(`#${num}: NO ESTA EN TABLERO`);
    }
  }
} catch (e) {
  console.log('GraphQL error:', e.stderr ? e.stderr.toString() : e.message);
}
