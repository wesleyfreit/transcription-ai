'use client';

import type { Dispatch, ReactNode, SetStateAction } from 'react';
import { createContext, useState } from 'react';

export interface TranscriptionContextProps {
  transcription: string;
  recognition: string;
  isLoading: boolean;
  setTranscription: Dispatch<SetStateAction<string>>;
  setRecognition: Dispatch<SetStateAction<string>>;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
}

export const TranscriptionContext = createContext<TranscriptionContextProps>(
  {} as TranscriptionContextProps,
);

export const TranscriptionProvider = ({ children }: { children: ReactNode }) => {
  const [transcription, setTranscription] = useState('');
  const [recognition, setRecognition] = useState('');

  const [isLoading, setIsLoading] = useState(false);

  return (
    <TranscriptionContext.Provider
      value={{
        transcription,
        recognition,
        isLoading,
        setTranscription,
        setRecognition,
        setIsLoading,
      }}
    >
      {children}
    </TranscriptionContext.Provider>
  );
};
