// ─── AI Publishing Studio — LLM Provider abstraction ─────────────────────────
//
// Architecture is provider-agnostic. To add Anthropic, Gemini, or a local LLM:
//   1. Implement the LLMProvider interface below
//   2. Export a factory function (e.g. createAnthropicProvider)
//   3. Wire it in getDefaultProvider() or expose it for explicit selection

export interface LLMMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface LLMOptions {
  temperature?: number;
  maxTokens?: number;
  jsonMode?: boolean;
}

export interface LLMProvider {
  readonly name: string;
  complete(messages: LLMMessage[], options?: LLMOptions): Promise<string>;
}

// ─── OpenAI-compatible provider ───────────────────────────────────────────────

function createOpenAICompatibleProvider(
  baseUrl: string,
  apiKey: string,
  model: string
): LLMProvider {
  return {
    name: `OpenAI (${model} via ${baseUrl.includes("localhost") ? "Replit proxy" : "direct"})`,

    async complete(messages: LLMMessage[], options: LLMOptions = {}): Promise<string> {
      const res = await fetch(`${baseUrl}/chat/completions`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model,
          messages,
          temperature: options.temperature ?? 0.75,
          max_tokens: options.maxTokens ?? 6000,
          ...(options.jsonMode
            ? { response_format: { type: "json_object" } }
            : {}),
        }),
      });

      if (!res.ok) {
        const text = await res.text().catch(() => res.statusText);
        throw new Error(`LLM API error (${res.status}): ${text}`);
      }

      const data = (await res.json()) as {
        choices: Array<{ message: { content: string } }>;
      };

      const content = data.choices?.[0]?.message?.content;
      if (!content) throw new Error("LLM returned empty content");
      return content;
    },
  };
}

// ─── Provider selection ───────────────────────────────────────────────────────

/**
 * Returns the best available LLM provider.
 * Prefers Replit AI Integrations proxy (auto-provisioned, no cost to user key).
 * Falls back to direct OpenAI if no proxy is configured.
 *
 * Future providers: add cases for ANTHROPIC_API_KEY, GOOGLE_API_KEY, etc.
 */
export function getDefaultProvider(): LLMProvider {
  const proxyUrl = process.env.AI_INTEGRATIONS_OPENAI_BASE_URL;
  const proxyKey = process.env.AI_INTEGRATIONS_OPENAI_API_KEY;

  if (proxyUrl && proxyKey) {
    return createOpenAICompatibleProvider(proxyUrl, proxyKey, "gpt-4o");
  }

  const directKey = process.env.OPENAI_API_KEY;
  if (directKey) {
    return createOpenAICompatibleProvider(
      "https://api.openai.com/v1",
      directKey,
      "gpt-4o"
    );
  }

  throw new Error(
    "No LLM provider configured. Set OPENAI_API_KEY or configure Replit AI Integrations."
  );
}

// ─── Future provider stubs (wire up when needed) ──────────────────────────────
//
// export function createAnthropicProvider(apiKey: string): LLMProvider { ... }
// export function createGeminiProvider(apiKey: string): LLMProvider { ... }
// export function createLocalProvider(baseUrl: string): LLMProvider { ... }
