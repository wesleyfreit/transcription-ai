'use client';

import { ReactNode, createContext, useState } from 'react';

export interface TranscriptionContextProps {
  transcription: string | undefined;
  setTranscription: (user: string) => void;
}

export const TranscriptionContext = createContext<TranscriptionContextProps>({} as TranscriptionContextProps);

export const TranscriptionProvider = ({ children }: { children: ReactNode }) => {
  const [transcription, setTranscription] = useState<string | undefined>();

  return (
    <TranscriptionContext.Provider
      value={{
        transcription,
        setTranscription,
      }}
    >
      {children}
    </TranscriptionContext.Provider>
  );
};
