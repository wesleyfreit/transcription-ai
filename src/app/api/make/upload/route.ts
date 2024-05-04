import { createPresignedUrlWithClient } from '@/libs/cloudflare';
import { randomUUID } from 'node:crypto';
import { z } from 'zod';

const uploadSchema = z.object({
  filename: z.string(),
  contentType: z.string(),
});

export async function POST(request: Request) {
  const { filename, contentType } = uploadSchema.parse(await request.json());

  const fileKey = randomUUID().concat(`_${filename.replace(/ /g, '_')}`);

  const signedUrl = await createPresignedUrlWithClient(fileKey, contentType);

  return Response.json({ fileId: fileKey, url: signedUrl });
}
