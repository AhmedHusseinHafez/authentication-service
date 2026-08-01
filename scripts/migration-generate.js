const { execSync } = require('child_process');
const path = require('path');

const name = process.argv[2];

if (!name) {
  console.error('Usage: npm run migration:generate -- <migration-name>');
  console.error('Example: npm run migration:generate -- create-refresh-token');
  process.exit(1);
}

const command = `npm run typeorm -- migration:generate ./src/db/migrations/${name} -d ./src/db/data-source.ts`;

execSync(command, {
  stdio: 'inherit',
  cwd: path.resolve(__dirname, '..'),
  shell: true,
});
