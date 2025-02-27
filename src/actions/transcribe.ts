'use server';

import { AssemblyAI } from 'assemblyai';
import { zfd } from 'zod-form-data';

const assemblyai = new AssemblyAI({
  apiKey: process.env.API_KEY as string,
});

const transcriptionSchema = zfd.formData({
  file: zfd.file(),
  prompt: zfd.text(),
  temperature: zfd.numeric(),
});

export const transcribe = async (formData: FormData) => {
  const { file } = transcriptionSchema.parse(formData);

  const transcription = await assemblyai.transcripts.transcribe({
    audio: file,
    language_code: 'pt',
  });

  return transcription;
};
