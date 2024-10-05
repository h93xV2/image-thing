'use client';

import { ImageAnalysisResult, UploadRow } from "@/lib/types";
import FileUpload from "@components/ui/file-upload";
import UploadsTable from "@components/ui/uploads-table";
import { useEffect, useState } from "react";

type Upload = {
  created_at: string
  upload: {
    visionAnalysis: ImageAnalysisResult,
  }
};

export default function Home() {  
  const [uploads, setUploads] = useState<UploadRow[]>([]);

  useEffect(() => {
    fetch('/api/upload').then(response => {
      response.json().then(data => {
        const uploads: UploadRow[] = data.map((upload: Upload) => {
          return {
            createdAt: upload['created_at'],
            ...upload['upload']['visionAnalysis']
          }
        });

        console.log(uploads);

        setUploads(uploads);
      });
    });
  }, []);

  return (
    <div>
      <FileUpload />
      <UploadsTable data={uploads} />
    </div>
  );
}
