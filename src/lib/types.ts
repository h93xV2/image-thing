import { z } from "zod";

const ImageAnalysisResultObject = z.object({
  altText: z.string(),
  caption: z.string()
});
type ImageAnalysisResult = z.infer<typeof ImageAnalysisResultObject>;

type UploadRow = {
  upload: {
    visionAnalysis: ImageAnalysisResult,
    fileName: string
  },
  hash: string,
  user_id: string,
  is_pinned: boolean,
  pinata_cid_private: string,
  pinata_id: string,
  pinata_cid_public?: string
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
  ids: number[]
};

type PreviewRequest = {
  pinataCid: string
};

type PinRequest = {
  id: number
};

export {
  ImageAnalysisResultObject,
  type ImageAnalysisResult,
  type RetrievedUploadRow,
  type FileData,
  type UploadRow,
  type DeleteRequest,
  type PreviewRequest,
  type PinRequest
}