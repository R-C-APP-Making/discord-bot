require('dotenv').config();
const OpenAI = require('openai'); // default export, not destructured :contentReference[oaicite:4]{index=4}

class BasicOpenAIClient {
  /**
   * @param {object} [options]
   * @param {string} [options.apiKey]       – OPENAI_API_KEY (defaults to process.env)
   * @param {string} [options.model]        – model name (defaults to 'gpt-4o-mini')
   * @param {string} [options.systemPrompt] – default system prompt
   */
  constructor({ apiKey, model = 'gpt-4o-mini', systemPrompt = '' } = {}) {
    // Instantiate the single OpenAI client directly
    this.client = new OpenAI({
      apiKey: apiKey || process.env.OPENAI_API_KEY,
    }); // no Configuration or OpenAIApi classes :contentReference[oaicite:5]{index=5}

    this.model = model;
    this.systemPrompt = systemPrompt;
  }

  setModel(model) {
    this.model = model;
    return this;
  }

  setSystemPrompt(prompt) {
    this.systemPrompt = prompt;
    return this;
  }

  /**
   * @param {object} params
   * @param {string} params.userContent     – the user’s message
   * @param {string} [params.systemPrompt]  – override the default system prompt
   * @param {string} [params.model]         – override the default model
   * @returns {Promise<string>}             – the assistant’s reply
   */
  async chat({ userContent, systemPrompt, model }) {
    const sys = systemPrompt ?? this.systemPrompt;
    const mdl = model ?? this.model;

    const messages = [];
    if (sys) messages.push({ role: 'system', content: sys });
    messages.push({ role: 'user', content: userContent });

    // Use the chat completions endpoint on the client
    const response = await this.client.chat.completions.create({
      model: mdl,
      messages,
    }); // same API surface, just different client instantiation :contentReference[oaicite:6]{index=6}

    return response.choices[0].message.content;
  }
}

module.exports = { BasicOpenAIClient };
