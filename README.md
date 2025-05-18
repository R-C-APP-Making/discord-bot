# Discord Bot

This bot includes a `/quote` command that posts a random quote from a chosen channel.  
It can also automatically post quotes at a fixed interval when configured with environment variables.

## Quote command

```
/quote source:#source-channel target:#target-channel
```

- `source` (required) – channel to pull messages from
- `target` (optional) – channel to post the quote in (defaults to the command channel)

## Automatic quoting

Set the following environment variables before starting the bot:

- `QUOTE_SOURCE_CHANNEL` – ID of the channel to read quotes from
- `QUOTE_TARGET_CHANNEL` – ID of the channel to send quotes to
- `QUOTE_INTERVAL` – interval in milliseconds between quotes

If all three variables are provided and `QUOTE_INTERVAL` is greater than zero, the bot will periodically send a random quote to the target channel.
