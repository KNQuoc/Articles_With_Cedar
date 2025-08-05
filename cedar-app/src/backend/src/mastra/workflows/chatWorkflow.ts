// ---------------------------------------------
// Workflows are a Mastra primitive to orchestrate agents and complex sequences of tasks
// Docs: https://mastra.ai/en/docs/workflows/overview
// ---------------------------------------------

import { createWorkflow, createStep } from '@mastra/core/workflows';
import { z } from 'zod';
import { productRoadmapAgent } from '../agents/productRoadmapAgent';
import { bookAgent } from '../agents/bookAgent';
import { researchPaperAgent } from '../agents/researchPaperAgent';
import { streamJSONEvent } from '../../utils/streamUtils';
import { ExecuteFunctionResponseSchema, ActionResponseSchema } from './chatWorkflowTypes';

export const ChatInputSchema = z.object({
  prompt: z.string(),
  temperature: z.number().optional(),
  maxTokens: z.number().optional(),
  systemPrompt: z.string().optional(),
  streamController: z.any().optional(),
  // For structured output
  output: z.any().optional(),
});

export const ChatOutputSchema = z.object({
  content: z.string(),
  object: ActionResponseSchema.optional(),
  usage: z.any().optional(),
});

export type ChatOutput = z.infer<typeof ChatOutputSchema>;

// 1. fetchContext – passthrough (placeholder)
const fetchContext = createStep({
  id: 'fetchContext',
  description: 'Placeholder step – you might want to fetch some information for your agent here',
  inputSchema: ChatInputSchema,
  outputSchema: ChatInputSchema.extend({
    context: z.any().optional(),
  }),
  execute: async ({ inputData }) => {
    console.log('Chat workflow received input data', inputData);
    // [STEP 5] (Backend): If the user adds a node via @mention then sends a message, the agent will receive it here in the user prompt field.
    // [STEP 6] (Backend): If you call the subscribeInputContext hook on the frontend, the agent will receive that state as context, formatted in the way you specified.
    const frontendContext = inputData.prompt;

    // Merge, filter, or modify the frontend context as needed
    const unifiedContext = frontendContext;

    const result = { ...inputData, prompt: unifiedContext };

    return result;
  },
});

// 2. buildAgentContext – build message array
const buildAgentContext = createStep({
  id: 'buildAgentContext',
  description: 'Combine fetched information and build LLM messages',
  inputSchema: fetchContext.outputSchema,
  outputSchema: ChatInputSchema.extend({
    messages: z.array(
      z.object({
        role: z.enum(['system', 'user', 'assistant']),
        content: z.string(),
      }),
    ),
  }),
  execute: async ({ inputData }) => {
    const { prompt, temperature, maxTokens, streamController } = inputData;

    const messages = [
      { role: 'system' as const, content: 'You MUST respond with structured output using the experimental_output format. When adding books or research papers, return both content and action fields in the response object.' },
      { role: 'user' as const, content: prompt }
    ];

    const result = { ...inputData, messages, temperature, maxTokens, streamController };

    return result;
  },
});

// 3. callAgent – invoke chatAgent
const callAgent = createStep({
  id: 'callAgent',
  description: 'Invoke the chat agent with options',
  inputSchema: buildAgentContext.outputSchema,
  outputSchema: ChatOutputSchema,
  execute: async ({ inputData }) => {
    const { messages, temperature, maxTokens, streamController, systemPrompt } = inputData;

    if (streamController) {
      streamJSONEvent(streamController, {
        type: 'stage_update',
        status: 'update_begin',
        message: 'Generating response...',
      });
    }

    // Use appropriate agent based on query type
    const isResearchPaperQuery = messages.some(msg => {
      const content = msg.content.toLowerCase();
      // Check for research paper specific terms first
      return content.includes('research paper') ||
        content.includes('arxiv') ||
        content.includes('doi') ||
        content.includes('journal') ||
        content.includes('abstract') ||
        content.includes('academic') ||
        content.includes('2310.11453'); // Specific arXiv ID
    });

    const isBookQuery = messages.some(msg => {
      const content = msg.content.toLowerCase();
      // Only detect as book query if it explicitly mentions book AND doesn't mention research paper or arXiv
      return (content.includes('book') && !content.includes('research paper') && !content.includes('arxiv')) ||
        (content.includes('add') && !content.includes('paper') && !content.includes('research') && !content.includes('arxiv')) ||
        (content.includes('library') && !content.includes('paper') && !content.includes('research') && !content.includes('arxiv')) ||
        content.includes('read') ||
        content.includes('author') ||
        content.includes('genre');
    });

    let agent;
    // Prioritize research paper queries over book queries when both are detected
    if (isResearchPaperQuery) {
      agent = researchPaperAgent;
    } else if (isBookQuery) {
      agent = bookAgent;
    } else {
      agent = productRoadmapAgent;
    }

    console.log('Using agent:', agent.name);
    console.log('Message content:', messages[0]?.content);
    console.log('Is book query:', isBookQuery);
    console.log('Is research paper query:', isResearchPaperQuery);
    console.log('User prompt:', inputData.prompt);

    const response = await agent.generate(messages, {
      // If system prompt is provided, overwrite the default system prompt for this agent
      ...(systemPrompt ? ({ instructions: systemPrompt } as const) : {}),
      temperature,
      maxTokens,
      experimental_output: ExecuteFunctionResponseSchema,
    });

    // `response.object` is guaranteed to match ExecuteFunctionResponseSchema
    const { content, action } = response.object ?? {
      content: response.text,
    };

    const result: ChatOutput = {
      content,
      object: action,
      usage: response.usage,
    };

    console.log('Chat workflow result', result);
    console.log('Response object:', response.object);
    console.log('Action:', action);
    console.log('Content:', content);
    if (streamController) {
      streamJSONEvent(streamController, result);
    }

    if (streamController) {
      streamJSONEvent(streamController, {
        type: 'stage_update',
        status: 'update_complete',
        message: 'Response generated',
      });
    }

    return result;
  },
});

export const chatWorkflow = createWorkflow({
  id: 'chatWorkflow',
  description:
    'Chat workflow that replicates the old /chat/execute-function endpoint behaviour with optional streaming',
  inputSchema: ChatInputSchema,
  outputSchema: ChatOutputSchema,
})
  .then(fetchContext)
  .then(buildAgentContext)
  .then(callAgent)
  .commit();
