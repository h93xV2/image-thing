import * as tmp from "tmp";
import * as fs from "fs";
import path from "path";
import exifr from "exifr";
import { NextResponse } from "next/server";
import { getVisionAnalysisResult } from "@lib/openai";
import { getNewFileUploads } from "@lib/supabase";
import pinata from "@lib/pinata";
import { DeleteRequest, UploadRow } from "@lib/types";
import { createClient } from "@lib/supabase/server";

const validImageTypes = new Set(['image/jpeg', 'image/png', 'image/avif']);

export async function POST(request: Request) {
  const supabase = createClient();
  const userResponse = await supabase.auth.getUser();

  if (userResponse.error || !userResponse.data?.user) {
    return NextResponse.json({ message: 'User is not signed in' }, { status: 401 });
  }

  const userId = userResponse.data.user.id;
  const formData = await request.formData();
  const files: File[] = formData.getAll('files').filter(file => file instanceof File);
  const tmpDir = tmp.dirSync({ unsafeCleanup: true });
  const uploadResults = [];

  console.log(`tmpDir ${tmpDir.name}`);

  let newFiles = await getNewFileUploads(supabase, files);
  newFiles = newFiles.filter(newFile => validImageTypes.has(newFile.file.type));

  for (let i = 0; i < newFiles.length; i++) {
    const {file, buffer, imageHash} = newFiles[i];
    const upload = await pinata.upload.file(file); // TODO: Handle exceptions
    const type = file.type;
    const tempFilePath = path.join(tmpDir.name, file.name);

    fs.writeFileSync(tempFilePath, buffer);

    console.log(`Temp file path: ${tempFilePath}`);

    const exifData = await exifr.parse(tempFilePath); // TODO: Orientation and rotation check before passing to openai.

    console.log(`EXIF data: ${exifData}`);

    const visionResult = await getVisionAnalysisResult(type, buffer);

    if (!visionResult) {
      throw new Error('No analysis');
    }

    uploadResults.push({
      visionAnalysis: visionResult,
      exifData,
      pinataCid: upload.cid,
      hash: imageHash
    }); // TODO: Add preview URL with Pinata gateway
  }

  const rows: UploadRow[] = uploadResults.map(result => {
    const {hash, ...resultFields} = result;
    return {
      upload: resultFields,
      hash,
      user_id: userId
    };
  });
  const { data, error } = await supabase.from("uploads").insert(rows);

  console.log(`Upload data: ${data}`);
  console.error(`Upload error: ${error}`);

  // TODO: Rollback uploads from Pinata if DB insert fails.

  tmpDir.removeCallback();

  // TODO: If zero files were uploaded then an error code should be returned.
  return NextResponse.json({
    uploadedFilesCount: rows.length,
    filesCount: files.length
  });
}

export async function DELETE(request: Request) {
  const supabase = createClient();
  const userResponse = await supabase.auth.getUser();

  if (userResponse.error || !userResponse.data?.user) {
    return NextResponse.json({ message: 'User is not signed in' }, { status: 401 });
  }

  const { pinataCids }: DeleteRequest = await request.json();

  const deletedFiles = await pinata.files.delete(pinataCids);

  console.log(`Pinata deleted files: ${JSON.stringify(deletedFiles)}`);

  const {data, error} = await supabase.from('uploads').delete().in('upload->>pinataCid', pinataCids);

  if (error) {
    console.error(`Supabase delete error: ${JSON.stringify(error)}`); // TODO: Handle this better
  }

  console.log(`Supabase delete data: ${data}`)

  return new Response();
}