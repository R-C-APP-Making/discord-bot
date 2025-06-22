// src/commands/utility/motd-override.js
const fs   = require('node:fs');
const path = require('node:path');
const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

const LIST_PATH      = path.resolve(__dirname, '../../motd.json');
const OVERRIDES_PATH = path.resolve(__dirname, '../../overrides.json');

/**
 * @returns {string[]}
 */
function loadList() {
  return JSON.parse(fs.readFileSync(LIST_PATH, 'utf-8'));
}

/**
 * @returns {Record<string,string>}
 */
function loadOverrides() {
  return JSON.parse(fs.readFileSync(OVERRIDES_PATH, 'utf-8'));
}

/**
 * @param {Record<string,string>} obj
 */
function saveOverrides(obj) {
  fs.writeFileSync(OVERRIDES_PATH, JSON.stringify(obj, null, 2));
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('motd-override')
    .setDescription('Override today’s MOTD with either a custom message or an existing entry')
    .addStringOption(opt =>
      opt
        .setName('message')
        .setDescription('Your custom message for today’s MOTD')
        .setRequired(false)
    )
    .addIntegerOption(opt =>
      opt
        .setName('number')
        .setDescription('Choose a number of an existing MOTD entry to pin for today')
        .setRequired(false)
    )
    // optional: restrict to admins
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),

  async execute(interaction) {
    const custom = interaction.options.getString('message');
    const idxIn  = interaction.options.getInteger('number');

    // validate mutual exclusivity
    if (custom && idxIn !== null) {
      return interaction.reply({
        content: '❌ Please provide **either** a message **or** an number, not both.',
        ephemeral: true
      });
    }
    if (!custom && idxIn === null) {
      return interaction.reply({
        content: '❌ You must provide **either** a custom message **or** an number.',
        ephemeral: true
      });
    }

    // determine the override text
    let overrideText;
    if (idxIn !== null) {
      const list = loadList();
      const idx  = idxIn - 1;
      if (idx < 0 || idx >= list.length) {
        return interaction.reply({
          content: `❌ Invalid index. Please choose between 1 and ${list.length}.`,
          ephemeral: true
        });
      }
      overrideText = list[idx];
    } else {
      overrideText = custom.trim();
      if (!overrideText) {
        return interaction.reply({
          content: '❌ Custom message cannot be empty.',
          ephemeral: true
        });
      }
    }

    // write to overrides.json
    const key       = new Date().toISOString().slice(0, 10);
    const overrides = loadOverrides();
    overrides[key]  = overrideText;
    saveOverrides(overrides);

    await interaction.reply({
      content: `✅ MOTD for **${key}** overridden: ${overrideText}`,
      ephemeral: true
    });
  },
};
