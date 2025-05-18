// src/commands/utility/motd.js
const { SlashCommandBuilder } = require('discord.js');

const CHANNEL_ID = process.env.MOTD_CHANNEL_ID;
const POST_HOUR  = 7; // 9:00 UTC; change as needed

const motdList = [
  '🌟 Believe in yourself! You are capable of amazing things.',
  '📚 Tip of the day: Take regular breaks to keep your mind fresh.',
  '💬 Remember: Kindness is free—sprinkle that stuff everywhere!',
  '🚀 Dream big, work hard, stay focused, and surround yourself with good people.'
];

function getMotd() {
  const dayIndex = Math.floor(Date.now() / 86_400_000);
  return motdList[dayIndex % motdList.length];
}

async function sendMotd(client) {
  const ch = await client.channels.fetch(CHANNEL_ID);
  if (ch?.isTextBased()) {
    ch.send(`**Message of the Day:**\n${getMotd()}`);
  }
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('motd')
    .setDescription('Show today’s Message of the Day'),
  async execute(interaction) {
    await interaction.reply(`**Message of the Day:**\n${getMotd()}`);
  },
  // expose sendMotd so ready.js can schedule it
  sendMotd,
};
