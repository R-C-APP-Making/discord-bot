const lastQuoteMap = new Map();

async function fetchRandomQuote(channel) {
  const messages = await channel.messages.fetch({ limit: 100 });
  const filtered = messages.filter((m) => !m.author.bot && m.content.trim());
  if (!filtered.size) {
    return null;
  }
  const array = Array.from(filtered.values());
  let quote;
  let attempts = 0;
  const lastId = lastQuoteMap.get(channel.id);
  do {
    quote = array[Math.floor(Math.random() * array.length)];
    attempts += 1;
  } while (quote.id === lastId && attempts < 10);

  lastQuoteMap.set(channel.id, quote.id);
  return quote;
}

module.exports = {
  fetchRandomQuote,
};
