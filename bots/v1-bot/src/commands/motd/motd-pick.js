// bots/v1-bot/src/commands/motd/motd-pick.js

const fs = require('node:fs');
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const JSON_PATH = require.resolve('@src/motd.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('motd-pick')
    .setDescription(
      'Retrieve a specific entry from the MOTD list (Leave empty to see list)'
    )
    .addIntegerOption((opt) =>
      opt
        .setName('index')
        .setDescription('Pick which motd you would like to post')
        .setRequired(false)
    ),

  async execute(interaction) {
    const list = JSON.parse(fs.readFileSync(JSON_PATH, 'utf-8'));
    const idxIn = interaction.options.getInteger('index');

    // No index? Show the list with indexes
    if (idxIn === null) {
      // Build an embed with up to 25 fields (Discord limit)
      const embed = new EmbedBuilder()
        .setTitle('Available MOTD Entries')
        .setColor('Random');

      list.forEach((msg, i) => {
        embed.addFields({ name: `#${i + 1}`, value: msg });
      });

      return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    // Index supplied: validate & show that one
    const idx = idxIn - 1;
    if (idx < 0 || idx >= list.length) {
      return interaction.reply({
        content: `❌ Invalid index. Please pick between 1 and ${list.length}.`,
        ephemeral: true,
      });
    }

    await interaction.reply(`**MOTD #${idx + 1}:**\n${list[idx]}`);
  },
};
