import OpenAI from "openai";
import { ImageAnalysisResultObject } from "./types";
import { zodResponseFormat } from "openai/helpers/zod.mjs";

const openAi = new OpenAI({
  apiKey: process.env['OPENAI_API_KEY'],
});

async function getVisionAnalysisResult(imageType: string, buffer: Buffer) {
  const visionResult = await openAi.beta.chat.completions.parse({
    "model": "gpt-4o",
    messages: [
      {
        "role": "user",
        "content": [
          {
            "type": "text",
            "text": "Create an alt text and short caption for this image"
          },
          {
            "type": "image_url",
            "image_url": {
              "url": `data:${imageType};base64,${buffer.toString('base64')}`
            }
          }
        ]
      }
    ],
    response_format: zodResponseFormat(ImageAnalysisResultObject, "image_analysis_result")
  });

  const visionResultParsed = visionResult.choices[0].message.parsed;

  return visionResultParsed;
}

export { getVisionAnalysisResult }