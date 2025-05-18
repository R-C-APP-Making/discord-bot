const { Events } = require('discord.js');

module.exports = {
  name: Events.ClientReady,
  once: true,
  async execute(client) {
    console.log(`Ready! Logged in as ${client.user.tag}`);

   
    const motd = client.commands.get('motd');
    if (!motd?.sendMotd) {
      console.warn('⚠️ motd command or sendMotd() not found');
      return;
    }

    // if you launch with `MOTD_TEST=true` in your .env, we'll
    // send the first MOTD in 5 minutes
    if (process.env.MOTD_TEST === 'true') {
      const fiveMinutes = 5 * 60 * 1000;
      console.log('🚀 MOTD_TEST mode: sending first MOTD in 5 minutes');
      setTimeout(() => {
        motd.sendMotd(client);
        // then every 24h
        setInterval(() => motd.sendMotd(client), 86_400_000);
      }, fiveMinutes);
      return;
    }

    // ————————————— Production scheduling —————————————

    // compute delay until next POST_HOUR UTC
    const now  = new Date();
    const next = new Date(now);
    // use the same POST_HOUR you define in motd.js
    next.setUTCHours(motd.POST_HOUR ?? 9, 0, 0, 0);
    if (next <= now) next.setUTCDate(next.getUTCDate() + 1);

    const delay = next - now;
    console.log(`Scheduling first MOTD in ${Math.round(delay/1000/60)} minutes`);

    // schedule the first send at that UTC hour…
    setTimeout(() => {
      motd.sendMotd(client);
      // …and then every 24h after
      setInterval(() => motd.sendMotd(client), 86_400_000);
    }, delay);
  },
};
