// bots/v1-bot/src/commands/motd/motd-clear.js

const fs = require('node:fs');
const { SlashCommandBuilder } = require('discord.js');

const OVERRIDES_PATH = require.resolve('@src/overrides.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('motd-clear')
    .setDescription('Clear the override for today’s MOTD (revert to rotation)'),
  /**
   * @param {import('discord.js').ChatInputCommandInteraction} interaction
   */
  async execute(interaction) {
    const key = new Date().toISOString().slice(0, 10);
    const overrides = JSON.parse(fs.readFileSync(OVERRIDES_PATH, 'utf-8'));

    if (!overrides[key]) {
      return interaction.reply({
        content: `❌ No override set for ${key}.`,
        ephemeral: true,
      });
    }

    delete overrides[key];
    fs.writeFileSync(
      OVERRIDES_PATH,
      JSON.stringify(overrides, null, 2),
      'utf-8'
    );

    await interaction.reply({
      content: `🗑️ Cleared override for **${key}**. Back to the rotating MOTD.`,
      ephemeral: true,
    });
  },
};
