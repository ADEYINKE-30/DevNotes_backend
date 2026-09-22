/**
 * AI Provider Service
 * 
 * This service provides an abstraction layer for AI API interactions.
 * It handles communication with external AI providers while keeping
 * provider-specific implementation details isolated.
 */

interface AIProviderConfig {
  provider: string;
  apiKey: string;
  model: string;
}

interface AIMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface AIProviderResponse {
  content: string;
  provider: string;
  model: string;
  usage?: {
    inputTokens?: number;
    outputTokens?: number;
    totalTokens?: number;
  };
}

/**
 * Generate a response from the AI provider
 * 
 * @param messages - Array of conversation messages
 * @param systemPrompt - Optional system prompt to guide the AI
 * @returns AI-generated response object containing content, provider, model, and usage stats
 */
export const generateResponse = async (
  messages: AIMessage[],
  systemPrompt?: string
): Promise<AIProviderResponse> => {
  const config = getAIConfig();

  if (!config.apiKey && config.provider.toLowerCase() !== 'fallback') {
    throw new Error('AI service is not configured. Please set AI_API_KEY in environment variables.');
  }

  try {
    // Prepare messages with system prompt if provided
    const fullMessages: AIMessage[] = systemPrompt
      ? [{ role: 'system', content: systemPrompt }, ...messages]
      : messages;

    // Provider-specific implementation
    switch (config.provider.toLowerCase()) {
      case 'openai':
        return await generateOpenAIResponse(config, fullMessages);
      case 'anthropic':
        return await generateAnthropicResponse(config, fullMessages);
      default:
        // Fallback: Simple echo response for development/testing
        return generateFallbackResponse(messages);
    }
  } catch (error) {
    console.error('AI Provider Error:', error);
    throw new Error('AI service is temporarily unavailable. Please try again later.');
  }
};

/**
 * Get AI configuration from environment variables
 */
function getAIConfig(): AIProviderConfig {
  return {
    provider: process.env.AI_PROVIDER || 'fallback',
    apiKey: process.env.AI_API_KEY || '',
    model: process.env.AI_MODEL || 'fallback-model'
  };
}

/**
 * OpenAI provider implementation
 */
