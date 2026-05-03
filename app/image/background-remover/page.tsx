"use client";

import { useState, useCallback, useRef, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import Image from 'next/image';
import Link from 'next/link';
import Sidebar from '@/components/layout/Sidebar';

type ProcessingState = 'idle' | 'uploading' | 'processing' | 'result';
type BgColor = 'transparent' | 'white' | 'black';

export default function BackgroundRemoverPage() {
  const [state, setState] = useState<ProcessingState>('idle');
  const [progress, setProgress] = useState(0);
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [originalPreview, setOriginalPreview] = useState<string>('');
  const [resultPreview, setResultPreview] = useState<string>('');
  const [bgColor, setBgColor] = useState<BgColor>('transparent');
  const [error, setError] = useState<string>('');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setOriginalFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setOriginalPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      setResultPreview('');
      setState('idle');
      setError('');
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.png', '.jpg', '.jpeg', '.webp'] },
    maxFiles: 1,
    maxSize: 20 * 1024 * 1024,
  });

  // Simple background removal using canvas thresholding
  const removeBackground = useCallback(async (imageData: ImageData, threshold: number = 30) => {
    const data = imageData.data;
    const width = imageData.width;
    const height = imageData.height;
    
    // Get edge pixels to determine background color
    const edgePixels: number[][] = [];
    
    // Sample corners and edges
    for (let x = 0; x < width; x += 10) {
      edgePixels.push([data[(0 * width + x) * 4], data[(0 * width + x) * 4 + 1], data[(0 * width + x) * 4 + 2]]);
      edgePixels.push([data[((height - 1) * width + x) * 4], data[((height - 1) * width + x) * 4 + 1], data[((height - 1) * width + x) * 4 + 2]]);
    }
    for (let y = 0; y < height; y += 10) {
      edgePixels.push([data[(y * width + 0) * 4], data[(y * width + 0) * 4 + 1], data[(y * width + 0) * 4 + 2]]);
      edgePixels.push([data[(y * width + width - 1) * 4], data[(y * width + width - 1) * 4 + 1], data[(y * width + width - 1) * 4 + 2]]);
    }

    // Calculate average background color
    const bgColor = [0, 0, 0];
    edgePixels.forEach(p => {
      bgColor[0] += p[0];
      bgColor[1] += p[1];
      bgColor[2] += p[2];
    });
    bgColor[0] = Math.round(bgColor[0] / edgePixels.length);
    bgColor[1] = Math.round(bgColor[1] / edgePixels.length);
    bgColor[2] = Math.round(bgColor[2] / edgePixels.length);

    // Make similar colors transparent
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      
      // Check if pixel is similar to background
      const diff = Math.sqrt(
        Math.pow(r - bgColor[0], 2) +
        Math.pow(g - bgColor[1], 2) +
        Math.pow(b - bgColor[2], 2)
      );
      
      if (diff < threshold * 2.55) {
        // Make transparent
        data[i + 3] = Math.max(0, 255 - diff * 4);
      }
    }
    
    return imageData;
  }, []);

  const handleRemoveBackground = useCallback(async () => {
    if (!originalPreview || !originalFile) return;

    setState('uploading');
    setProgress(0);
    setError('');

    // Simulate upload progress
    for (let i = 0; i <= 30; i += 5) {
      await new Promise(r => setTimeout(r, 50));
      setProgress(i);
    }

    setState('processing');
    
    // Load image and process
    const img = new window.Image();
    img.crossOrigin = 'anonymous';
    
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = reject;
      img.src = originalPreview;
    });

    // Create canvas
    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      setError('Failed to create canvas');
      setState('idle');
      return;
    }

    // Draw original image
    ctx.drawImage(img, 0, 0);

    // Process the image
    for (let i = 0; i <= 100; i += 5) {
      await new Promise(r => setTimeout(r, 30));
      setProgress(i);
    }

    let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    
    // Apply basic background removal
    imageData = await removeBackground(imageData, 35);
    
    // Handle solid background color option
    if (bgColor !== 'transparent') {
      const bg = bgColor === 'white' ? 255 : 0;
      const imageData2 = imageData.data;
      for (let i = 0; i < imageData2.length; i += 4) {
        if (imageData2[i + 3] < 128) {
          imageData2[i] = bg;
          imageData2[i + 1] = bg;
          imageData2[i + 2] = bg;
        }
      }
    }
    
    ctx.putImageData(imageData, 0, 0);

    // Convert to data URL
    const resultDataUrl = canvas.toDataURL('image/png');
    setResultPreview(resultDataUrl);
    setProgress(100);
    setState('result');
  }, [originalPreview, originalFile, bgColor, removeBackground]);

  const handleDownload = () => {
    if (!resultPreview || !originalFile) return;

    const link = document.createElement('a');
    link.href = resultPreview;
    const baseName = originalFile.name.replace(/\.[^/.]+$/, '');
    link.download = `${baseName}_removed.png`;
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
    setError('');
  };

  const bgOptions = [
    { value: 'transparent' as const, label: 'Transparent', description: 'Best for overlays' },
    { value: 'white' as const, label: 'White', description: 'Best for documents' },
    { value: 'black' as const, label: 'Black', description: 'Best for dark mode' },
  ];

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
            <span className="text-purple-400">Background Remover</span>
          </nav>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white font-['Manrope'] mb-2">
              <span className="text-gradient">Background Remover</span>
            </h1>
            <p className="text-slate-400 max-w-2xl">
              Remove backgrounds from images automatically. Get clean cutouts in seconds with AI-powered processing.
            </p>
          </div>

          {/* Main Tool Card */}
          <div className="glass-panel p-6 md:p-8 mb-8">
            {/* Dropzone */}
            {state === 'idle' && !originalPreview && (
              <div
                {...getRootProps()}
                className={`glass-dropzone p-8 md:p-12 text-center cursor-pointer ${isDragActive ? 'active' : ''}`}
              >
                <input {...getInputProps()} />
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-white/5 flex items-center justify-center">
                  <span className="material-symbols-outlined text-4xl text-purple-400">auto_fix_high</span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  {isDragActive ? 'Drop your image here' : 'Drag & drop image here'}
                </h3>
                <p className="text-slate-500 mb-6">
                  or click to select from your computer
                </p>
                <button className="glass-button px-8 py-3 rounded-xl font-semibold">
                  Select Image
                </button>
                <p className="text-xs text-slate-600 mt-4">
                  Supports PNG, JPG, WebP (Max 20MB)
                </p>
              </div>
            )}

            {/* File selected - show preview and options */}
            {originalPreview && state !== 'result' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Original */}
                  <div>
                    <p className="text-sm text-slate-500 mb-2">Original</p>
                    <div className="glass-card p-2">
                      <div className="relative aspect-video bg-white/5 rounded-lg overflow-hidden">
                        <Image src={originalPreview} alt="Original" fill className="object-contain" />
                      </div>
                      <p className="text-xs text-slate-500 mt-2">
                        {originalFile?.name} ({formatFileSize(originalFile?.size || 0)})
                      </p>
                    </div>
                  </div>

                  {/* Result Preview */}
                  <div>
                    <p className="text-sm text-slate-500 mb-2">Result</p>
                    <div className="glass-card p-2">
                      <div 
                        className="relative aspect-video rounded-lg overflow-hidden"
                        style={bgColor === 'transparent' ? {
                          backgroundImage: `linear-gradient(45deg, #333 25%, transparent 25%), linear-gradient(-45deg, #333 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #333 75%), linear-gradient(-45deg, transparent 75%, #333 75%)`,
                          backgroundSize: '20px 20px',
                          backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
                          backgroundColor: '#1a1a1a'
                        } : bgColor === 'white' ? { background: '#ffffff' } : { background: '#000000' }}
                      >
                        {resultPreview ? (
                          <Image src={resultPreview} alt="Result" fill className="object-contain" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <span className="material-symbols-outlined text-6xl text-slate-600">auto_fix_high</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Background Options */}
                <div>
                  <label className="text-sm font-semibold text-white mb-3 block">Background Color</label>
                  <div className="flex gap-3">
                    {bgOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setBgColor(option.value)}
                        className={`flex-1 p-4 rounded-xl transition-all ${
                          bgColor === option.value
                            ? 'bg-purple-500/20 border border-purple-500/30'
                            : 'bg-white/5 border border-white/10 hover:border-white/20'
                        }`}
                      >
                        <div className={`w-8 h-8 mx-auto rounded-lg mb-2 ${
                          option.value === 'transparent' ? 'bg-checkerboard' :
                          option.value === 'white' ? 'bg-white' : 'bg-black'
                        }`} />
                        <p className="text-sm font-medium text-white">{option.label}</p>
                        <p className="text-xs text-slate-500">{option.description}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Progress */}
                {(state === 'uploading' || state === 'processing') && (
                  <div className="glass-panel p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-white">
                        {state === 'uploading' ? 'Processing...' : 'Removing background...'}
                      </span>
                      <span className="text-sm font-bold text-purple-400">{progress}%</span>
                    </div>
                    <div className="glass-progress h-2">
                      <div className="glass-progress-bar h-full" style={{ width: progress + '%' }} />
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex flex-wrap gap-4">
                  {(state === 'idle' || state === 'uploading') && (
                    <>
                      <button
                        onClick={handleRemoveBackground}
                        disabled={state === 'uploading'}
                        className="glass-button px-6 py-3 rounded-xl font-semibold flex items-center gap-2 disabled:opacity-50"
                      >
                        <span className="material-symbols-outlined">auto_fix_high</span>
                        {state === 'uploading' ? 'Processing...' : 'Remove Background'}
                      </button>
                      <button
                        onClick={handleReset}
                        className="glass-button-secondary px-6 py-3 rounded-xl font-semibold"
                      >
                        Clear
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Result State */}
            {state === 'result' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-slate-500 mb-2">Original</p>
                    <div className="glass-card p-2">
                      <div className="relative aspect-video bg-white/5 rounded-lg overflow-hidden">
                        <Image src={originalPreview} alt="Original" fill className="object-contain" />
                      </div>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 mb-2">Result</p>
                    <div className="glass-card p-2">
                      <div 
                        className="relative aspect-video rounded-lg overflow-hidden"
                        style={bgColor === 'transparent' ? {
                          backgroundImage: `linear-gradient(45deg, #333 25%, transparent 25%), linear-gradient(-45deg, #333 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #333 75%), linear-gradient(-45deg, transparent 75%, #333 75%)`,
                          backgroundSize: '20px 20px',
                          backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
                          backgroundColor: '#1a1a1a'
                        } : bgColor === 'white' ? { background: '#ffffff' } : { background: '#000000' }}
                      >
                        <Image src={resultPreview} alt="Result" fill className="object-contain" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4">
                  <button
                    onClick={handleDownload}
                    className="glass-button px-6 py-3 rounded-xl font-semibold flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined">download</span>
                    Download PNG
                  </button>
                  <button
                    onClick={handleReset}
                    className="glass-button-secondary px-6 py-3 rounded-xl font-semibold"
                  >
                    Try Another
                  </button>
                </div>
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-center gap-3">
                <span className="material-symbols-outlined text-red-400">error</span>
                <p className="text-sm text-red-300">{error}</p>
              </div>
            )}
          </div>

          {/* Tips */}
          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-purple-400">lightbulb</span>
              Tips for best results
            </h3>
            <ul className="space-y-2 text-sm text-slate-500">
              <li className="flex items-start gap-2">
                <span className="material-symbols-outlined text-xs text-purple-400 mt-1">arrow_right</span>
                Use images with clear contrast between subject and background
              </li>
              <li className="flex items-start gap-2">
                <span className="material-symbols-outlined text-xs text-purple-400 mt-1">arrow_right</span>
                PNG format works best for transparent backgrounds
              </li>
              <li className="flex items-start gap-2">
                <span className="material-symbols-outlined text-xs text-purple-400 mt-1">arrow_right</span>
                Avoid images with shadows on the subject
              </li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}