"use client";

import { useCallback, useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import Image from 'next/image';
import Link from 'next/link';
import Sidebar from '@/components/layout/Sidebar';
import { useTool } from '@/lib/hooks/useTool';

type CompressionLevel = 'low' | 'balanced' | 'extreme';
type OutputFormat = 'auto' | 'jpg' | 'png' | 'webp';

export default function ImageCompressor() {
  const [compressionLevel, setCompressionLevel] = useState<CompressionLevel>('balanced');
  const [outputFormat, setOutputFormat] = useState<OutputFormat>('auto');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const {
    state,
    files,
    overallProgress,
    error,
    totalSavings,
    totalSavingsPercent,
    addFiles,
    removeFile,
    clearFiles,
    processFiles,
    downloadAll,
    formatFileSize,
    setError,
  } = useTool({
    maxSize: 50 * 1024 * 1024,
    acceptedTypes: { 'image/*': ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.bmp', '.tiff'] },
  });

  const onDrop = useCallback((acceptedFiles: File[]) => {
    addFiles(acceptedFiles);
  }, [addFiles]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.bmp', '.tiff'] },
    maxSize: 50 * 1024 * 1024,
  });

  const completedFiles = files.filter(f => f.status === 'completed');
  const isProcessing = state === 'uploading' || state === 'processing';

  if (!mounted) return null;

  return (
    <div className="flex min-h-screen bg-surface">
      <Sidebar />
      <main className="flex-1 lg:ml-16 pt-16 pb-12 px-4 md:px-8 transition-all duration-300">
        <div className="max-w-6xl mx-auto">
          {/* Breadcrumb */}
          <nav className="flex text-sm text-slate-500 gap-2 items-center mb-6">
            <Link href="/" className="hover:text-purple-400 transition-colors">Home</Link>
            <span className="material-symbols-outlined text-xs">chevron_right</span>
            <Link href="/image" className="hover:text-purple-400 transition-colors">Image</Link>
            <span className="material-symbols-outlined text-xs">chevron_right</span>
            <span className="text-purple-400">Compressor</span>
          </nav>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white font-['Manrope'] mb-2">
              <span className="text-gradient">Image Compressor</span>
            </h1>
            <p className="text-slate-400 max-w-2xl">
              Reduce image file size by up to 90% while maintaining excellent quality. 
              Supports JPG, PNG, WebP and more.
            </p>
          </div>

          {/* Main Tool Card - Glass */}
          <div className="glass-panel p-6 md:p-8 mb-8">
            {/* Dropzone */}
            {(state === 'idle' && files.length === 0) && (
              <div
                {...getRootProps()}
                className={`glass-dropzone p-8 md:p-12 text-center cursor-pointer ${isDragActive ? 'active' : ''}`}
              >
                <input {...getInputProps()} />
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-white/5 flex items-center justify-center">
                  <span className="material-symbols-outlined text-4xl text-purple-400">cloud_upload</span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  {isDragActive ? 'Drop your images here' : 'Drag & drop images here'}
                </h3>
                <p className="text-slate-500 mb-6">
                  or click to select files from your computer
                </p>
                <button className="glass-button px-8 py-3 rounded-xl font-semibold">
                  Select Images
                </button>
                <p className="text-xs text-slate-600 mt-4">
                  Supports JPG, PNG, WebP, GIF, BMP, TIFF (Max 50MB each)
                </p>
              </div>
            )}

            {/* File List */}
            {(files.length > 0 || isProcessing) && (
              <div className="space-y-4">
                {/* File Preview Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {files.map((file) => (
                    <div
                      key={file.id}
                      className={`relative rounded-xl overflow-hidden border transition-all ${
                        file.status === 'completed'
                          ? 'border-purple-500/50'
                          : file.status === 'processing'
                          ? 'border-purple-500'
                          : 'border-white/10'
                      }`}
                    >
                      <div className="aspect-square bg-white/5">
                        {file.preview ? (
                          <Image src={file.preview} alt={file.name} fill className="object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <span className="material-symbols-outlined text-4xl text-slate-500">image</span>
                          </div>
                        )}
                      </div>
                      
                      {/* Processing overlay */}
                      {file.status === 'processing' && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <div className="glass-progress w-16 h-16 rounded-full flex items-center justify-center">
                            <span className="text-xs font-bold text-white">{file.progress}%</span>
                          </div>
                        </div>
                      )}

                      {/* Completed overlay */}
                      {file.status === 'completed' && (
                        <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center">
                          <span className="material-symbols-outlined text-sm text-white">check</span>
                        </div>
                      )}

                      {/* Remove button */}
                      {state === 'idle' && (
                        <button
                          onClick={() => removeFile(file.id)}
                          className="absolute top-2 left-2 w-6 h-6 rounded-full bg-black/50 hover:bg-red-500 flex items-center justify-center transition-colors"
                        >
                          <span className="material-symbols-outlined text-sm text-white">close</span>
                        </button>
                      )}

                      {/* File info */}
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                        <p className="text-xs text-white truncate">{file.name}</p>
                        <p className="text-[10px] text-white/70">
                          {formatFileSize(file.size)}
                          {file.resultSize && <span className="text-purple-400 ml-1">→{formatFileSize(file.resultSize)}</span>}
                        </p>
                      </div>
                    </div>
                  ))}

                  {/* Add more */}
                  {state === 'idle' && (
                    <div {...getRootProps()} className="glass-dropzone aspect-square flex flex-col items-center justify-center cursor-pointer">
                      <input {...getInputProps()} />
                      <span className="material-symbols-outlined text-3xl text-slate-500 mb-1">add</span>
                      <span className="text-xs text-slate-500">Add more</span>
                    </div>
                  )}
                </div>

                {/* Progress */}
                {isProcessing && (
                  <div className="glass-panel p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-white">
                        {state === 'uploading' ? 'Uploading...' : 'Compressing...'}
                      </span>
                      <span className="text-sm font-bold text-purple-400">{overallProgress}%</span>
                    </div>
                    <div className="glass-progress h-2">
                      <div className="glass-progress-bar h-full" style={{ width: overallProgress + '%' }} />
                    </div>
                  </div>
                )}

                {/* Action buttons */}
                <div className="flex flex-wrap gap-4">
                  {state === 'idle' && (
                    <>
                      <button
                        onClick={processFiles}
                        disabled={files.length === 0}
                        className="glass-button px-6 py-3 rounded-xl font-semibold flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <span className="material-symbols-outlined">compress</span>
                        Compress {files.length} {files.length === 1 ? 'Image' : 'Images'}
                      </button>
                      <button
                        onClick={clearFiles}
                        className="glass-button-secondary px-6 py-3 rounded-xl font-semibold"
                      >
                        Clear All
                      </button>
                    </>
                  )}
                  
                  {state === 'completed' && (
                    <>
                      <button
                        onClick={downloadAll}
                        className="glass-button px-6 py-3 rounded-xl font-semibold flex items-center gap-2"
                      >
                        <span className="material-symbols-outlined">download</span>
                        Download All
                      </button>
                      <button
                        onClick={clearFiles}
                        className="glass-button-secondary px-6 py-3 rounded-xl font-semibold"
                      >
                        Compress More
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Settings */}
            {(state === 'idle' || files.length > 0) && (
              <div className="mt-8 pt-8 border-t border-white/10 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-semibold text-white">Compression Level</label>
                    <span className="px-3 py-1 bg-purple-500/20 text-purple-300 text-xs font-bold rounded-full">
                      {compressionLevel === 'low' ? 'Lossless' : compressionLevel === 'balanced' ? 'Recommended' : 'Maximum'}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="2"
                    value={compressionLevel === 'low' ? 0 : compressionLevel === 'balanced' ? 1 : 2}
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      setCompressionLevel(val === 0 ? 'low' : val === 1 ? 'balanced' : 'extreme');
                    }}
                    className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-purple-500"
                  />
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>Low (Lossless)</span>
                    <span>Balanced</span>
                    <span>Maximum</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-sm font-semibold text-white">Output Format</label>
                  <div className="flex flex-wrap gap-2">
                    {(['auto', 'jpg', 'png', 'webp'] as OutputFormat[]).map((format) => (
                      <button
                        key={format}
                        onClick={() => setOutputFormat(format)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                          outputFormat === format
                            ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                            : 'bg-white/5 text-slate-400 hover:bg-white/10'
                        }`}
                      >
                        {format === 'auto' ? 'Auto (Original)' : format.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Results Summary */}
          {state === 'completed' && completedFiles.length > 0 && (
            <div className="glass-panel p-6 mb-8">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-purple-400">check_circle</span>
                Compression Complete!
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="glass-card p-4 text-center">
                  <p className="text-3xl font-bold text-purple-400">{totalSavingsPercent}%</p>
                  <p className="text-sm text-slate-500">Space Saved</p>
                </div>
                <div className="glass-card p-4 text-center">
                  <p className="text-3xl font-bold text-white">{formatFileSize(totalSavings)}</p>
                  <p className="text-sm text-slate-500">Total Reduction</p>
                </div>
                <div className="glass-card p-4 text-center">
                  <p className="text-3xl font-bold text-white">{completedFiles.length}</p>
                  <p className="text-sm text-slate-500">Images Processed</p>
                </div>
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-8 flex items-center gap-3">
              <span className="material-symbols-outlined text-red-400">error</span>
              <p className="text-sm text-red-300">{error}</p>
              <button onClick={() => setError(null)} className="ml-auto text-sm font-medium text-red-400 hover:underline">
                Dismiss
              </button>
            </div>
          )}

          {/* Tips */}
          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-purple-400">lightbulb</span>
              Pro Tips
            </h3>
            <ul className="space-y-2 text-sm text-slate-500">
              <li className="flex items-start gap-2">
                <span className="material-symbols-outlined text-xs text-purple-400 mt-1">arrow_right</span>
                For web images, use WebP format for best compression with quality preservation.
              </li>
              <li className="flex items-start gap-2">
                <span className="material-symbols-outlined text-xs text-purple-400 mt-1">arrow_right</span>
                PNG is best for graphics with transparent backgrounds.
              </li>
              <li className="flex items-start gap-2">
                <span className="material-symbols-outlined text-xs text-purple-400 mt-1">arrow_right</span>
                JPEG is ideal for photographs and complex images.
              </li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}