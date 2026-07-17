const { spawn } = require('child_process');
const path = require('path');

console.log('\x1b[36m%s\x1b[0m', '🚀 Starting EM BABU THINNARA (Backend + Frontend)...');

const npxCmd = process.platform === 'win32' ? 'npx.cmd' : 'npx';

// Start Backend Server
const backend = spawn('node', ['index.js'], {
  cwd: path.join(__dirname, '../backend'),
  shell: true,
  stdio: 'inherit'
});

// Start Frontend Server
const frontend = spawn(npxCmd, ['vite'], {
  cwd: __dirname,
  shell: true,
  stdio: 'inherit'
});

// Terminate both processes when one exits
backend.on('close', (code) => {
  frontend.kill();
  process.exit(code);
});

frontend.on('close', (code) => {
  backend.kill();
  process.exit(code);
});

// Clean up on exit
process.on('SIGINT', () => {
  backend.kill();
  frontend.kill();
  process.exit();
});

process.on('SIGTERM', () => {
  backend.kill();
  frontend.kill();
  process.exit();
});
