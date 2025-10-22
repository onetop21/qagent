'use client';

import { useState } from 'react';

interface FileUploadProps {
  onUpload: (file: File) => void;
  isLoading?: boolean;
}

export default function FileUpload({ onUpload, isLoading }: FileUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string>('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validExtensions = ['.md', '.markdown', '.pdf'];
    const fileExtension = file.name.toLowerCase().slice(file.name.lastIndexOf('.'));

    if (!validExtensions.includes(fileExtension)) {
      setError('Only Markdown (.md) and PDF files are supported');
      setSelectedFile(null);
      return;
    }

    setError('');
    setSelectedFile(file);
  };

  const handleUpload = () => {
    if (selectedFile) {
      onUpload(selectedFile);
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
        <input
          type="file"
          accept=".md,.markdown,.pdf"
          onChange={handleFileChange}
          className="hidden"
          id="file-upload"
          disabled={isLoading}
        />
        <label
          htmlFor="file-upload"
          className="cursor-pointer flex flex-col items-center"
        >
          <svg
            className="w-12 h-12 text-gray-400 mb-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
          <span className="text-sm text-gray-600">
            Click to upload PRD file
          </span>
          <span className="text-xs text-gray-500 mt-1">
            Markdown or PDF (Max 10MB)
          </span>
        </label>
      </div>

      {selectedFile && (
        <div className="mt-4">
          <div className="flex items-center justify-between bg-gray-50 p-3 rounded">
            <span className="text-sm text-gray-700 truncate">
              {selectedFile.name}
            </span>
            <button
              onClick={() => setSelectedFile(null)}
              className="text-red-500 hover:text-red-700"
              disabled={isLoading}
            >
              Remove
            </button>
          </div>
          <button
            onClick={handleUpload}
            disabled={isLoading}
            className="mt-3 w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:bg-gray-400"
          >
            {isLoading ? 'Uploading...' : 'Upload PRD'}
          </button>
        </div>
      )}

      {error && (
        <div className="mt-3 text-sm text-red-600">{error}</div>
      )}
    </div>
  );
}
