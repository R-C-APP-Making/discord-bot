const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

const configPath = path.resolve(__dirname, '../../motd-config.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('motd-time')
    .setDescription('Set the hour (0-23 EST) the MOTD will post.')
    .addIntegerOption(option =>
      option.setName('hour')
        .setDescription('Hour in EST (0-23)')
        .setRequired(true)
        .setMinValue(0)
        .setMaxValue(23)
    ),
  async execute(interaction) {
    const hour = interaction.options.getInteger('hour');

    // load existing config
    const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    config.postHour = hour;

    // save updated config
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));

    await interaction.reply(`✅ MOTD will be posted at **${hour}:00 EST**.`);
  },
};
