'use server';

import { createPresignedUrlWithClient } from '@/libs/cloudflare';
import { randomUUID } from 'node:crypto';

export const getSignedUrl = async (filename: string, contentType: string) => {
  const fileKey = randomUUID().concat(`_${filename.replace(/ /g, '_')}`);

  const signedUrl = await createPresignedUrlWithClient(fileKey, contentType);

  return { fileId: fileKey, url: signedUrl };
};
