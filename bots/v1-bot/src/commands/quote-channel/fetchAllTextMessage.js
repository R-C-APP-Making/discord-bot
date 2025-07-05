const { fetchChannelMessages } = require('@utils/fetchChannelMessages.js');
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('fetch_all_text_message')
    .setDescription('Fetches all text messages from a configured channel.'),
  async execute(interaction) {
    // Allow time for a longer operation
    await interaction.deferReply();
    const channel = await interaction.client.channels.fetch(
      process.env.QUOTE_CHANNEL
    );
    if (!channel?.isTextBased()) {
      return interaction.editReply('⚠️ Invalid or inaccessible channel.');
    }

    const allMessages = await fetchChannelMessages(channel, {
      messagesPerFetch: 100,
      maxTotalMessages: 50,
      startDate: new Date('2025-05-18T12:00:00-05:00'),
      endDateExclusive: new Date('2025-06-23T12:00:00-05:00'),
      filter: (msg) => !msg.author.bot && msg.content.trim().length > 0,
    });

    if (allMessages.length === 0) {
      return interaction.editReply('No Messages Found');
    }

    const contents = allMessages.map((msg) => msg.content);
    const output = contents.join('\n');
    return interaction.editReply(output);
  },
};
