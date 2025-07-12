// bots/v1-bot/src/utils/fetchChannelMessages.js

/**
 * Fetch messages from a channel, with pagination, date filtering, and optional limits.
 *
 * @param {TextChannel} channel
 * @param {object} [options]
 * @param {number} [options.messagesPerFetch=100]   // How many messages per API call (1–100)
 * @param {number} [options.maxTotalMessages=Infinity] // Total messages to retrieve
 * @param {Date}   [options.startDate]          // Earliest message to include (inclusive)
 * @param {Date}   [options.endDateExclusive]            // Latest  message to exclude (exclusive)
 * @param {Function|Function[]} [options.filter] // Additional predicate(s)
 * @returns {Promise<Message[]>}
 */
async function fetchChannelMessages(
  channel,
  {
    messagesPerFetch = 100,
    maxTotalMessages = Infinity,
    startDate,
    endDateExclusive,
    filter = () => true,
  } = {}
) {
  const all = [];
  let lastId = undefined;
  const filters = Array.isArray(filter) ? filter : [filter];

  while (all.length < maxTotalMessages) {
    // don't ask for more than Discord allows or more than we still need
    const limit = Math.min(messagesPerFetch, maxTotalMessages - all.length);
    const opts = lastId ? { limit, before: lastId } : { limit };

    const batch = await channel.messages.fetch(opts);
    if (!batch.size) break;

    // apply date bounds + extra predicates
    const page = [...batch.values()].filter((msg) => {
      const t = msg.createdAt.getTime();
      if (startDate && t < startDate.getTime()) return false;
      if (endDateExclusive && t >= endDateExclusive.getTime()) return false; // exclusive
      return filters.every((fn) => fn(msg));
    });

    all.push(...page);

    // if we've hit the oldest or fewer than requested, stop
    if (batch.size < limit) break;
    lastId = batch.last().id;
  }

  return all;
}

module.exports = { fetchChannelMessages };
