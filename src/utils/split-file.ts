import { getFFmpeg } from '@/libs/ffmpeg';
import { fetchFile } from '@ffmpeg/util';

export const splitFile = async (file: File) => {
  const ffmpeg = await getFFmpeg();

  if (file.type !== 'audio/mpeg') {
    throw new Error('Formato de arquivo não suportado.');
  }

  await ffmpeg.writeFile('input.mp3', await fetchFile(file));

  const splitAudioFiles: File[] = [];

  await ffmpeg.exec([
    '-i',
    'input.mp3',
    '-f',
    'segment',
    '-segment_time',
    '180',
    '-g',
    '9',
    '-sc_threshold',
    '0',
    '-force_key_frames',
    'expr:gte(t,n_forced*9)',
    '-reset_timestamps',
    '1',
    '-map',
    '0',
    'output_%d.mp3',
  ]);

  for (let i = 0; i < i + 1; i++) {
    try {
      const data = await ffmpeg.readFile(`output_${i}.mp3`);

      const audioFileBlob = new Blob([data], { type: 'audio/mpeg' });
      const audioFile = new File([audioFileBlob], `output_${i}.mp3`, {
        type: 'audio/mpeg',
      });

      splitAudioFiles.push(audioFile);
    } catch (error) {
      break;
    }
  }

  return splitAudioFiles;
};
