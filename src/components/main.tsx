'use client';

import { useTranscription } from '@/hooks/use-transcription';
import { TranscriptionForm } from './transcription-form';
import { Textarea } from './ui/textarea';

export const Main = () => {
  const { transcription, setTranscription } = useTranscription();

  return (
    <main className="flex size-full gap-6 p-5">
      <Textarea
        id="transcription"
        placeholder="Transcrição gerada pela AI..."
        readOnly={!transcription}
        className="flex flex-1 resize-none flex-col gap-4 p-5 text-base leading-relaxed tracking-wider antialiased"
        onChange={(e) => setTranscription(e.target.value)}
        value={transcription}
      />

      <aside className="w-96">
        <TranscriptionForm />
      </aside>
    </main>
  );
};
