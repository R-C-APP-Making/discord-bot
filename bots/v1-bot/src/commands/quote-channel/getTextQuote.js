const { fetchChannelMessages } = require('@utils/fetchChannelMessages.js');
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('get_text_quote')
    .setDescription('Fetches a random quote from the configured channel.'),
  async execute(interaction) {
    await interaction.deferReply();

    const channel = await interaction.client.channels.fetch(
      process.env.QUOTE_CHANNEL
    );
    if (!channel?.isTextBased()) {
      return interaction.editReply('⚠️ Invalid or inaccessible channel.');
    }

    const allMessages = await fetchChannelMessages(channel, {
      messagesPerFetch: 100,
      maxTotalMessages: 500,
      startDate: new Date('2025-05-17T12:00:00-05:00'),
      endDateExclusive: new Date('2025-06-23T12:00:00-05:00'),
      filter: (msg) => !msg.author.bot && msg.content.trim().length > 0,
    });

    if (!allMessages.length) {
      return interaction.editReply('❌ No quotes found in that time range.');
    }

    const randomMsg =
      allMessages[Math.floor(Math.random() * allMessages.length)];

    return interaction.editReply(randomMsg.content);
  },
};
