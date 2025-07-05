// src/commands/utility/motd-time.js
const fs = require('node:fs');
const { SlashCommandBuilder } = require('discord.js');

const CONFIG_PATH = require.resolve('@src/motd-config.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('motd-time')
    .setDescription('Set the hour (0-23 EST) the MOTD will post.')
    .addIntegerOption((option) =>
      option
        .setName('hour')
        .setDescription('Hour in EST (0-23)')
        .setRequired(true)
        .setMinValue(0)
        .setMaxValue(23)
    ),
  async execute(interaction) {
    const hour = interaction.options.getInteger('hour');

    // load existing config
    const config = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf-8'));
    config.postHour = hour;

    // save updated config
    fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2), 'utf-8');

    await interaction.reply(`✅ MOTD will post at **${hour}:00 EST**.`);
  },
};
