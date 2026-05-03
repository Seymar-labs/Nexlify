'use client';

import { useState, useCallback } from 'react';

export type ToolState = 'idle' | 'uploading' | 'processing' | 'completed' | 'error';

export interface ToolFile {
  id: string;
  file: File;
  name: string;
  size: number;
  preview?: string;
  progress: number;
  status: 'pending' | 'processing' | 'completed' | 'error';
  resultUrl?: string;
  resultSize?: number;
  error?: string;
}

export interface UseToolOptions {
  maxFiles?: number;
  maxSize?: number;
  acceptedTypes?: Record<string, string[]>;
  onUploadComplete?: (files: ToolFile[]) => void;
  onProcessingComplete?: (files: ToolFile[]) => void;
}

export function useTool(options: UseToolOptions = {}) {
  const {
    maxFiles = 20,
    maxSize = 25 * 1024 * 1024,
    acceptedTypes = { 'image/*': ['.jpg', '.jpeg', '.png', '.webp', '.gif'] },
  } = options;

  const [state, setState] = useState<ToolState>('idle');
  const [files, setFiles] = useState<ToolFile[]>([]);
  const [overallProgress, setOverallProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);

  const formatFileSize = useCallback((bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }, []);

  const createPreview = useCallback((file: File): Promise<string> => {
    return new Promise((resolve) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.onerror = () => resolve('');
        reader.readAsDataURL(file);
      } else {
        resolve('');
      }
    });
  }, []);

  const addFiles = useCallback(async (newFiles: File[]) => {
    const validFiles = newFiles.filter(file => {
      if (file.size > maxSize) {
        setError(`File ${file.name} exceeds maximum size of ${formatFileSize(maxSize)}`);
        return false;
      }
      return true;
    });

    if (files.length + validFiles.length > maxFiles) {
      setError(`Maximum ${maxFiles} files allowed`);
      return;
    }

    const newToolFiles: ToolFile[] = await Promise.all(
      validFiles.map(async (file) => ({
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        file,
        name: file.name,
        size: file.size,
        preview: await createPreview(file),
        progress: 0,
        status: 'pending' as const,
      }))
    );

    setFiles(prev => [...prev, ...newToolFiles]);
    setError(null);
  }, [files.length, maxFiles, maxSize, formatFileSize, createPreview]);

  const removeFile = useCallback((id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  }, []);

  const clearFiles = useCallback(() => {
    setFiles([]);
    setState('idle');
    setOverallProgress(0);
    setError(null);
    setResultUrl(null);
  }, []);

  const simulateProcessing = useCallback(async (filesToProcess: ToolFile[]) => {
    setState('uploading');
    setOverallProgress(0);

    // Simulate upload progress
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 100));
      setOverallProgress(i);
    }

    setState('processing');

    // Simulate processing each file
    const processedFiles = await Promise.all(
      filesToProcess.map(async (toolFile) => {
        for (let i = 0; i <= 100; i += 5) {
          await new Promise(resolve => setTimeout(resolve, 50));
          setFiles(prev =>
            prev.map(f =>
              f.id === toolFile.id ? { ...f, progress: i, status: 'processing' as const } : f
            )
          );
        }
        // Simulate compression result (reduce size by 30-80%)
        const compressionRatio = 0.2 + Math.random() * 0.6;
        const newSize = Math.floor(toolFile.size * compressionRatio);
        
        return {
          ...toolFile,
          status: 'completed' as const,
          progress: 100,
          resultSize: newSize,
          resultUrl: toolFile.preview || undefined,
        };
      })
    );

    setFiles(processedFiles);
    setState('completed');

    // If single file, set as result
    if (processedFiles.length === 1 && processedFiles[0].resultUrl) {
      setResultUrl(processedFiles[0].resultUrl);
    }

    return processedFiles;
  }, []);

  const downloadResult = useCallback((toolFile?: ToolFile) => {
    const fileToDownload = toolFile || files.find(f => f.status === 'completed');
    if (!fileToDownload?.resultUrl) return;

    const link = document.createElement('a');
    link.href = fileToDownload.resultUrl;
    link.download = `nexlify-${fileToDownload.name}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [files]);

  const downloadAll = useCallback(async () => {
    const completedFiles = files.filter(f => f.status === 'completed');
    if (completedFiles.length === 1) {
      downloadResult(completedFiles[0]);
      return;
    }

    // For multiple files, download each
    for (const file of completedFiles) {
      downloadResult(file);
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }, [files, downloadResult]);

  const processFiles = useCallback(async () => {
    if (files.length === 0) return;
    await simulateProcessing(files);
  }, [files, simulateProcessing]);

  const totalSavings = files
    .filter(f => f.status === 'completed')
    .reduce((acc, f) => acc + (f.size - (f.resultSize || f.size)), 0);

  const totalSavingsPercent = files.length > 0
    ? Math.round(
        (totalSavings /
          files.reduce((acc, f) => acc + f.size, 0)) *
          100
      )
    : 0;

  return {
    state,
    files,
    overallProgress,
    error,
    resultUrl,
    totalSavings,
    totalSavingsPercent,
    addFiles,
    removeFile,
    clearFiles,
    processFiles,
    downloadResult,
    downloadAll,
    formatFileSize,
    setError,
  };
}
