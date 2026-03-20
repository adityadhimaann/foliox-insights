import { useState, useCallback } from 'react';
import { Upload, FileCheck, X } from 'lucide-react';

interface UploadZoneProps {
  onFileSelected: (file: File | null) => void;
}

const UploadZone = ({ onFileSelected }: UploadZoneProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = useCallback((f: File | null) => {
    setFile(f);
    onFileSelected(f);
  }, [onFileSelected]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped?.type === 'application/pdf') handleFile(dropped);
  }, [handleFile]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] ?? null;
    if (selected) handleFile(selected);
  }, [handleFile]);

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      className={`relative h-[280px] rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all duration-200 ${
        isDragging
          ? 'border-accent bg-accent/[0.04]'
          : file
          ? 'border-accent bg-accent/[0.02]'
          : 'border-border-strong bg-card hover:border-accent hover:bg-accent/[0.04]'
      }`}
      onClick={() => !file && document.getElementById('file-input')?.click()}
    >
      <input id="file-input" type="file" accept=".pdf" className="hidden" onChange={handleChange} />
      
      {file ? (
        <div className="flex flex-col items-center gap-3">
          <FileCheck className="w-12 h-12 text-accent" />
          <p className="font-body text-lg text-accent font-medium">{file.name}</p>
          <p className="font-body text-[13px] text-text-muted">{(file.size / 1024).toFixed(0)} KB</p>
          <button
            onClick={(e) => { e.stopPropagation(); handleFile(null); }}
            className="flex items-center gap-1.5 text-accent-warn font-body text-sm mt-1 hover:underline"
          >
            <X className="w-4 h-4" /> Remove
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3">
          <Upload className="w-12 h-12 text-primary" />
          <p className="font-body text-lg text-text-primary">Drag & drop your PDF here</p>
          <p className="font-body text-sm text-text-muted">or click to browse</p>
        </div>
      )}
    </div>
  );
};

export default UploadZone;
