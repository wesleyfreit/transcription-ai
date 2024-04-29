import { createReadStream } from 'node:fs';
import { OpenAI } from 'openai';
import { zfd } from "zod-form-data";

const openai = new OpenAI({ apiKey: process.env.AI_KEY });

const transcriptionSchema = zfd.formData({
  file: zfd.file(),
  prompt: zfd.text(),
  temperature: zfd.numeric(),
});

export async function POST(request: Request) {
  
  try {
    const { file, prompt, temperature } = transcriptionSchema.parse(await request.formData());
    
    const response = await openai.audio.transcriptions.create({
      file: file,
      model: 'whisper-1',
      language: 'pt',
      response_format: 'json',
      temperature,
      prompt,
    });

    console.log(response);
  
    return Response.json({ transcription: response.text })
  } catch (error) {
    console.log(error);
  }
}