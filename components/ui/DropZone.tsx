'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';

interface DropZoneProps {
  onFilesDropped: (files: File[]) => void;
  accept?: Record<string, string[]>;
  maxFiles?: number;
  maxSize?: number;
  disabled?: boolean;
}

const DropZone = ({
  onFilesDropped,
  accept,
  maxFiles = 1,
  maxSize = 10 * 1024 * 1024,
  disabled = false
}: DropZoneProps) => {
  const [isDragActive, setIsDragActive] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onFilesDropped(acceptedFiles);
    }
  }, [onFilesDropped]);

  const { getRootProps, getInputProps, isDragReject } = useDropzone({
    onDrop,
    accept,
    maxFiles,
    maxSize,
    disabled,
    onDragEnter: () => setIsDragActive(true),
    onDragLeave: () => setIsDragActive(false),
  });

  const baseClasses = 'border-2 border-dashed rounded-2xl p-12 text-center transition-all cursor-pointer';
  const activeClasses = isDragActive && !isDragReject
    ? 'border-primary bg-surface-container-low'
    : isDragReject
      ? 'border-error bg-error/10'
      : 'border-outline-variant hover:border-primary hover:bg-surface-container-low';
  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : '';

  return (
    <div
      {...getRootProps()}
      className={baseClasses + ' ' + activeClasses + ' ' + disabledClasses}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center gap-4">
        <span className="material-symbols-outlined text-5xl text-on-surface-variant">
          cloud_upload
        </span>
        <div>
          <p className="text-on-surface font-medium">
            {isDragActive
              ? isDragReject
                ? 'Unsupported file type'
                : 'Drop your files here'
              : 'Drag & drop files here, or click to select'}
          </p>
          <p className="text-on-surface-variant text-sm mt-2">
            Maximum file size: {Math.round(maxSize / 1024 / 1024)}MB
          </p>
        </div>
      </div>
    </div>
  );
};

export default DropZone;
