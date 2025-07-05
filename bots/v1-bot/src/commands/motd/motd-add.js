// src/commands/utility/motd-add.js
const fs = require('node:fs');
const { SlashCommandBuilder } = require('discord.js');

// Resolve the real path for writing
const JSON_PATH = require.resolve('@src/motd.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('motd-add')
    .setDescription('Add a new message to the MOTD list')
    .addStringOption((opt) =>
      opt
        .setName('message')
        .setDescription('The message to add')
        .setRequired(true)
    ),
  async execute(interaction) {
    const newMsg = interaction.options.getString('message').trim();
    const list = JSON.parse(fs.readFileSync(JSON_PATH, 'utf-8'));

    list.push(newMsg);
    fs.writeFileSync(JSON_PATH, JSON.stringify(list, null, 2), 'utf-8');

    await interaction.reply({
      content: `✅ Added to MOTD list! There are now ${list.length} entries.`,
      ephemeral: true,
    });
  },
};
