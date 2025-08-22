// bots/v1-bot/src/commands/motd/motd.js

const fs = require('node:fs');
const { SlashCommandBuilder } = require('discord.js');

// Turn each aliased module into its absolute file path
const LIST_PATH = require.resolve('@src/motd.json');
const OVERRIDES_PATH = require.resolve('@src/overrides.json');
const CONFIG_PATH = require.resolve('@src/motd-config.json');

const CHANNEL_ID = process.env.MOTD_CHANNEL_ID;
if (!CHANNEL_ID) {
  throw new Error('MOTD_CHANNEL_ID is not set in the environment');
}

function loadList() {
  return JSON.parse(fs.readFileSync(LIST_PATH, 'utf-8'));
}

function loadOverrides() {
  return JSON.parse(fs.readFileSync(OVERRIDES_PATH, 'utf-8'));
}

// function saveOverrides(obj) {
//   fs.writeFileSync(OVERRIDES_PATH, JSON.stringify(obj, null, 2));
// }

// NEW: Load config (postHour) from JSON file
function loadConfig() {
  return JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf-8'));
}

function getPostHour() {
  const config = loadConfig();
  return config.postHour ?? 17; // default to 17 if not set
}

function getMotd() {
  const todayKey = new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"
  const overrides = loadOverrides();
  if (overrides[todayKey]) {
    return overrides[todayKey];
  }

  // fallback to rotating list
  const list = loadList();
  const idx = Math.floor(Date.now() / 86_400_000) % list.length;
  return list[idx];
}

/**
 * @param {import('discord.js').Client} client
 */
async function sendMotd(client) {
  const ch = await client.channels.fetch(/** @type {string} */ (CHANNEL_ID));
  if (ch && 'send' in ch && typeof ch.send === 'function' && ch.isTextBased()) {
    await ch.send(`**Message of the Day:**\n${getMotd()}`);
  }
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('motd')
    .setDescription('Show today’s Message of the Day'),
  /**
   * @param {import('discord.js').ChatInputCommandInteraction} interaction
   */
  async execute(interaction) {
    await interaction.reply(`**Message of the Day:**\n${getMotd()}`);
  },
  sendMotd,
  getPostHour, // exported instead of hardcoded POST_HOUR
};
