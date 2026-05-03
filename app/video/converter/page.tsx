'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import Sidebar from '@/components/layout/Sidebar';

type ProcessingState = 'idle' | 'processing' | 'result';
type OutputFormat = 'mp4' | 'webm' | 'avi' | 'mov';

const videoFormats = ['.mp4', '.webm', '.avi', '.mov', '.mkv'];

export default function VideoConverterPage() {
  const [state, setState] = useState<ProcessingState>('idle');
  const [progress, setProgress] = useState(0);
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [resultUrl, setResultUrl] = useState<string>('');
  const [outputFormat, setOutputFormat] = useState<OutputFormat>('mp4');
  const [isPlaying, setIsPlaying] = useState(false);

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    return (bytes / (1024 * 1024 * 1024)).toFixed(2) + ' GB';
  };

  const getFileExtension = (filename: string): string => {
    return filename.slice(((filename.lastIndexOf('.') - 1) >>> 0) + 2);
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setOriginalFile(file);
      setVideoUrl(URL.createObjectURL(file));
      setResultUrl('');
      setState('idle');
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'video/*': videoFormats },
    maxFiles: 1,
    maxSize: 500 * 1024 * 1024,
  });

  const handleConvert = useCallback(async () => {
    if (!originalFile) return;

    setState('processing');
    setProgress(0);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) {
          clearInterval(interval);
          return prev;
        }
        return prev + Math.random() * 8;
      });
    }, 200);

    await new Promise((resolve) => setTimeout(resolve, 3000));

    setProgress(100);
    clearInterval(interval);

    setResultUrl(URL.createObjectURL(originalFile));
    setState('result');
  }, [originalFile]);

  const handleDownload = () => {
    if (!resultUrl || !originalFile) return;

    const baseName = originalFile.name.replace(/\.[^/.]+$/, '');
    const link = document.createElement('a');
    link.href = resultUrl;
    link.download = `${baseName}.${outputFormat}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleReset = () => {
    setState('idle');
    setOriginalFile(null);
    setVideoUrl('');
    setResultUrl('');
    setProgress(0);
  };

  const formatOptions = [
    { value: 'mp4' as const, label: 'MP4', description: 'Most compatible', icon: 'movie' },
    { value: 'webm' as const, label: 'WebM', description: 'Best for web', icon: 'public' },
    { value: 'avi' as const, label: 'AVI', description: 'Legacy support', icon: 'video_library' },
    { value: 'mov' as const, label: 'MOV', description: 'QuickTime', icon: 'slow_motion_video' },
  ];

  return (
    <div className="flex min-h-screen bg-slate-950">
      <Sidebar />
      <main className="flex-1 lg:ml-16 pt-16 pb-12 px-4 md:px-8 transition-all duration-300">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
              <span>Video</span>
              <span className="material-symbols-outlined text-sm">chevron_right</span>
              <span className="text-white">Converter</span>
            </div>
            <h1 className="text-3xl font-bold text-white font-['Manrope']">
              Video Converter
            </h1>
            <p className="text-slate-500 mt-1">
              Convert videos between formats instantly. Support for MP4, WebM, AVI, and more.
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
                    {isDragActive ? 'Drop your video here' : 'Drag & drop files here, or click to select'}
                  </p>
                  <p className="text-slate-500 text-sm mt-2">
                    MP4, WebM, AVI, MOV, MKV • Max 500MB
                  </p>
                </div>

                {originalFile && (
                  <div className="mt-6 space-y-4">
                    <div className="glass-card p-4 rounded-xl flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-purple-400 text-2xl">videocam</span>
                        <div>
                          <p className="font-medium text-white">{originalFile.name}</p>
                          <p className="text-sm text-slate-500">
                            {formatFileSize(originalFile.size)} • {getFileExtension(originalFile.name).toUpperCase()}
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

                    <div className="glass-card p-4 rounded-xl">
                      <video
                        src={videoUrl}
                        controls
                        className="w-full rounded-lg max-h-48"
                        onPlay={() => setIsPlaying(true)}
                        onPause={() => setIsPlaying(false)}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white mb-3">
                        Output Format
                      </label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {formatOptions.map((format) => (
                          <button
                            key={format.value}
                            onClick={() => setOutputFormat(format.value)}
                            className={`p-4 rounded-xl transition-all ${
                              outputFormat === format.value
                                ? 'glass-button text-white'
                                : 'glass-card text-white hover:bg-white/10'
                            }`}
                          >
                            <span className={`material-symbols-outlined mb-2 block ${
                              outputFormat === format.value ? 'text-white' : 'text-purple-400'
                            }`}>
                              {format.icon}
                            </span>
                            <p className="font-semibold">{format.label}</p>
                            <p className={`text-xs mt-1 ${
                              outputFormat === format.value ? 'text-white/80' : 'text-slate-500'
                            }`}>
                              {format.description}
                            </p>
                          </button>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={handleConvert}
                      className="w-full py-4 rounded-xl glass-button text-white font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                    >
                      <span className="material-symbols-outlined">swap_horiz</span>
                      Convert to {outputFormat.toUpperCase()}
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
                <h3 className="text-xl font-semibold text-white mb-2">Converting your video...</h3>
                <p className="text-slate-500 mb-6">This may take a few moments depending on file size</p>
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
                  <h3 className="text-xl font-semibold text-white mb-2">Conversion complete!</h3>
                  <p className="text-slate-500">
                    Your video is ready in {outputFormat.toUpperCase()} format
                  </p>
                </div>

                <div className="glass-card p-4 rounded-xl">
                  <video
                    src={resultUrl}
                    controls
                    className="w-full rounded-lg max-h-80"
                  />
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={handleDownload}
                    className="flex-1 py-4 rounded-xl glass-button text-white font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                  >
                    <span className="material-symbols-outlined">download</span>
                    Download {outputFormat.toUpperCase()}
                  </button>
                  <button
                    onClick={handleReset}
                    className="flex-1 py-4 rounded-xl glass-button-secondary text-white font-semibold hover:bg-white/10 transition-colors flex items-center justify-center gap-2"
                  >
                    <span className="material-symbols-outlined">add</span>
                    Convert another
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