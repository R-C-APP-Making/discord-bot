// src/commands/utility/motd-remove.js
const fs = require('node:fs');
const path = require('node:path');
const { SlashCommandBuilder } = require('discord.js');

const JSON_PATH = path.resolve(__dirname, '../../motd.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('motd-remove')
    .setDescription('Remove an entry from the MOTD list by its number')
    .addIntegerOption((opt) =>
      opt
        .setName('number')
        .setDescription('Remove message based on its number')
        .setRequired(true)
    ),

  async execute(interaction) {
    const list = JSON.parse(fs.readFileSync(JSON_PATH, 'utf-8'));
    const idxIn = interaction.options.getInteger('number');
    const idx = idxIn - 1;

    if (idx < 0 || idx >= list.length) {
      return interaction.reply({
        content: `❌ Invalid index. Please choose between 1 and ${list.length}. You can also do /motd-pick to see the list.`,
        ephemeral: true,
      });
    }

    // Remove the entry
    const [removed] = list.splice(idx, 1);
    fs.writeFileSync(JSON_PATH, JSON.stringify(list, null, 2));

    await interaction.reply({
      content: `🗑️ Removed MOTD #${idxIn}: "${removed}"\nThere are now ${list.length} entries left.`,
      ephemeral: true,
    });
  },
};
