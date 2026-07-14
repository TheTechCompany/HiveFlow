const { spawn } = require('child_process');
const path = require('path');

const ROOT = path.join(__dirname, '..');

const processes = [
  { name: 'backend',  dir: 'packages/app/hiveflow-backend',  color: '\x1b[36m' },
  { name: 'frontend', dir: 'packages/app/hiveflow-frontend', color: '\x1b[35m' },
];

const children = processes.map(({ name, dir, color }) => {
  const child = spawn('yarn', ['start'], {
    cwd: path.join(ROOT, dir),
    shell: true,
    stdio: ['inherit', 'pipe', 'pipe'],
    env: { ...process.env, FORCE_COLOR: '1' },
  });

  child.stdout.on('data', (d) => process.stdout.write(`${color}[${name}]\x1b[0m ${d}`));
  child.stderr.on('data', (d) => process.stderr.write(`${color}[${name}]\x1b[0m ${d}`));
  child.on('close', (code) => process.stdout.write(`${color}[${name}]\x1b[0m exited ${code}\n`));

  return child;
});

process.on('SIGINT', () => children.forEach((c) => c.kill('SIGINT')));
process.on('SIGTERM', () => children.forEach((c) => c.kill('SIGTERM')));