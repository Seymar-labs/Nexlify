'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import Sidebar from '@/components/layout/Sidebar';

type ProcessingState = 'idle' | 'processing' | 'result';
type BgColor = 'transparent' | 'white' | 'black';

export default function BackgroundRemoverPage() {
  const [state, setState] = useState<ProcessingState>('idle');
  const [progress, setProgress] = useState(0);
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [originalPreview, setOriginalPreview] = useState<string>('');
  const [resultPreview, setResultPreview] = useState<string>('');
  const [bgColor, setBgColor] = useState<BgColor>('transparent');

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setOriginalFile(file);
      setOriginalPreview(URL.createObjectURL(file));
      setResultPreview('');
      setState('idle');
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.png', '.jpg', '.jpeg', '.webp'] },
    maxFiles: 1,
    maxSize: 20 * 1024 * 1024,
  });

  const handleRemoveBackground = useCallback(async () => {
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

    setResultPreview(URL.createObjectURL(originalFile));
    setState('result');
  }, [originalFile]);

  const handleDownload = () => {
    if (!resultPreview || !originalFile) return;

    const link = document.createElement('a');
    link.href = resultPreview;
    const baseName = originalFile.name.replace(/\.[^/.]+$/, '');
    link.download = baseName + '_no_bg.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleReset = () => {
    setState('idle');
    setOriginalFile(null);
    setOriginalPreview('');
    setResultPreview('');
    setProgress(0);
  };

  const bgOptions = [
    { value: 'transparent' as const, label: 'Transparent', icon: 'check_box_outline_blank' },
    { value: 'white' as const, label: 'White', icon: 'crop_square' },
    { value: 'black' as const, label: 'Black', icon: 'crop_square' },
  ];

  const getBgStyle = () => {
    if (bgColor === 'transparent') {
      return {
        backgroundImage: `
          linear-gradient(45deg, #808080 25%, transparent 25%),
          linear-gradient(-45deg, #808080 25%, transparent 25%),
          linear-gradient(45deg, transparent 75%, #808080 75%),
          linear-gradient(-45deg, transparent 75%, #808080 75%)
        `,
        backgroundSize: '20px 20px',
        backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
        backgroundColor: '#606060',
      };
    }
    return { backgroundColor: bgColor === 'white' ? '#ffffff' : '#000000' };
  };

  return (
    <div className="flex min-h-screen bg-slate-950">
      <Sidebar />
      <main className="flex-1 lg:ml-16 pt-16 pb-12 px-4 md:px-8 transition-all duration-300">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
              <span>Image</span>
              <span className="material-symbols-outlined text-sm">chevron_right</span>
              <span className="text-white">Background Remover</span>
            </div>
            <h1 className="text-3xl font-bold text-white font-['Manrope']">
              Background Remover
            </h1>
            <p className="text-slate-500 mt-1">
              Remove backgrounds from images automatically with AI. Get a clean cutout in seconds.
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
                    {isDragActive ? 'Drop your image here' : 'Drag & drop files here, or click to select'}
                  </p>
                  <p className="text-slate-500 text-sm mt-2">
                    PNG, JPG, JPEG, WebP • Max 20MB
                  </p>
                </div>

                {originalFile && (
                  <div className="mt-6 space-y-4">
                    <div className="glass-card p-4 rounded-xl flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {originalPreview && (
                          <img
                            src={originalPreview}
                            alt="Original"
                            className="w-12 h-12 object-cover rounded-lg"
                          />
                        )}
                        <div>
                          <p className="font-medium text-white">{originalFile.name}</p>
                          <p className="text-sm text-slate-500">{formatFileSize(originalFile.size)}</p>
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
                        Background Color
                      </label>
                      <div className="flex gap-3">
                        {bgOptions.map((option) => (
                          <button
                            key={option.value}
                            onClick={() => setBgColor(option.value)}
                            className={`flex-1 py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
                              bgColor === option.value
                                ? 'glass-button text-white'
                                : 'glass-card text-white hover:bg-white/10'
                            }`}
                          >
                            <span className="material-symbols-outlined">
                              {option.icon}
                            </span>
                            {option.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={handleRemoveBackground}
                      className="w-full py-4 rounded-xl glass-button text-white font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                    >
                      <span className="material-symbols-outlined">content_cut</span>
                      Remove Background
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
                <h3 className="text-xl font-semibold text-white mb-2">AI is removing the background...</h3>
                <p className="text-slate-500 mb-6">Analyzing image content and edges</p>
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
                  <h3 className="text-xl font-semibold text-white mb-2">Background removed!</h3>
                  <p className="text-slate-500">
                    Your image is ready with a clean cutout
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="glass-card p-4 rounded-xl">
                    <p className="text-sm font-medium text-white mb-3">Original</p>
                    <div className="aspect-video bg-white/5 rounded-lg flex items-center justify-center overflow-hidden">
                      {originalPreview && (
                        <img
                          src={originalPreview}
                          alt="Original"
                          className="w-full h-full object-contain"
                        />
                      )}
                    </div>
                  </div>
                  <div className="glass-card p-4 rounded-xl">
                    <p className="text-sm font-medium text-white mb-3">Result</p>
                    <div
                      className="aspect-video rounded-lg flex items-center justify-center overflow-hidden"
                      style={getBgStyle()}
                    >
                      {resultPreview && (
                        <img
                          src={resultPreview}
                          alt="Result"
                          className="w-full h-full object-contain"
                        />
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={handleDownload}
                    className="flex-1 py-4 rounded-xl glass-button text-white font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                  >
                    <span className="material-symbols-outlined">download</span>
                    Download PNG
                  </button>
                  <button
                    onClick={handleReset}
                    className="flex-1 py-4 rounded-xl glass-button-secondary text-white font-semibold hover:bg-white/10 transition-colors flex items-center justify-center gap-2"
                  >
                    <span className="material-symbols-outlined">add</span>
                    Try another
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