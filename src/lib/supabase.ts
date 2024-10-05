import crypto from 'crypto';
import { createClient } from "@supabase/supabase-js";
import { FileData } from './types';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_PROJECT_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!); // TODO: Add auth later with user keys

async function getUploads() { // TODO: Make this scoped to user after adding auth.
  const { data, error } = await supabase.from("uploads").select('*', {head: true, count: 'exact'});

  console.log(data);

  // TODO: Handler error.

  return data;
}

async function getNewFileUploads(files: File[]) {
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

export {supabase, getUploads, getNewFileUploads}