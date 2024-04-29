"use client";

import { transcribe } from "@/actions/transcribe";
import { convertFile } from "@/utils/convertFile";
import { CheckCircle, Music, Upload, Wand2, X, XCircle } from "lucide-react";
import { ChangeEvent, MouseEvent, useMemo, useRef, useState } from "react";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Select, SelectTrigger, SelectValue } from "./ui/select";
import { Separator } from "./ui/separator";
import { Slider } from "./ui/slider";
import { Spinner } from "./ui/spinner";
import { Textarea } from "./ui/textarea";
import { useTranscription } from "@/hooks/use-transcription";
import { toast } from "sonner";

type IStatus = 'waiting' | 'converting' | 'generating' | 'success' | 'error';

export const formStatusMessages = {
  waiting: 'Executar transcrição',
  converting: 'Convertendo arquivo...',
  generating: 'Transcrevendo áudio...',
  success: 'Sucesso!',
  error: 'Ocorreu um erro, tente novamente.',
};

export const TranscriptionForm = () => {
  const [file, setFile] = useState<File | undefined>();
  const [temperature, setTemperature] = useState(0);
  const [status, setStatus] = useState<IStatus>('waiting');

  const { setTranscription } = useTranscription();
  
  const promptInputRef = useRef<HTMLTextAreaElement>(null);

  const previewUrl = useMemo(() => {
    if (!file) {
      return undefined;
    }

    if (file.type === 'audio/mpeg') {
      return undefined;
    }

    return URL.createObjectURL(file);
  }, [file]);

  const handleFileSelected = (event: ChangeEvent<HTMLInputElement>) => {
    const { files } = event.currentTarget;

    if (!files?.length) {
      setFile(file);
      return;
    }

    const selectedFile = files[0];
    setFile(selectedFile);

    event.currentTarget.value = '';
  };

  const handleSubmit = async (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    const prompt = promptInputRef.current?.value;

    if (!file || !prompt) {
      if (!file) {
        toast.error('Selecione um arquivo para transcrever.');
      }

      if (!prompt) {
        toast.error('Informe palavras chave para transcrição.');
      }

      return;
    }
    
    try {
      setTranscription('');

      setStatus('converting');
      
      const audioFile = await convertFile(file);
      
      setStatus('generating');

      const formData = new FormData();  

      formData.set('file', audioFile);
      formData.append('prompt', prompt);
      formData.append('temperature', temperature.toString());

      const transcription = await transcribe(formData);

      if(transcription) {
        setTranscription(transcription.text);

        setFile(undefined);
        promptInputRef.current!.value = '';

        setStatus('success');
        setTimeout(() => setStatus('waiting'), 4000);
      }
    } catch (error) {
      setStatus('error');
      setTimeout(() => setStatus('waiting'), 4000);

      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  };

  return (
    <form className="space-y-4">
      <label
        htmlFor="file"
        className="border flex rounded-md aspect-video cursor-pointer border-dashed text-sm flex-col gap-2 items-center justify-center text-muted-foreground duration-300 hover:bg-primary/5"
        title="Selecionar arquivo de video ou áudio"
      >
        {previewUrl ? (
          <div className="relative flex-1 w-full">
            <video
              src={previewUrl}
              controls={false}
              className="pointer-events-none rounded-md aspect-video object-cover"
            />
            <button 
              className="absolute right-0 top-0 transition-all mr-2 mt-2 p-0.5 bg-secondary rounded-full text-foreground hover:bg-primary"
              title="Remover arquivo"
              onClick={(e) => {
                  e.preventDefault(); 
                  setFile(undefined)
                }
              }
            >
              <X className="size-5" />
            </button>
          </div>
        ) : file?.type === 'audio/mpeg' ? (
          <div className="relative flex flex-1 w-full items-center justify-center">
            <Music className="w-8 h-8" />
            <button 
              className="absolute right-0 top-0 transition-all mr-2 mt-2 p-0.5 bg-secondary rounded-full text-foreground hover:bg-primary"
              title="Remover arquivo"
              onClick={(e) => {
                  e.preventDefault(); 
                  setFile(undefined)
                }
              }
            >
              <X className="size-5" />
            </button>
          </div>
        ) : (
          <>
            <Upload className="w-8 h-8" />
            <span className="text-center w-52">Selecione um arquivo de video ou áudio</span>
            <span className="text-xs italic text-slate-700">Tipos de arquivos suportados: .mp4, .mkv, .mp3</span>
          </>
        )}
      </label>

      <input
        type="file"
        name="file"
        id="file"
        accept=".mp4,.mp3,.mkv"
        className="sr-only"
        onChange={handleFileSelected}
        disabled={status != 'waiting'}
      />

      <Separator />

      <div className="space-y-2">
        <Label htmlFor="prompt">Prompt</Label>

        <Textarea
          ref={promptInputRef}
          id="prompt"
          className="h-20 leading-relaxed resize-none"
          placeholder="Inclua palavras chave mencionadas no vídeo separadas por vírgula (,)"
          disabled={status !== 'waiting'}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="model">Modelo</Label>

        <Select
        name="model-select"
        defaultValue="whispper-1"
        disabled
      >
        <SelectTrigger id="model">
          <SelectValue>Whisper-1</SelectValue>
        </SelectTrigger>
      </Select>

        <span className="block italic text-xs text-slate-700">
          Modelo de transcrição de áudio padrão.
        </span>
      </div>

      <div className="space-y-4">
        <Label className="space-y-4">
          <span>Temperatura</span>
          
          <Slider
            name="temperature"
            min={0}
            max={1}
            step={0.1}
            value={[temperature]}
            onValueChange={(value) => setTemperature(value[0] !== undefined ? value[0] : temperature)}
          >
            <Slider />
          </Slider>
        </Label>

        <span className="block italic text-xs text-slate-700 leading-relaxed">
          Valores mais elevados tender a deixar o resultado mais criativo, mas também mais
          propenso a erros.
        </span>
      </div>

      <Separator />

      <Button
        type="submit"
        onClick={handleSubmit}
        data-success={status === 'success'}
        data-error={status === 'error'}
        disabled={status !== 'waiting'}
        className={
          'w-full data-[success=true]:bg-green-600 data-[error=true]:bg-red-600 disabled:pointer-events-none disabled:bg-primary/90'
        }
      >
        {status === 'waiting' ? (
          <>
            {formStatusMessages.waiting}
            <Wand2 className="w-4 h-4 ml-2" />
          </>
        ) : status === 'success' ? (
          <>
            {formStatusMessages.success}
            <CheckCircle className="w-4 h-4 ml-2" />
          </>
        ) : status === 'error' ? (
          <>
            {formStatusMessages.error}
            <XCircle className="w-4 h-4 ml-2" />
          </>
        ) : (
          <>
            {formStatusMessages[status]}
            <Spinner />
          </>
        )}
      </Button>
    </form>
  );
}