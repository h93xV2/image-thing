import { Alert, AlertDescription, AlertTitle } from '@components/ui/alert';
import { LoaderCircle, CircleCheckBig, AlertCircle, AlertTriangle } from 'lucide-react'; 

type UploadStatus = 'idle' | 'uploading' | 'success' | 'error' | 'warning';

type Props = {
  uploadStatus: UploadStatus,
  errorMessage: string,
  warningMessage: string
};

function UploadStatusBox({uploadStatus, errorMessage, warningMessage}: Props) {
  return (
    <>
      <div className="mt-4">
          {uploadStatus === 'uploading' && (
            <Alert className="bg-blue-50 text-blue-700 flex items-center">
              <LoaderCircle className="animate-spin mr-2 h-5 w-5" />
              <div>
                <AlertTitle>Uploading</AlertTitle>
                <AlertDescription>Your files are being uploaded...</AlertDescription>
              </div>
            </Alert>
          )}

          {uploadStatus === 'success' && (
            <Alert className="bg-green-50 text-green-700 flex items-center">
              <CircleCheckBig className="mr-2 h-5 w-5" />
              <div>
                <AlertTitle>Success</AlertTitle>
                <AlertDescription>Your files were uploaded successfully.</AlertDescription>
              </div>
            </Alert>
          )}

          {uploadStatus === 'error' && (
            <Alert className="bg-red-50 text-red-700 flex items-center">
              <AlertCircle className="mr-2 h-5 w-5" />
              <div>
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{errorMessage}</AlertDescription>
              </div>
            </Alert>
          )}

          {uploadStatus === 'warning' && (
            <Alert className="bg-yellow-50 text-yellow-700 flex items-center">
              <AlertTriangle className="mr-2 h-5 w-5" />
              <div>
                <AlertTitle>Warning</AlertTitle>
                <AlertDescription>{warningMessage}</AlertDescription>
              </div>
            </Alert>
          )}
        </div>
    </>
  );
}

export {UploadStatusBox, type UploadStatus}