'use client';

import { useTranscription } from '@/hooks/use-transcription';
import { SpeechTranscrition } from './speech-transcription';
import { TranscriptionForm } from './transcription-form';
import { Separator } from './ui/separator';
import { Textarea } from './ui/textarea';

export const Main = () => {
  const { transcription, recognition, isLoading, setTranscription } = useTranscription();

  return (
    <main
      className="flex size-full flex-col gap-4 p-5 sm:flex-row sm:gap-0"
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => e.preventDefault()}
    >
      <div className="relative flex w-full">
        <Textarea
          id="transcription"
          placeholder="Transcrição gerada pela AI..."
          readOnly={isLoading}
          className="flex h-96 flex-1 resize-none p-5 text-base leading-relaxed tracking-wider antialiased sm:h-full sm:rounded-r-none"
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

      <aside className="w-full rounded-md sm:w-80 sm:min-w-80 sm:rounded-l-none sm:border sm:border-l-0 sm:p-5">
        <TranscriptionForm />
      </aside>
    </main>
  );
};
