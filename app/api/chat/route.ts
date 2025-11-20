import { createOpenAI } from '@ai-sdk/openai';
import { streamText, UIMessage } from 'ai';
import { getCaseData, getSuspectById } from '../../lib/caseData';
import { buildSuspectPrompt } from '../../../constant/prompts';
import { getServerEnv } from '../../../env';

export const maxDuration = 30;

// Helper function to extract text from UIMessage parts
function extractTextFromMessage(message: UIMessage): string {
  if (!message.parts || message.parts.length === 0) return '';

  return message.parts
    .filter((part) => part.type === 'text' && 'text' in part)
    .map((part) => (part as { text: string }).text)
    .join('');
}

// Transform UIMessages to simple format and then to ModelMessages
function transformMessagesToModelFormat(
  messages: UIMessage[]
): Array<{ role: 'user' | 'assistant'; content: string }> {
  return messages
    .map((msg) => {
      const text = extractTextFromMessage(msg);
      if (!text) return null;

      // Map roles: 'user' -> 'detective', 'assistant' -> suspect name
      const role = msg.role === 'user' ? 'user' : 'assistant';
      return {
        role: role as 'user' | 'assistant',
        content: text,
      };
    })
    .filter((msg): msg is { role: 'user' | 'assistant'; content: string } => msg !== null);
}

export async function POST(req: Request) {
  try {
    const { suspectId, messages }: { suspectId: number; messages: UIMessage[] } =
      await req.json();

    if (!suspectId) {
      return new Response('Suspect ID is required', { status: 400 });
    }

    const suspectData = getSuspectById(suspectId);
    if (!suspectData) {
      return new Response('Suspect not found', { status: 404 });
    }

    const caseData = getCaseData();
    // Transform messages to simpler format
    const simplifiedMessages = transformMessagesToModelFormat(messages);
    const systemPrompt = buildSuspectPrompt(suspectData, caseData);

    const serverEnv = getServerEnv();
    // Create OpenAI provider with custom API key
    const openai = createOpenAI({
      apiKey: serverEnv.openaiApiKey,
    });

    const result = streamText({
      model: openai('gpt-4o'),
      system: systemPrompt,
      messages: simplifiedMessages,
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error('Error in chat API:', error);
    return new Response('Internal server error', { status: 500 });
  }
}
