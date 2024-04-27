import { Captions, Upload, Wand2 } from "lucide-react";
import { Separator } from "./ui/separator";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Slider } from "./ui/slider";
import { Select, SelectTrigger, SelectValue } from "./ui/select";

export const TranscriptionForm = () => {
  return (
  <form className="space-y-4">
      <label
        htmlFor="file"
        className="border flex rounded-md aspect-video cursor-pointer border-dashed text-sm flex-col gap-2 items-center justify-center text-muted-foreground duration-300 hover:bg-primary/5"
        title="Selecionar arquivo de video ou áudio"
      >
        <Upload className="w-8 h-8" />
        <span className="text-center w-52">Selecione ou arraste e solte um arquivo de video ou áudio</span>

        <span className="text-xs italic text-slate-700">Tipos de arquivos suportados: .mp4, .mp3</span>
      </label>

      <input
        type="file"
        name="file"
        id="file"
        accept=".mp4 .mp3"
        className="sr-only"
      />

      <Separator />

      <div className="space-y-2">
        <Label>Modelo</Label>

        <Select
        defaultValue="whispper-1"
        disabled
      >
        <SelectTrigger>
          <SelectValue>Whisper-1</SelectValue>
        </SelectTrigger>
      </Select>

        <span className="block italic text-xs text-slate-700">
          Modelo de transcrição de áudio padrão.
        </span>
      </div>

      <Separator />

      <div className="space-y-4">
        <Label>Temperatura</Label>

        <Slider 
          min={0}
          max={1}
          step={0.1}
        >
          <Slider />
        </Slider>

        <span className="block italic text-xs text-slate-700 leading-relaxed">
          Valores mais elevados tender a deixar o resultado mais criativo, mas também mais
          propenso a erros.
        </span>
      </div>

      <Separator />

      <Button
        type="submit"
        className={
          'w-full data-[success=true]:bg-green-600 data-[error=true]:bg-red-600 data-[disabled=true]:pointer-events-none'
        }
      >
        Executar transcrição
        <Wand2 className="w-4 h-4 ml-2" />
      </Button>
    </form>
  );
}