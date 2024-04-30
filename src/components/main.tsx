'use client';

import { useTranscription } from "@/hooks/use-transcription";
import { TranscriptionForm } from "./transcription-form";
import { Textarea } from "./ui/textarea";

export const Main = () => {
  const { transcription, setTranscription } = useTranscription();

  return (
    <main className="size-full flex gap-6 p-5">
      <Textarea
        id="transcription"
        placeholder="Transcrição gerada pela AI..."
        readOnly={!transcription}
        className="flex flex-col flex-1 gap-4 resize-none p-5 leading-relaxed tracking-wider text-base antialiased"
        onChange={(e) => setTranscription(e.target.value)}
        value={transcription}
      />

      <aside className="w-96">
        <TranscriptionForm />
      </aside>
    </main>
  );
}