import crypto from 'crypto';
import { FileData } from '@lib/types';
import { SupabaseClient } from '@supabase/supabase-js';

async function getUploads(supabase: SupabaseClient) {
  const { data, error } = await supabase.from("uploads").select('*');

  console.log(`Uploads data: ${data}`);
  
  if (error) {
    // TODO: Handler error in a meaningful way.
    console.error(`Uploads error: ${error}`);
  }

  return data;
}

async function getNewFileUploads(supabase: SupabaseClient, files: File[]) {
  const hashToFileData: Map<string, FileData> = new Map();

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const buffer = Buffer.from(await file.arrayBuffer());
    const imageHash = hashImage(buffer);

    hashToFileData.set(imageHash, {
      buffer,
      file,
      imageHash
    });
  }

  const { data, error } = await supabase.from("uploads").select('hash').in('hash', Array.from(hashToFileData.keys()));

  if (error) {
    console.error(error); // TODO: Make this better
  }

  data?.forEach(row => hashToFileData.delete(row.hash));

  // TODO: Somehow communicate to the client that some files were not uploaded.

  return Array.from(hashToFileData.values());
}

function hashImage(imageBuffer: Buffer): string {
  const hash = crypto.createHash('sha256');
  hash.update(imageBuffer);

  return hash.digest('hex');
}

export {getUploads, getNewFileUploads}