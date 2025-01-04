import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';

type FileUploadProps = {
  files: File[]; // List of uploaded files
  setFiles: React.Dispatch<React.SetStateAction<File[]>>; // Function to update files
  onDrop: (acceptedFiles: File[]) => void; // Callback for handling uploaded files
  accept?: { [key: string]: string[] }; // Accepted file types
  maxSize: number; // Maximum file size in bytes
};

const FileUpload: React.FC<FileUploadProps> = ({ files, setFiles, onDrop, accept, maxSize }) => {
  const [error, setError] = useState<string | null>(null); // State for error messages
  const [showAllFiles, setShowAllFiles] = useState(false); // State to toggle showing all files

  const handleDrop = (acceptedFiles: File[]) => {
    const validFiles = acceptedFiles.filter((file) => {
      if (file.size > maxSize) {
        setError(`File ${file.name} exceeds the size limit of ${Math.floor(maxSize / (1024 * 1024))}MB.`);
        return false;
      }
      return true;
    });

    if (validFiles.length > 0) {
      const updatedFiles = [...files, ...validFiles];
      setFiles(updatedFiles); // Update the files state
      onDrop(validFiles); // Trigger the parent callback
      setError(null); // Clear error if valid files are uploaded
    }
  };

  const removeFile = (fileName: string) => {
    const updatedFiles = files.filter((file) => file.name !== fileName);
    setFiles(updatedFiles); // Remove specific file
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleDrop,
    accept,
  });

  const toggleFileView = () => {
    setShowAllFiles(!showAllFiles);
  };

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
                  onClick={() => removeFile(file.name)}
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
    </div>
  );
};

export default FileUpload;
