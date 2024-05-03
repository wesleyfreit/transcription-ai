'use server';

import { env } from '@/env';
import { deleteObject, getObject } from '@/libs/cloudflare';
import { createReadStream } from 'fs';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: env.AI_KEY });

export const transcribe = async (fileId: string, prompt: string, temperature: number) => {
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

  return transcription;
};
