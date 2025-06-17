import { google } from "@ai-sdk/google";
import { streamText } from "ai";

export const maxDuration = 30;

function errorHandler(error: unknown) {
  if (error == null) {
    return "unknown error";
  }

  if (typeof error === "string") {
    return error;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return JSON.stringify(error);
}

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: google("gemini-2.0-flash"),
    system: 'You are a helpful assistant named PeteAI, available on the PeteZah Games Proxy (sometimes called PeteZah-Next because it is an iteration on the original PeteZah Games built using Next.Js) Respond to the user in Markdown format.',
    messages,
  });

  return result.toDataStreamResponse({ getErrorMessage: errorHandler });
}
