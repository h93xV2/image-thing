import { z } from "zod";

const ImageAnalysisResultObject = z.object({
  description: z.string(),
  altText: z.string(),
  title: z.string()
});
type ImageAnalysisResult = z.infer<typeof ImageAnalysisResultObject>;

type UploadRow = {
  upload: {
    visionAnalysis: ImageAnalysisResult,
    exifData?: any,
    pinataCid: string
  },
  hash: string
};

type RetrievedUploadRow = UploadRow & {
  created_at: string,
};

type FileData = {
  buffer: Buffer,
  file: File,
  imageHash: string
}

export {ImageAnalysisResultObject, type ImageAnalysisResult, type RetrievedUploadRow, type FileData, type UploadRow}