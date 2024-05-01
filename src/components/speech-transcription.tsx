'use client';

import { useTranscription } from '@/hooks/use-transcription';
import { Mic, MicOff } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from './ui/button';

let speechRecognition: SpeechRecognition | null = null;

export const SpeechTranscrition = () => {
  const [isRecording, setIsRecording] = useState(false);
  const { setTranscription, setRecognition, setIsLoading } = useTranscription();

  const handleStartRecording = () => {
    const isSpeechRecognitionAvailable =
      'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;

    if (!isSpeechRecognitionAvailable) {
      alert('Seu navegador não suporta a gravação de áudio nativa!');
      return;
    }

    setIsRecording(true);
    setIsLoading(true);

    const SpeechRecognitionAPI =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    speechRecognition = new SpeechRecognitionAPI();

    speechRecognition.lang = 'pt-BR';
    speechRecognition.continuous = true;
    speechRecognition.maxAlternatives = 1;
    speechRecognition.interimResults = true;

    let recognition = '';

    speechRecognition.onresult = (event) => {
      recognition = Array.from(event.results).reduce((text, result) => {
        return text.concat(result[0]?.transcript || '');
      }, '');

      setRecognition(recognition);
    };

    speechRecognition.onend = () => {
      setRecognition('');
      setTranscription((prev) => {
        return recognition && !prev
          ? recognition
          : recognition && prev
            ? prev.concat(' ', recognition)
            : prev;
      });
    };

    speechRecognition.onerror = () => {
      toast.error('Erro ao gravar áudio!');
    };

    speechRecognition.start();
  };

  const handleStopRecording = () => {
    if (speechRecognition) {
      speechRecognition.stop();
    }
    setIsRecording(false);
    setIsLoading(false);
  };

  return (
    <Button
      size="icon"
      onClick={!isRecording ? handleStartRecording : handleStopRecording}
      title={!isRecording ? 'Gravar e transcrever áudio' : 'Parar gravação e transcrição'}
      className="absolute bottom-0 right-0 mb-3 mr-3 size-10 rounded-full text-foreground focus-visible:ring-foreground data-[recording=true]:bg-red-600 data-[recording=true]:hover:bg-red-600/90"
      data-recording={isRecording}
    >
      {!isRecording ? <Mic /> : <MicOff />}
    </Button>
  );
};
