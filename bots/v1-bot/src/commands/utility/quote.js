const { SlashCommandBuilder, ChannelType } = require('discord.js');
const { fetchRandomQuote } = require('../../utils/quoteManager');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('quote')
    .setDescription('Send a random quote from a channel')
    .addChannelOption((option) =>
      option
        .setName('source')
        .setDescription('Channel to pull the quote from')
        .setRequired(true)
    )
    .addChannelOption((option) =>
      option
        .setName('target')
        .setDescription('Channel to post the quote in')
        .addChannelTypes(ChannelType.GuildText)
        .setRequired(false)
    ),
  async execute(interaction) {
    const source = interaction.options.getChannel('source');
    const target =
      interaction.options.getChannel('target') ?? interaction.channel;
    try {
      const quote = await fetchRandomQuote(source);
      if (!quote) {
        await interaction.reply({
          content: 'No messages found in that channel.',
          ephemeral: true,
        });
        return;
      }

      await interaction.reply({
        content: 'Quote sent!',
        ephemeral: true,
      });
      await target.send(`> ${quote.content}\n- ${quote.author}`);
    } catch (error) {
      console.error(error);
      await interaction.reply({
        content: 'Failed to fetch quote.',
        ephemeral: true,
      });
    }
  },
};
