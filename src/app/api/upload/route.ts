import * as tmp from "tmp";
import * as fs from "fs";
import path from "path";
import exifr from "exifr";
import { NextResponse } from "next/server";
import { getVisionAnalysisResult } from "@/lib/openai";
import { getNewFileUploads, supabase } from "@/lib/supabase";
import pinata from "@/lib/pinata";
import { UploadRow } from "@/lib/types";

export async function POST(request: Request) {
  const formData = await request.formData();
  const files: File[] = formData.getAll('files').filter(file => file instanceof File);
  const tmpDir = tmp.dirSync({ unsafeCleanup: true });
  const uploadResults = [];

  console.log(`tmpDir ${tmpDir.name}`);

  const newFiles = await getNewFileUploads(files);

  for (let i = 0; i < newFiles.length; i++) {
    const {file, buffer, imageHash} = newFiles[i];
    const upload = await pinata.upload.file(file); // TODO: Handle exceptions and prevent reuploading
    const type = file.type; // TODO: Validate this is an image. Ex: image/jpeg
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
      hash
    };
  });
  const { data, error } = await supabase.from("uploads").insert(rows);

  console.log(data);
  console.error(error);

  // TODO: Rollback uploads from Pinata if DB insert fails.

  tmpDir.removeCallback();

  return NextResponse.json(uploadResults);
}