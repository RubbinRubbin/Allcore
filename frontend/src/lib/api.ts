import { Message } from "./types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001";

export type { Message };

export async function sendMessage(
  messages: Message[],
  onChunk: (chunk: string) => void
): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messages: messages,
      stream: true,
    }),
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  const reader = response.body?.getReader();
  if (!reader) {
    throw new Error("No response body");
  }

  const decoder = new TextDecoder();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value, { stream: true });
    onChunk(chunk);
  }
}

export async function generateChatTitle(
  userMessage: string,
  assistantResponse: string
): Promise<string> {
  const messages: Message[] = [
    {
      role: "user",
      content: `Basandoti su questa conversazione, genera un titolo breve (massimo 5 parole) che descriva l'argomento principale. Rispondi SOLO con il titolo, senza punteggiatura finale.\n\nDomanda utente: "${userMessage}"\n\nRisposta assistente: "${assistantResponse.substring(0, 200)}"`,
    },
  ];

  let title = "";
  await sendMessage(messages, (chunk) => {
    title += chunk;
  });

  return title.trim().replace(/^["']|["']$/g, "").substring(0, 60) || "Nuova chat";
}

export async function checkHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/health`);
    return response.ok;
  } catch {
    return false;
  }
}
