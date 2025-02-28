'use client';

import { transcribe } from '@/actions/transcribe';
import { Spinner } from '@/components/spinner';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { useTranscription } from '@/hooks/use-transcription';
import { convertFile } from '@/utils/convert-file';
import { splitFile } from '@/utils/split-file';
import { CheckCircle, Music, Upload, Wand2, X, XCircle } from 'lucide-react';
import type { ChangeEvent, DragEvent, MouseEvent } from 'react';
import { useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';

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

  const { setTranscription, setIsLoading } = useTranscription();

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

  const handleDragOverFile = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
  };

  const handleDropFile = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();

    const { files } = event.dataTransfer;

    if (!files?.length) {
      setFile(file);
      return;
    }

    if (files[0].type !== 'audio/mpeg' && !files[0].type.includes('video')) {
      toast.error('Tipo de arquivo não suportado.');
      return;
    }

    const selectedFile = files[0];
    setFile(selectedFile);

    event.dataTransfer.clearData();
  };

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

    if (!file) {
      toast.error('Selecione um arquivo para transcrever.');
      return;
    }

    try {
      setStatus('converting');
      setIsLoading(true);

      const audioFile = await convertFile(file);

      const splitAudioFiles = await splitFile(audioFile);

      setStatus('generating');

      await Promise.all(
        splitAudioFiles.map(async (file) => {
          const formData = new FormData();

          formData.append('file', file);
          formData.append('model', 'assembly-ai');
          formData.append('temperature', temperature.toString());

          if (prompt) {
            formData.append('prompt', prompt);
          }

          const { text: transcription } = await transcribe(formData);

          if (transcription) {
            setTranscription((prev) =>
              !prev ? transcription || '' : prev.concat(' ', transcription),
            );
          }
        }),
      );

      setFile(undefined);
      promptInputRef.current!.value = '';

      setStatus('success');
    } catch (error) {
      setStatus('error');

      if (error instanceof Error) {
        toast.error(error.message);
      }
    } finally {
      setTimeout(() => setStatus('waiting'), 4000);
      setIsLoading(false);
    }
  };

  return (
    <form className="mb-5 space-y-5">
      <div>
        <input
          type="file"
          name="file"
          id="file"
          accept=".mp4,.mp3,.mkv"
          className="peer sr-only"
          onChange={handleFileSelected}
          disabled={status != 'waiting'}
        />

        <label
          htmlFor="file"
          className="flex aspect-video cursor-pointer flex-col items-center justify-center gap-2 rounded-md border border-dashed text-sm text-muted-foreground duration-300 hover:bg-primary/5 peer-focus:ring-1 peer-focus:ring-primary peer-focus:transition-none data-[disabled=true]:cursor-not-allowed data-[disabled=true]:hover:bg-transparent"
          data-disabled={status !== 'waiting'}
          title="Selecione ou arraste e solte um arquivo"
          onDragOver={handleDragOverFile}
          onDrop={handleDropFile}
        >
          {previewUrl ? (
            <div className="relative w-full flex-1">
              <video
                src={previewUrl}
                controls={false}
                className="pointer-events-none aspect-video rounded-md object-cover"
              />
              <button
                className="absolute right-0 top-0 mr-2 mt-2 rounded-full bg-secondary p-0.5 text-foreground outline-none transition-all hover:bg-primary focus-visible:ring-1 focus-visible:ring-primary disabled:pointer-events-none"
                title="Remover arquivo"
                disabled={status !== 'waiting'}
                onClick={(e) => {
                  e.preventDefault();
                  setFile(undefined);
                }}
              >
                <X className="size-5" />
              </button>
            </div>
          ) : file?.type === 'audio/mpeg' ? (
            <div className="relative flex w-full flex-1 items-center justify-center">
              <Music className="size-8" />
              <button
                className="absolute right-0 top-0 mr-2 mt-2 rounded-full bg-secondary p-0.5 text-foreground outline-none transition-all hover:bg-primary focus-visible:ring-1 focus-visible:ring-primary disabled:pointer-events-none"
                title="Remover arquivo"
                disabled={status !== 'waiting'}
                onClick={(e) => {
                  e.preventDefault();
                  setFile(undefined);
                }}
              >
                <X className="size-5" />
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 p-5">
              <Upload className="size-8" />
              <span className="w-52 text-center">
                Selecione ou arraste e solte um arquivo
              </span>

              <span className="text-center text-xs italic text-slate-700">
                Tipos de arquivos suportados: .mp4, .mkv, .mp3
              </span>

              <span className="text-center text-xs italic text-slate-700">
                Idiomas suportados: Português
              </span>
            </div>
          )}
        </label>
      </div>

      <Separator />

      <div className="space-y-2">
        <Label htmlFor="prompt">Prompt</Label>

        <Textarea
          ref={promptInputRef}
          id="prompt"
          className="h-20 resize-none leading-relaxed"
          placeholder="Inclua palavras chave mencionadas no vídeo separadas por vírgula (,)"
          disabled={status !== 'waiting'}
        />

        <span className="block text-xs italic leading-relaxed text-slate-700">
          (O modelo AssemblyAI não utiliza prompt para gerar resultados).
        </span>
      </div>

      <div className="space-y-2">
        <Label htmlFor="model">Modelo</Label>

        <Select
          name="model-select"
          defaultValue="assembly-ai"
          disabled={status !== 'waiting'}
        >
          <SelectTrigger id="model">
            <SelectValue>AssemblyAI Speech to Text</SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="assembly-ai">AssemblyAI Speech to Text</SelectItem>
            <SelectItem value="whisper-1" disabled>
              GPT Whisper-1 <span className="italic">(desativado por enquanto)</span>
            </SelectItem>
          </SelectContent>
        </Select>

        <span className="block text-xs italic text-slate-700">
          Modelo de transcrição de áudio padrão.
        </span>
      </div>

      <div className="space-y-4">
        <Label className="space-y-4 flex flex-col items-start">
          <span>Temperatura</span>

          <Slider
            disabled={status !== 'waiting'}
            name="temperature"
            min={0}
            max={1}
            step={0.1}
            value={[temperature]}
            onValueChange={(value) =>
              setTemperature(value[0] !== undefined ? value[0] : temperature)
            }
          >
            <Slider />
          </Slider>
        </Label>

        <span className="block text-xs italic leading-relaxed text-slate-700">
          Valores mais elevados tender a deixar o resultado mais criativo, mas também mais
          propenso a erros. (O modelo AssemblyAI não utiliza temperatura para gerar
          resultados).
        </span>
      </div>

      <Separator />

      <Button
        type="submit"
        variant="default"
        onClick={handleSubmit}
        data-success={status === 'success'}
        data-error={status === 'error'}
        disabled={status !== 'waiting'}
        className="w-full focus-visible:ring-foreground disabled:pointer-events-none data-[error=true]:bg-red-600 data-[success=true]:bg-green-600 cursor-pointer"
      >
        {status === 'waiting' ? (
          <>
            {formStatusMessages.waiting}
            <Wand2 className="size-4" />
          </>
        ) : status === 'success' ? (
          <>
            {formStatusMessages.success}
            <CheckCircle className="size-4" />
          </>
        ) : status === 'error' ? (
          <>
            {formStatusMessages.error}
            <XCircle className="size-4" />
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
};
