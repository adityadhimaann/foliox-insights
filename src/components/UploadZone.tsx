import { useState, useCallback, useRef } from 'react';
import { Upload, FileCheck, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface UploadZoneProps {
  onFileSelected: (file: File | null) => void;
}

const UploadZone = ({ onFileSelected }: UploadZoneProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const openFilePicker = () => {
    if (!file && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      onClick={openFilePicker}
      className="relative h-[220px] sm:h-[280px] rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all duration-200 bg-foreground/5 dark:bg-[#070d1a]/60 border-2 border-dashed border-primary/20 hover:border-primary/50"
      style={{
        backdropFilter: 'blur(10px)',
        boxShadow: isDragging ? '0 0 0 4px rgba(0,229,160,0.06), inset 0 0 40px rgba(0,229,160,0.04)' : 'none',
      }}
    >
      <input
        ref={fileInputRef}
        id="file-input"
        type="file"
        accept=".pdf"
        className="hidden"
        onChange={handleChange}
      />

      <AnimatePresence mode="wait">
        {file ? (
          <motion.div
            key="file"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex flex-col items-center gap-3 px-4 text-center"
          >
            <div className="relative">
              <FileCheck className="w-10 h-10 sm:w-12 sm:h-12 text-primary" />
              <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                <svg className="w-3 h-3 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
              </div>
            </div>
            <p className="font-body text-base sm:text-lg text-primary font-medium truncate max-w-[260px] sm:max-w-full">{file.name}</p>
            <p className="font-body text-[13px] text-text-muted">{(file.size / 1024).toFixed(0)} KB</p>
            <button
              onClick={(e) => { e.stopPropagation(); handleFile(null); }}
              className="flex items-center gap-1.5 text-accent-warn font-body text-sm mt-1 hover:underline"
            >
              <X className="w-4 h-4" /> Remove
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center gap-3 px-4 text-center"
          >
            <Upload className="w-10 h-10 sm:w-12 sm:h-12 text-text-muted" style={{ animation: 'bounce-subtle 2s ease-in-out infinite' }} />
            <p className="font-body text-base sm:text-lg text-foreground">
              {isDragging ? 'Release to upload' : 'Tap to upload your PDF'}
            </p>
            <p className="font-body text-sm text-text-muted hidden sm:block">or drag & drop here</p>
            <p className="font-body text-sm text-text-muted sm:hidden">CAMS or KFintech statement</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UploadZone;
