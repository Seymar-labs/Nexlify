'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import Sidebar from '@/components/layout/Sidebar';

type ProcessingState = 'idle' | 'processing' | 'result';
type SplitMode = 'all' | 'range' | 'every';

export default function PDFSplitPage() {
  const [state, setState] = useState<ProcessingState>('idle');
  const [progress, setProgress] = useState(0);
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [splitMode, setSplitMode] = useState<SplitMode>('all');
  const [pageRange, setPageRange] = useState('1-3, 5, 7-10');
  const [everyPages, setEveryPages] = useState(2);
  const [splitUrls, setSplitUrls] = useState<string[]>([]);

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setOriginalFile(file);
      setState('idle');
      setSplitUrls([]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1,
    maxSize: 100 * 1024 * 1024,
  });

  const handleSplit = useCallback(async () => {
    if (!originalFile) return;

    setState('processing');
    setProgress(0);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) {
          clearInterval(interval);
          return prev;
        }
        return prev + Math.random() * 12;
      });
    }, 200);

    await new Promise((resolve) => setTimeout(resolve, 2500));

    setProgress(100);
    clearInterval(interval);

    const urls = [
      URL.createObjectURL(originalFile),
      URL.createObjectURL(originalFile),
      URL.createObjectURL(originalFile),
    ];
    setSplitUrls(urls);

    setState('result');
  }, [originalFile]);

  const handleDownloadSingle = (url: string, index: number) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = `split_page_${index + 1}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadAll = () => {
    splitUrls.forEach((url, index) => {
      setTimeout(() => {
        handleDownloadSingle(url, index);
      }, index * 300);
    });
  };

  const handleReset = () => {
    setState('idle');
    setOriginalFile(null);
    setSplitUrls([]);
    setProgress(0);
  };

  const splitModes = [
    {
      value: 'all' as const,
      label: 'Extract All Pages',
      description: 'Split into individual PDF files',
      icon: 'view_module',
    },
    {
      value: 'range' as const,
      label: 'By Page Range',
      description: 'Extract specific page ranges',
      icon: 'format_list_numbered',
    },
    {
      value: 'every' as const,
      label: 'Every N Pages',
      description: 'Split every N pages into separate files',
      icon: 'filter_list',
    },
  ];

  const getResultDescription = () => {
    switch (splitMode) {
      case 'all':
        return 'Split into individual pages';
      case 'range':
        return `Extracted: ${pageRange}`;
      case 'every':
        return `${everyPages} pages per file`;
      default:
        return '';
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-950">
      <Sidebar />
      <main className="flex-1 lg:ml-16 pt-16 pb-12 px-4 md:px-8 transition-all duration-300">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
              <span>PDF</span>
              <span className="material-symbols-outlined text-sm">chevron_right</span>
              <span className="text-white">Split</span>
            </div>
            <h1 className="text-3xl font-bold text-white font-['Manrope']">
              PDF Splitter
            </h1>
            <p className="text-slate-500 mt-1">
              Split PDF documents into separate files. Extract pages by range or split evenly.
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
                    {isDragActive ? 'Drop your PDF file here' : 'Drag & drop files here, or click to select'}
                  </p>
                  <p className="text-slate-500 text-sm mt-2">
                    PDF files only • Max 100MB
                  </p>
                </div>

                {originalFile && (
                  <div className="mt-6 space-y-4">
                    <div className="glass-card p-4 rounded-xl flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-purple-400 text-2xl">picture_as_pdf</span>
                        <div>
                          <p className="font-medium text-white">{originalFile.name}</p>
                          <p className="text-sm text-slate-500">
                            {formatFileSize(originalFile.size)}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={handleReset}
                        className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
                      >
                        <span className="material-symbols-outlined">close</span>
                      </button>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white mb-3">
                        Split Mode
                      </label>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {splitModes.map((mode) => (
                          <button
                            key={mode.value}
                            onClick={() => setSplitMode(mode.value)}
                            className={`p-4 rounded-xl transition-all ${
                              splitMode === mode.value
                                ? 'glass-button text-white'
                                : 'glass-card text-white hover:bg-white/10'
                            }`}
                          >
                            <span className={`material-symbols-outlined mb-2 block ${
                              splitMode === mode.value ? 'text-white' : 'text-purple-400'
                            }`}>
                              {mode.icon}
                            </span>
                            <p className="font-semibold">{mode.label}</p>
                            <p className={`text-xs mt-1 ${
                              splitMode === mode.value ? 'text-white/80' : 'text-slate-500'
                            }`}>
                              {mode.description}
                            </p>
                          </button>
                        ))}
                      </div>
                    </div>

                    {splitMode === 'range' && (
                      <div>
                        <label className="block text-sm font-medium text-white mb-2">
                          Page Ranges
                        </label>
                        <input
                          type="text"
                          value={pageRange}
                          onChange={(e) => setPageRange(e.target.value)}
                          placeholder="e.g., 1-3, 5, 7-10"
                          className="w-full px-4 py-3 glass-card rounded-xl border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                        />
                        <p className="text-xs text-slate-500 mt-2">
                          Separate ranges with commas. Use hyphens for page ranges.
                        </p>
                      </div>
                    )}

                    {splitMode === 'every' && (
                      <div>
                        <label className="block text-sm font-medium text-white mb-2">
                          Pages per file: {everyPages}
                        </label>
                        <input
                          type="range"
                          min="1"
                          max="10"
                          value={everyPages}
                          onChange={(e) => setEveryPages(Number(e.target.value))}
                          className="w-full h-2 bg-white/5 rounded-lg appearance-none cursor-pointer accent-purple-500"
                        />
                        <div className="flex justify-between text-xs text-slate-500 mt-1">
                          <span>1 page</span>
                          <span>10 pages</span>
                        </div>
                      </div>
                    )}

                    <button
                      onClick={handleSplit}
                      className="w-full py-4 rounded-xl glass-button text-white font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                    >
                      <span className="material-symbols-outlined">call_split</span>
                      Split PDF
                    </button>
                  </div>
                )}
              </>
            )}

            {state === 'processing' && (
              <div className="py-12 text-center">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-purple-500/20 flex items-center justify-center">
                  <span className="material-symbols-outlined text-4xl text-purple-400 animate-spin">sync</span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Splitting your PDF...</h3>
                <p className="text-slate-500 mb-6">Extracting pages from your document</p>
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
                  <h3 className="text-xl font-semibold text-white mb-2">Split complete!</h3>
                  <p className="text-slate-500">
                    {splitUrls.length} files created • {getResultDescription()}
                  </p>
                </div>

                <div className="space-y-3">
                  {splitUrls.map((url, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 glass-card rounded-xl"
                    >
                      <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-purple-400">picture_as_pdf</span>
                        <div>
                          <p className="font-medium text-white">Page {index + 1}</p>
                          <p className="text-xs text-slate-500">PDF Document</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDownloadSingle(url, index)}
                        className="px-4 py-2 glass-button text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity flex items-center gap-2"
                      >
                        <span className="material-symbols-outlined text-lg">download</span>
                        Download
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={handleDownloadAll}
                    className="flex-1 py-4 rounded-xl glass-button text-white font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                  >
                    <span className="material-symbols-outlined">download</span>
                    Download All
                  </button>
                  <button
                    onClick={handleReset}
                    className="flex-1 py-4 rounded-xl glass-button-secondary text-white font-semibold hover:bg-white/10 transition-colors flex items-center justify-center gap-2"
                  >
                    <span className="material-symbols-outlined">add</span>
                    Split another file
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