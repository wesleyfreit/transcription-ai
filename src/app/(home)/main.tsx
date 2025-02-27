'use client';

import { useTranscription } from '@/hooks/use-transcription';
import { Separator } from '../../components/separator';
import { Textarea } from '../../components/textarea';
import { SpeechTranscrition } from './speech-transcription';
import { TranscriptionForm } from './transcription-form';

export const Main = () => {
  const { transcription, recognition, isLoading, setTranscription } = useTranscription();

  return (
    <main
      className="flex size-full flex-col gap-4 p-5 sm:flex-row"
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => e.preventDefault()}
    >
      <div className="relative flex w-full">
        <Textarea
          id="transcription"
          placeholder="Transcrição gerada pela AI..."
          readOnly={isLoading}
          className="flex h-96 flex-1 resize-none p-5 text-base leading-relaxed tracking-wider antialiased sm:h-full"
          onChange={(e) => setTranscription(e.target.value)}
          value={
            recognition && !transcription
              ? recognition
              : recognition && transcription
                ? transcription.concat(' ', recognition)
                : transcription
          }
        />
        <SpeechTranscrition />
      </div>

      <Separator className="sm:hidden" />

      <aside className="w-full sm:max-w-96">
        <TranscriptionForm />
      </aside>
    </main>
  );
};
