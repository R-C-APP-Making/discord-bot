// src/events/ready.js
const { Events } = require('discord.js');
const cron = require('node-cron');

module.exports = {
  name: Events.ClientReady,
  once: true,
  async execute(client) {
    console.log(`Ready! Logged in as ${client.user.tag}`);

    // grab your motd module
    const motd = client.commands.get('motd');
    if (!motd?.sendMotd || !motd.getPostHour) {
      console.warn('⚠️ motd command or sendMotd()/getPostHour() not found');
      return;
    }

    const POST_HOUR = motd.getPostHour(); // 👈 get fresh value from config

    // If you still want test mode every 5 minutes:
    if (process.env.MOTD_TEST === 'true') {
      console.log('🚀 MOTD_TEST mode: will post every 5 minutes');
      cron.schedule('*/5 * * * *', () => {
        motd.sendMotd(client);
      });
      return;
    }

    // Production: schedule at minute 0 of your POST_HOUR every day (EST)
    const schedule = `0 ${POST_HOUR} * * *`;
    cron.schedule(
      schedule,
      () => {
        motd.sendMotd(client);
      },
      {
        timezone: 'America/New_York', // ⏰ Adjusting to EST properly
      }
    );
    console.log(`✅ Scheduled MOTD daily at ${POST_HOUR}:00 EST`);
  },
};
