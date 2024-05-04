import { deleteObject, getObject } from '@/libs/cloudflare';
import { createReadStream } from 'node:fs';
import { OpenAI } from 'openai';
import { z } from 'zod';

export const runtime = 'nodejs';

const openai = new OpenAI({ apiKey: process.env.AI_KEY });

const transcriptionSchema = z.object({
  fileId: z.string(),
  prompt: z.string(),
  temperature: z.number(),
});

export async function POST(request: Request) {
  const { fileId, prompt, temperature } = transcriptionSchema.parse(await request.json());

  const filePath = await getObject(fileId);
  const audioReadStream = createReadStream(filePath);

  const transcription = await openai.audio.transcriptions.create({
    file: audioReadStream,
    model: 'whisper-1',
    language: 'pt',
    response_format: 'json',
    temperature,
    prompt,
  });

  await deleteObject(fileId);

  return Response.json({ text: transcription.text });
}
