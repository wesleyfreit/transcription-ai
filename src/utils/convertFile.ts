import { getFFmpeg } from '@/libs/ffmpeg';
import { fetchFile } from '@ffmpeg/util';

export const convertFile = async (file: File) => {
  const ffmpeg = await getFFmpeg();

  const filename =
    file.type === 'audio/mpeg'
      ? 'input.mp3'
      : file.type === 'video/mp4'
        ? 'input.mp4'
        : file.type === 'video/mkv'
          ? 'input.mkv'
          : false;

  if (!filename) {
    throw new Error('Formato de arquivo não suportado.');
  }

  await ffmpeg.writeFile(filename, await fetchFile(file));

  await ffmpeg.exec([
    '-i',
    filename,
    '-map',
    '0:a',
    '-b:a',
    '20k',
    '-acodec',
    'libmp3lame',
    'output.mp3',
  ]);

  const data = await ffmpeg.readFile('output.mp3');

  const audioFileBlob = new Blob([data], { type: 'audio/mpeg' });
  const audioFile = new File([audioFileBlob], 'output.mp3', {
    type: 'audio/mpeg',
  });

  return audioFile;
};
