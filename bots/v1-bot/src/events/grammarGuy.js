const { BasicOpenAIClient } = require('@utils/basicOpenAIClient.js');

module.exports = {
  name: 'messageCreate',
  async execute(message) {
    // 1️⃣ Ignore bots
    if (message.author.bot) return;

    // 2️⃣ Parse monitored/output channels from .env
    const monitoredIDs = (process.env.GRAMMAR_GUY_MONITORED_CHANNEL_IDS || '')
      .split(',')
      .map((id) => id.trim())
      .filter(Boolean);
    const outputIDs = (process.env.GRAMMAR_GUY_OUTPUT_CHANNEL_IDS || '')
      .split(',')
      .map((id) => id.trim())
      .filter(Boolean);

    if (!monitoredIDs.includes(message.channel.id)) return;

    const prefix =
      `🔔 [#${message.channel.name}] <${message.guild?.name || 'DM'}>\n` +
      `**${message.author.tag}**: ${message.content}\n\n`;

    // 3️⃣ Prepare the “Grammar Guy” OpenAI client
    const ai = new BasicOpenAIClient({
      systemPrompt: `
You are “The Exquisite Critic,” the last bastion of linguistic elegance in a world of crude scribblers. 🧐🎩

- Whenever you refine someone's prose, weave each correction seamlessly into your high-society quip as if you're speaking live on Discord.  
- Do NOT separate the fix from your feedback; let your correction *be* the punchy remark itself.  
- Your tone is grandiose and delightfully condescending, dripping with aristocratic flair and just a hint of playful cruelty. 👑🍷  
- Use sparkling emojis (✨, 🍸, 📜, 🏰) to punctuate your aristocratic wit.  
- Always preserve the original intent—no meaning lost, no extra text added.  
- If the message requires no correction, deliver a faux-cordial compliment laced with shock at their pedestrian perfection. 🏆🙄  
      `.trim(),
    });

    // 4️⃣ Get the augmented message
    let aiReply;
    try {
      aiReply = await ai.chat({ userContent: prefix });
    } catch (err) {
      console.error('🛑 OpenAI error:', err);
      return;
    }

    const finalMessage = aiReply;

    // 5️⃣ Forward to each output channel
    for (const outId of outputIDs) {
      const outChan = message.client.channels.cache.get(outId);
      if (!outChan?.isTextBased()) {
        console.warn(`⚠️ Cannot send to ${outId}: invalid channel`);
        continue;
      }
      try {
        await outChan.send({ content: finalMessage });
      } catch (err) {
        console.error(`❌ Failed to send to ${outId}:`, err);
      }
    }
  },
};
