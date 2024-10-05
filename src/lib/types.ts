import { z } from "zod";

const ImageAnalysisResultObject = z.object({
  description: z.string(),
  altText: z.string(),
  title: z.string()
});
type ImageAnalysisResult = z.infer<typeof ImageAnalysisResultObject>;

type UploadRow = ImageAnalysisResult & {
  createdAt: string,
};

export {ImageAnalysisResultObject, type ImageAnalysisResult, type UploadRow}