import React from 'react';
import { useDropzone } from 'react-dropzone';

type FileUploadProps = {
  files: File[]; // List of uploaded files
  setFiles: React.Dispatch<React.SetStateAction<File[]>>; // Function to update files
  onDrop: (acceptedFiles: File[]) => void; // Callback for handling uploaded files
  accept?: { [key: string]: string[] }; // Accepted file types
};

const FileUpload: React.FC<FileUploadProps> = ({ files, setFiles, onDrop, accept }) => {
  const handleDrop = (acceptedFiles: File[]) => {
    const updatedFiles = [...files, ...acceptedFiles];
    setFiles(updatedFiles); // Update the files state
    onDrop(acceptedFiles); // Trigger the parent callback
  };

  const removeFile = (fileName: string) => {
    const updatedFiles = files.filter((file) => file.name !== fileName);
    setFiles(updatedFiles); // Remove specific file
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleDrop,
    accept,
  });

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
          Limit 200MB per file
        </p>
      </div>

      {/* Uploaded Files List */}
      {files.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-2">
            Uploaded Files ({files.length})
          </h3>
          <ul className="space-y-1">
            {files.map((file) => (
              <li key={file.name} className="flex justify-between items-center text-sm text-gray-700">
                <span>{file.name}</span>
                <button
                  onClick={() => removeFile(file.name)}
                  className="text-red-500 hover:underline ml-2"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
