import { useState } from 'react';
import toast from 'react-hot-toast';
import UploadBox from '../components/UploadBox';
import UploadProgressBar from '../components/prescription/UploadProgressBar';
import Button from '../components/common/Button';
import { uploadPrescription } from '../services/prescriptionService';
import { fallbackUploadResult } from '../utils/fallbackData';
import { extractErrorMessage, parseStructuredData } from '../utils/helpers';

function UploadPrescriptionPage() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error('Please select a file before uploading.');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    setIsSuccess(false);

    try {
      await uploadPrescription(selectedFile, (progressEvent) => {
        if (!progressEvent.total) return;
        const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        setUploadProgress(progress);
      });

      setIsSuccess(true);
      setSelectedFile(null);
      toast.success('Prescription uploaded and processed successfully.');
    } catch (err) {
      const message = extractErrorMessage(err, 'Upload failed.');
      toast.error(message);
      setUploadProgress(100);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <section className="space-y-6">
      <div className="rounded-card border border-slate-200 bg-white p-6 shadow-card">
        <h2 className="text-lg font-semibold text-slate-900">Upload Prescription</h2>
        <p className="mt-1 text-sm text-slate-600">
          Upload a prescription image or PDF to extract OCR text and structured medication details.
        </p>

        {isSuccess && !isUploading ? (
          <div className="mt-5 rounded-lg bg-green-50 p-4 text-center">
            <h3 className="text-lg font-medium text-green-800">Image Uploaded Successfully!</h3>
            <p className="mt-2 text-sm text-green-700">You can view the details in your Prescription History.</p>
            <Button className="mt-4" onClick={() => setIsSuccess(false)}>
              Upload Another
            </Button>
          </div>
        ) : (
          <div className="mt-5 space-y-4">
            <UploadBox selectedFile={selectedFile} onFileSelect={setSelectedFile} disabled={isUploading} />

            {isUploading ? <UploadProgressBar progress={uploadProgress} /> : null}

            <div className="flex justify-end">
              <Button onClick={handleUpload} disabled={isUploading || !selectedFile}>
                {isUploading ? 'Processing...' : 'Upload Prescription'}
              </Button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default UploadPrescriptionPage;
