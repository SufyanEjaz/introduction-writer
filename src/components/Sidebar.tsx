'use client';

import React from 'react';
import FileUpload from './FileUpload';

type SidebarProps = {
  sidebarOpen: boolean;
  theoreticalFrameworkFiles: File[];
  setTheoreticalFrameworkFiles: React.Dispatch<React.SetStateAction<File[]>>;
  relevantTheoryFiles: File[];
  setRelevantTheoryFiles: React.Dispatch<React.SetStateAction<File[]>>;
  supportingLiteratureFiles: File[];
  setSupportingLiteratureFiles: React.Dispatch<React.SetStateAction<File[]>>;
};

const Sidebar: React.FC<SidebarProps> = ({
  sidebarOpen,
  theoreticalFrameworkFiles,
  setTheoreticalFrameworkFiles,
  relevantTheoryFiles,
  setRelevantTheoryFiles,
  supportingLiteratureFiles,
  setSupportingLiteratureFiles,
}) => {
  return (
    <aside
      className={`transition-all duration-300 bg-gray-50 border-r ${
        sidebarOpen ? 'lg:w-1/4 lg:block hidden w-0' : 'lg:w-0 w-full block lg:opacity-0'
      }`}
      style={{ top: 0 }}
    >
      <div style={{ position: 'sticky', top: 0 }}>
        <div className="flex flex-col" style={{ height: '100dvh' }}>
          {/* Scrollable Content */}
          <div className="p-8 flex-1 overflow-y-auto mt-5" style={{ height: '80dvh' }}>
            {/* Upload Existing Vector Database */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold mb-3">Upload Existing Vector Database</h2>
              <button className="w-full border border-blue-500 text-blue-500 py-2 px-4 rounded-lg hover:bg-blue-100">
                Load Vector Database
              </button>
            </div>

            {/* Upload Theoretical Framework */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold mb-3">Upload Theoretical Framework</h2>
              <FileUpload
                files={theoreticalFrameworkFiles}
                setFiles={setTheoreticalFrameworkFiles}
                onDrop={(files) => console.log('Uploaded Theoretical Framework Files:', files)}
                accept={{
                  'image/*': ['.png', '.jpg', '.jpeg'],
                }}
                maxSize={200 * 1024 * 1024} // 200MB limit
              />
            </div>

            {/* Upload Relevant Theory Files */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold mb-3">Upload Relevant Theory Files</h2>
              <FileUpload
                files={relevantTheoryFiles}
                setFiles={setRelevantTheoryFiles}
                onDrop={(files) => console.log('Uploaded Relevant Theory Files:', files)}
                accept={{
                  'application/pdf': ['.pdf'],
                }}
                maxSize={200 * 1024 * 1024} // 200MB limit
              />
            </div>

            {/* Upload Supporting Literature Files */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold mb-3">Upload Supporting Literature Files</h2>
              <FileUpload
                files={supportingLiteratureFiles}
                setFiles={setSupportingLiteratureFiles}
                onDrop={(files) => console.log('Uploaded Supporting Literature Files:', files)}
                accept={{
                  'application/pdf': ['.pdf'],
                }}
                maxSize={200 * 1024 * 1024} // 200MB limit
              />
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t bg-gray-100">
            <h2 className="text-lg font-semibold mb-3">Generate and Save Embeddings</h2>
            <button className="w-full border border-red-500 text-red-500 py-2 px-4 rounded-lg hover:bg-red-100">
              Get Embeddings
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
