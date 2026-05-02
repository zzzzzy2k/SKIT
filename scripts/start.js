#!/usr/bin/env node

/**
 * SKit 一键启动脚本
 *
 * 同时启动 Vite 前端 + Express API 后端
 * 用法: node scripts/start.js
 */

import { spawn } from 'child_process';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

const children = [];

function start(name, cmd, args, color) {
  const child = spawn(cmd, args, {
    cwd: ROOT,
    stdio: 'pipe',
    shell: true,
  });

  const prefix = `\x1b[${color}m[${name}]\x1b[0m `;

  child.stdout.on('data', (data) => {
    for (const line of data.toString().split('\n')) {
      if (line.trim()) console.log(prefix + line);
    }
  });

  child.stderr.on('data', (data) => {
    for (const line of data.toString().split('\n')) {
      if (line.trim()) console.log(prefix + line);
    }
  });

  child.on('close', (code) => {
    console.log(`${prefix}exited with code ${code}`);
  });

  children.push(child);
  return child;
}

function shutdown() {
  console.log('\n\x1b[33m[system]\x1b[0m shutting down...');
  for (const child of children) {
    child.kill();
  }
  process.exit(0);
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

console.log('\x1b[36m╔═══════════════════════════════════════╗\x1b[0m');
console.log('\x1b[36m║        SKit - starting servers        ║\x1b[0m');
console.log('\x1b[36m╚═══════════════════════════════════════╝\x1b[0m');
console.log('');

start('API',  'node', ['server/index.js'],         '35');
start('Vite', 'npx',  ['vite', '--host'],           '36');

console.log('');
console.log('\x1b[33m[system]\x1b[0m press Ctrl+C to stop all servers');
console.log('');
