#! /usr/bin/env node

require('dotenv').config();

const readline = require('readline');
const Rcon = require('rcon');

const {
  RCON_HOST = '127.0.0.1',
  RCON_PORT = 27015,
  RCON_PASS = '',
  RCON_TCP = 'false',
  RCON_CHALLENGE = 'true',
  RCON_ID = '',
} = process.env;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: '\u001b[33m' + 'RCON> ' + '\u001b[0m'
});

const connection = new Rcon(
  RCON_HOST,
  RCON_PORT,
  RCON_PASS,
  {
    id: RCON_ID,
    tcp: !!JSON.parse(RCON_TCP),
    challenge: !!JSON.parse(RCON_CHALLENGE),
  },
);

console.log(`Connecting to ${RCON_HOST}:${RCON_PORT}\n`);

connection.on('auth', () => {
  connection.send('status');
});
  
connection.on('response', (res) => {
  console.log(res);

  if (res.indexOf('Bad rcon_password.') > -1) {
    process.exit(1);
  }

  rl.prompt();
});

connection.on('error', () => {})
  
connection.on('end', () => {
  console.log('Socket closed!');
  process.exit();
});

connection.connect();

rl.on('line', (line) => {
  if (['exit', 'quit'].includes(line)) {
    process.exit(0);
  }

	connection.send(line);
});

connection.on('close', () => process.exit(0));

