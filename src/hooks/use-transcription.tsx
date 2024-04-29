import { useContext } from 'react';
import { TranscriptionContext } from '../contexts/transcription';

export const useTranscription = () => {
  const context = useContext(TranscriptionContext);

  return context;
};
