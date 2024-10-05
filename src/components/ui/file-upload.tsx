"use client";

import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Card, CardHeader, CardContent } from '@components/ui/card';
import { UploadStatus, UploadStatusBox } from './upload-status';

function FileUpload() {
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const formData = new FormData();

      acceptedFiles.forEach(file => formData.append('files', file));

      setUploadStatus('uploading');

      fetch('/api/upload', {
        method: 'POST',
        body: formData
      }).then(async (response) => {
        if (!response.ok) {
          const errorData = await response.json();

          if (errorData) throw new Error(errorData.message);
          
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log(data);
        setUploadStatus('success');
      })
      .catch(error => {
        console.error("Error fetching data:", error);
        setUploadStatus('error');
        setErrorMessage(error.message);
      });
    },
    []
  );

  const { getRootProps, getInputProps, isDragActive, acceptedFiles } = useDropzone({ onDrop });

  const files = acceptedFiles.map((file) => (
    <li key={file.path} className="text-sm">
      {file.path} - {file.size} bytes
    </li>
  ));

  return (
    <Card className="max-w-lg mx-auto mt-10">
      <CardHeader>
        <h2 className="text-xl font-bold">Upload Files</h2>
      </CardHeader>
      <CardContent>
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-md p-6 text-center cursor-pointer ${
            isDragActive ? 'border-blue-500' : 'border-gray-300'
          }`}
        >
          <input {...getInputProps()} onClick={() => setUploadStatus('idle')} />
          {isDragActive ? (
            <p className="text-blue-500">Drop the files here ...</p>
          ) : (
            <p className="text-gray-500">
              Drag & drop some files here, or click to select files
            </p>
          )}
        </div>
        {files.length > 0 && (
          <aside className="mt-4">
            <h4 className="font-medium">Files:</h4>
            <ul>{files}</ul>
          </aside>
        )}

        <UploadStatusBox uploadStatus={uploadStatus} errorMessage={errorMessage} />
      </CardContent>
    </Card>
  );
}

export default FileUpload;