// bots/v1-bot/src/commands/quote-channel/fetchLastTextMessage.js

const { SlashCommandBuilder } = require('discord.js');
// Requires Privileged Gateway Intents in /Bots in its section Privileged Gateway Intents
module.exports = {
  data: new SlashCommandBuilder()
    .setName('fetch_last_text_message')
    .setDescription('Fetches last message from Configured Channel.'),
  async execute(interaction) {
    // interaction.user is the object representing the User who ran the command
    // interaction.member is the GuildMember object, which represents the user in the specific guild
    const channel = await this.fetchChannel(interaction.client);
    const lastMessage = await this.fetchLastMessage(channel);
    // Log for debugging
    console.log(lastMessage);

    // Send a reply to the user
    await interaction.reply({
      content: lastMessage
        ? `📬 Last message in ${channel.name}:\n${lastMessage.content || '[no text content]'}`
        : '⚠️ Could not fetch the last message.',
      ephemeral: false, // set to true if you want only the user to see it
    });
  },
  async fetchChannel(client) {
    await console.log('fetching channel');
    try {
      const channel = await client.channels.fetch(process.env.QUOTE_CHANNEL);
      console.log(channel.name);
      console.log(`Channel: ${channel}`);
      return channel;
    } catch (err) {
      console.error(err);
      return null;
    }
  },
  async fetchLastMessage(channel) {
    const messages = await channel.messages.fetch({ limit: 20 });
    return messages.find((m) => !m.author.bot && m.content.trim().length > 0);
  },
};
