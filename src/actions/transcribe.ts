'use server';

import OpenAI from 'openai';
import { zfd } from 'zod-form-data';

const openai = new OpenAI({ apiKey: process.env.AI_KEY });

const transcriptionSchema = zfd.formData({
  file: zfd.file(),
  prompt: zfd.text(),
  temperature: zfd.numeric(),
});

export const transcribe = async (formData: FormData) => {
  const { file, prompt, temperature } = transcriptionSchema.parse(formData);

  return await openai.audio.transcriptions.create({
    file: file,
    model: 'whisper-1',
    language: 'pt',
    response_format: 'json',
    temperature,
    prompt,
  });
};
