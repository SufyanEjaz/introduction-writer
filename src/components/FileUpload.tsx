'use client';

import { getIntroduction } from '@/services/authService';
import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';

type FileUploadProps = {
  files: File[];
  setFiles: React.Dispatch<React.SetStateAction<File[]>>;
  onDrop: (acceptedFiles: File[]) => void;
  accept?: { [key: string]: string[] }; // Accept map for dropzone
  maxSize: number; // Max file size in bytes
};

const FileUpload: React.FC<FileUploadProps> = ({
  files,
  setFiles,
  onDrop,
  accept,
  maxSize,
}) => {
  const [error, setError] = useState<string | null>(null);
  const [showAllFiles, setShowAllFiles] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState<{ isVisible: boolean; fileName: string | null }>({
    isVisible: false,
    fileName: null,
  });

  // Function to validate file name
  const isFileNameValid = (fileName: string): boolean => {
    const invalidCharactersRegex = /[,'"`\\/]/; // Matches commas, apostrophes, inverted commas, and slashes
    return !invalidCharactersRegex.test(fileName);
  };

  // Function to check if a file name is already uploaded
  const isFileUnique = (fileName: string): boolean => {
    return !files.some((file) => file.name === fileName);
  };

  const handleDrop = (acceptedFiles: File[]) => {
    const validFiles: File[] = [];
    acceptedFiles.filter((file) => {
      if (!isFileUnique(file.name)) {
        setError(`File ${file.name} has already been uploaded.`);
      } else if (file.size > maxSize) {
        setError(
          `File ${file.name} exceeds the size limit of ${Math.floor(
            maxSize / (1024 * 1024)
          )}MB.`
        );
      } else if (!isFileNameValid(file.name)) {
        setError(
          `File ${file.name} contains invalid characters (commas, apostrophes, inverted commas, or slashes).`
        );
      } else {
        validFiles.push(file);
      }
    });

    if (validFiles.length > 0) {
      const updatedFiles = [...files, ...validFiles];
      setFiles(updatedFiles);
      onDrop(validFiles);
      setError(null); // Clear any previous error if we got valid files
    }
  };

  const confirmRemoveFile = (fileName: string) => {
    setConfirmDialog({ isVisible: true, fileName });
  };

  const removeFile = async () => {
    if (!confirmDialog.fileName) return;

    try {
      // Build the payload
      const payload = new FormData();
      payload.append('file', confirmDialog.fileName);

      // Make the API call
      const response = await getIntroduction(payload);
      const deleted = response?.plan || null;
      if(deleted){
        const updatedFiles = files.filter((file) => file.name !== confirmDialog.fileName);
        setFiles(updatedFiles);
        setError(null);
      }
    } catch (error) {
      setError('Failed to remove the file. Please try again.');
    } finally {
      setConfirmDialog({ isVisible: false, fileName: null }); // Close dialog
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleDrop,
    accept,
  });

  const toggleFileView = () => setShowAllFiles((prev) => !prev);

  return (
    <div className="space-y-3">
      {/* Dropzone Area */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer ${
          isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-400 hover:border-blue-500'
        }`}
      >
        <input {...getInputProps()} />
        <p className="text-gray-500">
          Drag & drop your files here, or{' '}
          <span className="text-blue-500 font-medium">browse files</span>
        </p>
        <p className="text-sm text-gray-400">
          Accepted file types: {Object.keys(accept || {}).join(', ')}
        </p>
        <p className="text-sm text-gray-400">
          Limit {Math.floor(maxSize / (1024 * 1024))}MB per file
        </p>
      </div>

      {/* Error Message */}
      {error && <p className="text-red-500 text-sm">{error}</p>}

      {/* Uploaded Files List */}
      {files.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-2">
            Uploaded Files ({files.length})
          </h3>
          <ul className="space-y-1">
            {(showAllFiles ? files : files.slice(0, 3)).map((file) => (
              <li
                key={file.name}
                className="flex justify-between items-center text-sm text-gray-700"
              >
                <span className="truncate w-3/4">{file.name}</span>
                <button
                  onClick={() => confirmRemoveFile(file.name)}
                  className="text-red-500 hover:underline text-right"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
          {files.length > 3 && (
            <button
              onClick={toggleFileView}
              className="text-blue-500 hover:underline mt-2 block"
            >
              {showAllFiles ? 'View Less' : 'Load More'}
            </button>
          )}
        </div>
      )}

      {/* Confirmation Dialog */}
      {confirmDialog.isVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <h2 className="text-lg font-semibold mb-4">Confirm File Removal</h2>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to remove the file{' '}
              <span className="font-bold">{confirmDialog.fileName}</span>? This action cannot be undone.
            </p>
            <div className="flex justify-center space-x-4">
              <button
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                onClick={removeFile}
              >
                Confirm
              </button>
              <button
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                onClick={() => setConfirmDialog({ isVisible: false, fileName: null })}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
