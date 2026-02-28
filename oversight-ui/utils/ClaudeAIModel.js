// utils/ClaudeAIModel.js

import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.CLAUDE_API_KEY,
  dangerouslyAllowBrowser: true, // Secure and flexible
});

export async function claudeChat(prompt) {
  try {
    const msg = await anthropic.messages.create({
      model: "claude-3-sonnet-20240229",
      max_tokens: 2048,
      temperature: 0.7,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const text = msg?.content?.[0]?.text ?? null;
    return text;
  } catch (err) {
    console.error("Claude Chat Error:", err);
    return null;
  }
}
