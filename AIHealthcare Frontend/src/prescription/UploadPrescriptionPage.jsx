import { useState } from 'react';
import toast from 'react-hot-toast';
import UploadBox from '../components/UploadBox';
import StructuredDataView from '../components/StructuredDataView';
import UploadProgressBar from '../components/prescription/UploadProgressBar';
import Button from '../components/common/Button';
import { uploadPrescription } from '../services/prescriptionService';
import { fallbackUploadResult } from '../utils/fallbackData';
import { extractErrorMessage, parseStructuredData } from '../utils/helpers';

function UploadPrescriptionPage() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [extractedText, setExtractedText] = useState('');
  const [structuredData, setStructuredData] = useState(null);

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error('Please select a file before uploading.');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const response = await uploadPrescription(selectedFile, (progressEvent) => {
        if (!progressEvent.total) return;
        const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        setUploadProgress(progress);
      });

      const prescriptionData = response?.prescription || {};
      const ocrText = prescriptionData.extractedText || response?.extractedText || fallbackUploadResult.extractedText;
      const parsedStructuredData =
        parseStructuredData(prescriptionData.structuredData) ||
        parseStructuredData(response?.structuredData) ||
        fallbackUploadResult.structuredData;

      setExtractedText(ocrText);
      setStructuredData(parsedStructuredData);
      toast.success('Prescription uploaded and processed successfully.');
    } catch (err) {
      const message = extractErrorMessage(err, 'Upload failed. Showing fallback extraction output.');
      toast.error(message);

      setExtractedText(fallbackUploadResult.extractedText);
      setStructuredData(fallbackUploadResult.structuredData);
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

        <div className="mt-5 space-y-4">
          <UploadBox selectedFile={selectedFile} onFileSelect={setSelectedFile} disabled={isUploading} />

          {isUploading ? <UploadProgressBar progress={uploadProgress} /> : null}

          <div className="flex justify-end">
            <Button onClick={handleUpload} disabled={isUploading || !selectedFile}>
              {isUploading ? 'Processing...' : 'Upload Prescription'}
            </Button>
          </div>
        </div>
      </div>

      {extractedText ? (
        <section className="rounded-card border border-slate-200 bg-white p-5 shadow-card">
          <h3 className="text-sm font-semibold text-slate-900">Extracted OCR Text</h3>
          <p className="mt-2 whitespace-pre-wrap text-sm text-slate-700">{extractedText}</p>
        </section>
      ) : null}

      {structuredData ? <StructuredDataView data={structuredData} /> : null}
    </section>
  );
}

export default UploadPrescriptionPage;