async function generateOpenAIResponse(
  config: AIProviderConfig,
  messages: AIMessage[]
): Promise<AIProviderResponse> {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${config.apiKey}`
    },
    body: JSON.stringify({
      model: config.model,
      messages: messages,
      temperature: 0.7,
      max_tokens: 2500
    })
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(`OpenAI API error: ${response.status} - ${JSON.stringify(error)}`);
  }

  const data = (await response.json()) as any;
  const content = data.choices?.[0]?.message?.content || 'I apologize, but I could not generate a response.';
  const usage = data.usage ? {
    inputTokens: data.usage.prompt_tokens,
    outputTokens: data.usage.completion_tokens,
    totalTokens: data.usage.total_tokens
  } : undefined;

  return {
    content,
    provider: 'openai',
    model: config.model,
    usage
  };
}

/**
 * Anthropic (Claude) provider implementation
 */
async function generateAnthropicResponse(
  config: AIProviderConfig,
  messages: AIMessage[]
): Promise<AIProviderResponse> {
  // Extract system message if present
  const systemMessage = messages.find(m => m.role === 'system');
  const conversationMessages = messages.filter(m => m.role !== 'system');

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': config.apiKey,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: config.model,
      max_tokens: 2500,
      system: systemMessage?.content,
      messages: conversationMessages
    })
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(`Anthropic API error: ${response.status} - ${JSON.stringify(error)}`);
  }

  const data = (await response.json()) as any;
  const content = data.content?.[0]?.text || 'I apologize, but I could not generate a response.';
  const usage = data.usage ? {
    inputTokens: data.usage.input_tokens,
    outputTokens: data.usage.output_tokens,
    totalTokens: (data.usage.input_tokens || 0) + (data.usage.output_tokens || 0)
  } : undefined;

  return {
    content,
    provider: 'anthropic',
    model: config.model,
    usage
  };
}

/**
 * Fallback response for development/testing without API key
 */
function generateFallbackResponse(messages: AIMessage[]): AIProviderResponse {
  const lastMessage = messages[messages.length - 1];

  const responseData = (content: string): AIProviderResponse => ({
    content,
    provider: 'fallback',
    model: 'fallback-model',
    usage: {
      inputTokens: 10,
      outputTokens: content.split(/\s+/).length,
      totalTokens: 10 + content.split(/\s+/).length
    }
  });

  if (!lastMessage || lastMessage.role !== 'user') {
    return responseData('I apologize, but I need a question to answer.');
  }

  const userMessage = lastMessage.content.toLowerCase();

  if (userMessage.includes('tailwind')) {
    return responseData('Tailwind CSS is a utility-first CSS framework. Compose small classes directly in your markup: <button className="rounded bg-blue-600 px-4 py-2 text-white">Save</button>. Use responsive prefixes such as md:flex to change styles at breakpoints.');
  }

  if (userMessage.includes('responsive') || userMessage.includes('mobile')) {
    return responseData('Responsive web design makes a layout adapt to different screens. Start mobile-first, use flexible units, and add breakpoints when the content needs them: @media (min-width: 768px) { .layout { display: grid; } }. Test with real device sizes.');
  }

  if (userMessage.includes('debug')) {
    return responseData('Debugging is the process of finding and fixing a defect. Reproduce the issue, inspect the exact error and inputs, isolate the smallest failing case, then verify the fix. For example, console.log({ value, type: typeof value }) can reveal an unexpected value or type.');
  }

  if (userMessage.includes('rest api') || userMessage.includes('restful') || userMessage.includes('api')) {
    return responseData('A REST API exposes resources over HTTP. Use clear URLs and methods: GET /posts reads, POST /posts creates, and DELETE /posts/:id removes. Return meaningful status codes such as 200, 201, 400, and 404, plus JSON data.');
  }

  if (userMessage.includes('express')) {
    return responseData('Express.js is a minimal Node.js framework for HTTP servers and middleware. A route can look like: app.get("/hello", (_req, res) => res.json({ message: "Hello" }));. Keep validation and error handling in middleware.');
  }

  if (userMessage.includes('mongodb') || userMessage.includes('mongo')) {
    return responseData('MongoDB is a document database that stores JSON-like records in collections. A query such as db.posts.find({ published: true }).sort({ createdAt: -1 }) finds published posts, newest first. Add indexes for fields used frequently in filters or sorting.');
  }

  if (userMessage.includes('node.js') || userMessage.includes('nodejs') || userMessage.includes('node ')) {
    return responseData('Node.js runs JavaScript outside the browser using an event-driven, non-blocking model. For example: import { readFile } from "node:fs/promises"; const text = await readFile("notes.txt", "utf8");. Use async/await and handle rejected promises.');
  }

  if (userMessage.includes('github')) {
    return responseData('GitHub hosts Git repositories and supports collaboration through branches, pull requests, issues, and code review. A common workflow is: git switch -c feature/profile, git add ., git commit -m "Add profile", then push the branch and open a pull request.');
  }

  if (userMessage.includes('git')) {
    return responseData('Git tracks changes to your project so you can work safely in branches and review history. A useful daily flow is: git status, git add <file>, git commit -m "Describe the change", and git log --oneline. Make focused commits that explain why the change was made.');
  }

  if (userMessage.includes('typescript')) {
    return responseData('TypeScript is a typed superset of JavaScript that catches many mistakes before runtime. Define the shape of data explicitly: type User = { name: string; active: boolean }; const user: User = { name: "Ada", active: true };. It improves editor support and maintainability.');
  }

  if (userMessage.includes('react')) {
    return responseData('React builds interfaces from reusable components whose UI is derived from state and props. For example: const [count, setCount] = useState(0); then render <button onClick={() => setCount(count + 1)}>{count}</button>. Keep state close to the components that use it.');
  }

  if (userMessage.includes('javascript')) {
    return responseData('JavaScript is the language of interactive web pages and also runs on servers such as Node.js. It supports asynchronous code: const response = await fetch("/api/posts"); const posts = await response.json();. Handle loading and error states around network requests.');
  }

  if (userMessage.includes('html')) {
    return responseData('HTML provides the semantic structure of a page. Prefer meaningful elements such as <main>, <nav>, <button>, and <form> instead of using <div> for everything: <button type="submit">Save</button>. Semantic markup improves accessibility and SEO.');
  }

  if (userMessage.includes('css')) {
    return responseData('CSS controls presentation and layout. Use classes, the box model, and layout tools such as Flexbox or Grid: .card { display: flex; gap: 1rem; align-items: center; }. Keep reusable values in custom properties like --brand-color.');
  }

  return responseData(`I understand you're asking about: "${lastMessage.content}". Demo AI is running in offline mode, so I can give short lessons on HTML, CSS, JavaScript, TypeScript, React, Tailwind CSS, Git, GitHub, Node.js, Express.js, MongoDB, REST APIs, debugging, and responsive web design.`);
}
