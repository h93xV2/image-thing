import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod.mjs";
import { PinataSDK } from "pinata";
import * as tmp from "tmp";
import * as fs from "fs";
import path from "path";
import exifr from "exifr";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { ImageAnalysisResultObject } from "@/lib/types";

const pinata = new PinataSDK({
  pinataJwt: process.env.PINATA_JWT,
  pinataGateway: process.env.PINATA_GATEWAY,
});
const openAi = new OpenAI({
  apiKey: process.env['OPENAI_API_KEY'], // This is the default and can be omitted
});
const supabase = createClient(process.env.SUPABASE_PROJECT_URL!, process.env.SUPABASE_ANON_KEY!); // TODO: Add auth later with user keys

export async function POST(request: Request) {
  const formData = await request.formData();
  const files: File[] = formData.getAll('files').filter(file => file instanceof File);
  const tmpDir = tmp.dirSync({ unsafeCleanup: true });
  const uploadResults = [];

  console.log(`tmpDir ${tmpDir.name}`);

  for (let i = 0; i < files.length; i ++) {
    // TODO: Check if file already uploaded. Use some kind of hash/cache.
    const file = files[i];
    const upload = await pinata.upload.file(file); // TODO: Handle exceptions
    const buffer = Buffer.from(await file.arrayBuffer());
    const type = file.type; // TODO: Validate this is an image. Ex: image/jpeg
    const tempFilePath = path.join(tmpDir.name, file.name);

    fs.writeFileSync(tempFilePath, buffer);

    console.log(`Temp file path: ${tempFilePath}`);

    const exifData = await exifr.parse(tempFilePath); // TODO: Orientation and rotation check before passing to openai.

    console.log(`EXIF data: ${exifData}`);

    const visionResult = await openAi.beta.chat.completions.parse({
      "model": "gpt-4o",
      messages: [
        {
          "role": "user",
          "content": [
            {
              "type": "text",
              "text": "Create a title, description, and alt text for this image"
            },
            {
              "type": "image_url",
              "image_url": {
                "url": `data:${type};base64,${buffer.toString('base64')}`
              }
            }
          ]
        }
      ],
      response_format: zodResponseFormat(ImageAnalysisResultObject, "image_analysis_result")
    });

    const visionResultParsed = visionResult.choices[0].message.parsed;

    uploadResults.push({
      visionAnalysis: visionResultParsed,
      exifData,
      pinataCid: upload.cid
    });
  }

  const rows = uploadResults.map(result => {
    return {
      upload: result,
      hash: "qwerty"
    };
  });
  const {data, error} = await supabase.from("uploads").insert(rows);

  console.log(data);
  console.error(error);

  // TODO: Rollback uploads from Pinata if DB insert fails.

  tmpDir.removeCallback();

  return NextResponse.json(uploadResults);
}

export async function GET() {
  const { data, error } = await supabase.from("uploads").select();

  console.log(data);
  console.error(error);

  return NextResponse.json(data);
}