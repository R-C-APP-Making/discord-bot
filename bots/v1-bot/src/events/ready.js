const { Events } = require('discord.js');
const { fetchRandomQuote } = require('../utils/quoteManager');

module.exports = {
  name: Events.ClientReady,
  once: true,
  async execute(client) {
    console.log(`Ready! Logged in as ${client.user.tag}`);

    const sourceId = process.env.QUOTE_SOURCE_CHANNEL;
    const targetId = process.env.QUOTE_TARGET_CHANNEL;
    const interval = Number(process.env.QUOTE_INTERVAL);

    if (sourceId && targetId && interval > 0) {
      setInterval(async () => {
        try {
          const source = await client.channels.fetch(sourceId);
          const target = await client.channels.fetch(targetId);
          if (!source || !target) return;
          const quote = await fetchRandomQuote(source);
          if (quote) {
            target.send(`> ${quote.content}\n- ${quote.author}`);
          }
        } catch (err) {
          console.error('Quote interval error:', err);
        }
      }, interval);
    }
  },
};
