'use server';

import { AssemblyAI } from 'assemblyai';
import { zfd } from 'zod-form-data';

const assemblyai = new AssemblyAI({
  apiKey: process.env.API_KEY as string,
});

const transcriptionSchema = zfd.formData({
  file: zfd.file(),
  prompt: zfd.text().nullish(),
  model: zfd.text(),
  temperature: zfd.numeric(),
});

export const transcribe = async (formData: FormData) => {
  const {
    file,
    // model, // assembly-ai or whisper-1
    // prompt,
    // temperature
  } = transcriptionSchema.parse(formData);

  // using openai
  //
  // if (model === 'whisper-1') {
  //   const transcription = await openai.audio.transcriptions.create({
  //     file: file,
  //     model: 'whisper-1',
  //     language: 'pt',
  //     response_format: 'json',
  //     temperature,
  //     prompt,
  //   });
  //
  //   return transcription;
  // }

  const transcription = await assemblyai.transcripts.transcribe({
    audio: file,
    language_code: 'pt',
  });

  return transcription;
};
