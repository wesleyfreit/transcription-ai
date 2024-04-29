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
  
  try {
    const { file, prompt, temperature } = transcriptionSchema.parse(formData);
    
    return await openai.audio.transcriptions.create({
      file: file,
      model: 'whisper-1',
      language: 'pt',
      response_format: 'json',
      temperature,
      prompt,
    });
  } catch (error) {
    return {
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor. Cras elementum ultrices diam. Maecenas ligula massa, varius a, semper congue, euismod non, mi. Proin porttitor, orci nec nonummy molestie, enim est eleifend mi, non fermentum diam nisl sit amet erat. Duis semper. Duis arcu massa, scelerisque vitae, consequat in, pretium a, enim. Pellentesque congue. Ut in risus volutpat libero pharetra tempor. Cras vestibulum bibendum augue. Praesent egestas leo in pede. Praesent blandit odio eu enim. Pellentesque sed dui ut augue blandit sodales. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Aliquam nibh. Mauris ac mauris sed pede pellentesque fermentum. Maecenas adipiscing ante non diam sodales hendrerit.'
    }
  }
}