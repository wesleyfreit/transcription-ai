import { OpenAI } from 'openai';
import { zfd } from 'zod-form-data';

const openai = new OpenAI({ apiKey: process.env.AI_KEY });

const transcriptionSchema = zfd.formData({
  file: zfd.file(),
  prompt: zfd.text(),
  temperature: zfd.numeric(),
});

export async function POST(request: Request) {
  console.log('POST /api/ai/transcribe');
  const { file, prompt, temperature } = transcriptionSchema.parse(
    await request.formData(),
  );

  const transcription = await openai.audio.transcriptions.create({
    file: file,
    model: 'whisper-1',
    language: 'pt',
    response_format: 'json',
    temperature,
    prompt,
  });

  return Response.json({ text: transcription.text });
}
