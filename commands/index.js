/*
  Command loader.

  Every command now lives in its own file inside /commands (e.g.
  commands/ping.js, commands/sticker.js ...). This file loads them once at
  startup and builds a single Map from command-name/alias -> handler, so
  pair.js can dispatch in O(1) instead of running a 2000+ line switch on
  every single incoming message.

  To add a new command: drop a new file in this folder shaped like:

    module.exports = {
        name: 'mycommand',
        aliases: ['alias1', 'alias2'],
        execute: async (ctx) => { ... }
    };

  It will be picked up automatically — no need to touch pair.js.
*/

const fs = require('fs');
const path = require('path');

const commandMap = new Map();
const commandList = [];

const files = fs
    .readdirSync(__dirname)
    .filter((f) => f.endsWith('.js') && f !== 'index.js');

for (const file of files) {
    const mod = require(path.join(__dirname, file));
    if (!mod || !mod.name || typeof mod.execute !== 'function') {
        console.warn(`⚠️  Skipping invalid command file: ${file}`);
        continue;
    }

    commandMap.set(mod.name.toLowerCase(), mod);
    commandList.push(mod);

    if (Array.isArray(mod.aliases)) {
        for (const alias of mod.aliases) {
            commandMap.set(alias.toLowerCase(), mod);
        }
    }
}

console.log(`✅ Loaded ${commandList.length} commands (${commandMap.size} names/aliases) from /commands`);

module.exports = {
    commandMap,
    commandList,
    /**
     * Look up and run a command by name. Returns true if a matching
     * command was found and executed, false otherwise (so callers can
     * fall back to "unknown command" handling if they want).
     */
    async run(name, ctx) {
        const cmd = commandMap.get(String(name || '').toLowerCase());
        if (!cmd) return false;
        await cmd.execute(ctx);
        return true;
    }
};
