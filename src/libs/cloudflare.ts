import { env } from '@/env';
import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl as getCloudflareSignedUrl } from '@aws-sdk/s3-request-presigner';
import { createWriteStream } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pipeline, Readable } from 'node:stream';
import { promisify } from 'node:util';

const pipe = promisify(pipeline);

export const r2 = new S3Client({
  region: 'auto',
  endpoint: env.R2_ENDPOINT,
  credentials: {
    accessKeyId: env.R2_ACCESS_KEY_ID,
    secretAccessKey: env.R2_SECRET_ACCESS_KEY,
  },
});

export const createPresignedUrlWithClient = async (
  fileKey: string,
  contentType: string,
) => {
  const signedUrl = await getCloudflareSignedUrl(
    r2,
    new PutObjectCommand({
      Bucket: env.R2_BUCKET_NAME,
      Key: fileKey,
      ContentType: contentType,
      ACL: 'public-read',
    }),
    {
      expiresIn: 60, // 1min
    },
  );

  if (!signedUrl) {
    throw new Error('Falha ao gerar upload');
  }

  return signedUrl;
};

export const getObject = async (fileKey: string) => {
  const command = new GetObjectCommand({
    Bucket: env.R2_BUCKET_NAME,
    Key: fileKey,
  });

  const data = await r2.send(command);

  if (!data.Body) {
    throw new Error('Falha ao baixar arquivo');
  }

  const readStream = data.Body as Readable;

  const tempFilePath = join(tmpdir(), fileKey);
  const writeStream = createWriteStream(tempFilePath);

  await pipe(readStream, writeStream);

  return tempFilePath;
};

export const deleteObject = async (fileKey: string) => {
  const command = new DeleteObjectCommand({
    Bucket: env.R2_BUCKET_NAME,
    Key: fileKey,
  });

  const data = await r2.send(command);

  if (data.$metadata.httpStatusCode !== 204) {
    throw new Error('Falha ao deletar arquivo');
  }
};
