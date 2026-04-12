import { useEffect, useRef, useState } from 'react';

function UploadBox({ selectedFile, onFileSelect, disabled = false }) {
  const [isDragging, setIsDragging] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (!selectedFile) {
      setPreviewUrl('');
      return;
    }

    if (selectedFile.type.startsWith('image/')) {
      const objectUrl = URL.createObjectURL(selectedFile);
      setPreviewUrl(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    }

    setPreviewUrl('');
    return undefined;
  }, [selectedFile]);

  const handleDragOver = (event) => {
    event.preventDefault();
    if (disabled) return;
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);
    if (disabled) return;

    const file = event.dataTransfer.files?.[0];
    if (file) onFileSelect(file);
  };

  const handleInputChange = (event) => {
    const file = event.target.files?.[0];
    if (file) onFileSelect(file);
  };

  return (
    <section
      className={`rounded-card border-2 border-dashed p-6 text-center transition-colors ${
        isDragging ? 'border-medicalBlue bg-blue-50' : 'border-slate-300 bg-white'
      } ${disabled ? 'opacity-70' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        accept="image/*,.pdf"
        onChange={handleInputChange}
        disabled={disabled}
      />

      <p className="text-sm font-medium text-slate-800">
        Drag and drop a prescription file here, or choose from your device.
      </p>
      <p className="mt-1 text-xs text-slate-500">Supported formats: JPG, PNG, PDF</p>

      <button
        type="button"
        className="btn-secondary mt-4"
        disabled={disabled}
        onClick={() => inputRef.current?.click()}
      >
        Choose File
      </button>

      {selectedFile && (
        <div className="mt-5 rounded-lg border border-slate-200 bg-slate-50 p-3 text-left">
          <p className="text-sm font-semibold text-slate-800">Selected File</p>
          <p className="mt-1 text-xs text-slate-600">{selectedFile.name}</p>
          <p className="text-xs text-slate-500">{(selectedFile.size / 1024).toFixed(1)} KB</p>

          {previewUrl ? (
            <img
              src={previewUrl}
              alt="Prescription preview"
              className="mt-3 max-h-64 w-full rounded-lg border border-slate-200 object-contain"
            />
          ) : (
            <div className="mt-3 rounded-md border border-slate-200 bg-white p-3 text-xs text-slate-500">
              Preview unavailable for this file type.
            </div>
          )}
        </div>
      )}
    </section>
  );
}

export default UploadBox;
