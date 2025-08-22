// bots/v1-bot/src/events/copyChannel.js

module.exports = {
  name: 'messageCreate',
  /**
   * @param {import('discord.js').Message} message
   */
  async execute(message) {
    // ignore bots
    if (message.author.bot) return;

    // Expect comma-separated lists in your .env:
    // MONITORED_CHANNEL_IDS="111,222,333"
    // OUTPUT_CHANNEL_IDS="444,555"
    const rawMonitored = process.env.COPY_MONITORED_CHANNEL_IDS || '';
    const rawOutputs = process.env.COPY_OUTPUT_CHANNEL_IDS || '';

    // Build arrays of trimmed IDs
    const monitoredIDs = rawMonitored
      .split(',')
      .map((id) => id.trim())
      .filter(Boolean);
    const outputIDs = rawOutputs
      .split(',')
      .map((id) => id.trim())
      .filter(Boolean);

    // If this channel isn't in our watch list, bail out
    if (!monitoredIDs.includes(message.channel.id)) return;

    // Prepare the forwarded content
    // some channels (DM) don't have .name → guard
    const channelLabel =
      'name' in message.channel
        ? `#${message.channel.name}`
        : message.channel.id;
    const guildLabel = message.guild?.name || 'DM';
    const forwardText =
      `🔔 [${channelLabel}] <${guildLabel}>\n` +
      `**${message.author.tag}**: ${message.content}`;

    // Send to each output channel
    for (const outId of outputIDs) {
      const outChan = message.client.channels.cache.get(outId);
      if (!outChan || !outChan.isTextBased()) {
        console.warn(
          `⚠️ Cannot forward to ${outId}: channel not found or not text-based.`
        );
        continue;
      }
      try {
        // Narrow to channels that actually have `.send`
        if ('send' in outChan && typeof outChan.send === 'function') {
          await outChan.send({ content: forwardText });
        } else {
          console.warn(`⚠️ Channel ${outId} is text-based but not sendable.`);
        }
      } catch (err) {
        console.error(`❌ Failed sending to ${outId}:`, err);
      }
    }
  },
};
