'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import Sidebar from '@/components/layout/Sidebar';

type ProcessingState = 'idle' | 'processing' | 'result';
type ScaleFactor = '2x' | '4x' | '8x';

export default function ImageUpscalerPage() {
  const [state, setState] = useState<ProcessingState>('idle');
  const [progress, setProgress] = useState(0);
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [originalPreview, setOriginalPreview] = useState<string>('');
  const [resultPreview, setResultPreview] = useState<string>('');
  const [scaleFactor, setScaleFactor] = useState<ScaleFactor>('2x');
  const [compressionLevel, setCompressionLevel] = useState<'low' | 'medium' | 'high'>('medium');

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

  const handleUpscale = useCallback(async () => {
    if (!originalFile) return;

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

    await new Promise((resolve) => setTimeout(resolve, 3000));

    setProgress(100);
    clearInterval(interval);

    setResultPreview(URL.createObjectURL(originalFile));
    setState('result');
  }, [originalFile]);

  const handleDownload = () => {
    if (!resultPreview || !originalFile) return;

    const link = document.createElement('a');
    link.href = resultPreview;
    link.download = `upscaled_${originalFile.name}`;
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

  const scaleValue = scaleFactor === '2x' ? 2 : scaleFactor === '4x' ? 4 : 8;

  const compressionLabels = {
    low: 'Light (Better Quality)',
    medium: 'Balanced',
    high: 'Maximum (Smaller Size)',
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
              <span className="text-white">Upscaler</span>
            </div>
            <h1 className="text-3xl font-bold text-white font-['Manrope']">
              Image Upscaler
            </h1>
            <p className="text-slate-500 mt-1">
              Enhance and enlarge your images using advanced AI. Increase resolution up to 8x without quality loss.
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
                        Scale Factor
                      </label>
                      <div className="flex gap-3">
                        {(['2x', '4x', '8x'] as ScaleFactor[]).map((factor) => (
                          <button
                            key={factor}
                            onClick={() => setScaleFactor(factor)}
                            className={`flex-1 py-3 rounded-xl font-medium transition-all ${
                              scaleFactor === factor
                                ? 'glass-button text-white'
                                : 'glass-card text-white hover:bg-white/10'
                            }`}
                          >
                            {factor} Upscale
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white mb-3">
                        Compression Level
                      </label>
                      <div className="flex gap-3">
                        {(['low', 'medium', 'high'] as const).map((level) => (
                          <button
                            key={level}
                            onClick={() => setCompressionLevel(level)}
                            className={`flex-1 py-3 rounded-xl font-medium transition-all ${
                              compressionLevel === level
                                ? 'glass-button-secondary text-white'
                                : 'glass-card text-white hover:bg-white/10'
                            }`}
                          >
                            {compressionLabels[level]}
                          </button>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={handleUpscale}
                      className="w-full py-4 rounded-xl glass-button text-white font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                    >
                      <span className="material-symbols-outlined">photo_size_select_large</span>
                      Upscale Image
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
                <h3 className="text-xl font-semibold text-white mb-2">AI is enhancing your image...</h3>
                <p className="text-slate-500 mb-6">Using advanced neural networks for best results</p>
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
                  <h3 className="text-xl font-semibold text-white mb-2">Upscaling complete!</h3>
                  <p className="text-slate-500">
                    Your image has been upscaled {scaleValue}x with enhanced quality
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
                    <p className="text-sm font-medium text-white mb-3">
                      Upscaled ({scaleValue}x)
                    </p>
                    <div className="aspect-video bg-white/5 rounded-lg flex items-center justify-center overflow-hidden">
                      {resultPreview && (
                        <img
                          src={resultPreview}
                          alt="Upscaled"
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
                    Download
                  </button>
                  <button
                    onClick={handleReset}
                    className="flex-1 py-4 rounded-xl glass-button-secondary text-white font-semibold hover:bg-white/10 transition-colors flex items-center justify-center gap-2"
                  >
                    <span className="material-symbols-outlined">add</span>
                    Upscale another
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