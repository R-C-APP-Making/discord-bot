// src/commands/utility/motd.js
const fs = require('node:fs');
const path = require('node:path');
const { SlashCommandBuilder } = require('discord.js');

const LIST_PATH = path.resolve(__dirname, '../../motd.json');
const OVERRIDES_PATH = path.resolve(__dirname, '../../overrides.json');
const CONFIG_PATH = path.resolve(__dirname, '../../motd-config.json');
const CHANNEL_ID = process.env.MOTD_CHANNEL_ID;

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

async function sendMotd(client) {
  const ch = await client.channels.fetch(CHANNEL_ID);
  if (ch?.isTextBased()) {
    ch.send(`**Message of the Day:**\n${getMotd()}`);
  }
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('motd')
    .setDescription('Show today’s Message of the Day'),
  async execute(interaction) {
    await interaction.reply(`**Message of the Day:**\n${getMotd()}`);
  },
  sendMotd,
  getPostHour, // exported instead of hardcoded POST_HOUR
};
