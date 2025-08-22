// bots/v1-bot/src/events/interactionCreate.js

const { Events, MessageFlags } = require('discord.js');

module.exports = {
  name: Events.InteractionCreate,
  /**
   * @param {import('discord.js').ChatInputCommandInteraction} interaction
   */
  async execute(interaction) {
    if (!interaction.isChatInputCommand()) return;
    /** @typedef {import('discord.js').Collection<string, any>} CommandCollection */
    /** @typedef {import('discord.js').Client<true> & { commands: CommandCollection }} ClientWithCommands */
    const client = /** @type {ClientWithCommands} */ (interaction.client);
    const command = client.commands.get(interaction.commandName);

    if (!command) {
      console.error(
        `No command matching ${interaction.commandName} was found.`
      );
      return;
    }

    try {
      await command.execute(interaction);
    } catch (error) {
      console.error(error);
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({
          content: 'There was an error while executing this command!',
          flags: MessageFlags.Ephemeral,
        });
      } else {
        await interaction.reply({
          content: 'There was an error while executing this command!',
          flags: MessageFlags.Ephemeral,
        });
      }
    }
  },
};
