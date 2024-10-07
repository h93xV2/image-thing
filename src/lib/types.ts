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
  hash: string,
  user_id: string
};

type RetrievedUploadRow = UploadRow & {
  created_at: string,
  id: number
};

type FileData = {
  buffer: Buffer,
  file: File,
  imageHash: string
}

type DeleteRequest = {
  pinataCids: string[]
};

export {
  ImageAnalysisResultObject,
  type ImageAnalysisResult,
  type RetrievedUploadRow,
  type FileData,
  type UploadRow,
  type DeleteRequest
}