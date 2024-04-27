import { TranscriptionForm } from "@/components/transcription-form";
import { Textarea } from "@/components/ui/textarea";

export default function Home() {
  return (
    <main className="size-full flex gap-6 p-5">
      <Textarea
        placeholder="Transcrição gerada pela IA..."
        readOnly
        className="flex flex-col flex-1 gap-4 resize-none p-5 leading-relaxed"
      />

      <aside className="w-96">
        <TranscriptionForm />
      </aside>
    </main>
  );
}
