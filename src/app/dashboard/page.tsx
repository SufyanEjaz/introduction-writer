'use client';

import React, { useState } from 'react';
import { useAuthGuard } from '@/hooks/useAuth';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import MainContent from '@/components/MainContent';
import useIntroductionForm from '@/hooks/useIntroductionForm';

const DashboardPage: React.FC = () => {
  // 1. Check if user is authenticated
  const isAuthLoading = useAuthGuard();

  // 2. Local UI state for toggling sidebar
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // 3. File states for each category
  const [theoreticalFrameworkFiles, setTheoreticalFrameworkFiles] = useState<File[]>([]);
  const [relevantTheoryFiles, setRelevantTheoryFiles] = useState<File[]>([]);
  const [supportingLiteratureFiles, setSupportingLiteratureFiles] = useState<File[]>([]);

  // 4. Use the custom hook for introduction form logic
  const {
    selectedStyle,
    setSelectedStyle,
    formData,
    errors,
    loading,
    yesLoading,
    noLoading,
    submitChangesLoading,
    planContent,
    modificationResponses,
    showModificationField,
    modificationField,
    modificationError,
    handleInputChange,
    handleSubmit,
    handleFeedback,
    handleModificationSubmit,
    setModificationField,
  } = useIntroductionForm();

  // If auth is still being checked or user is not authenticated:
  if (isAuthLoading) {
    return null; // or a spinner
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header Section */}
      <Header
        sidebarOpen={sidebarOpen}
        toggleSidebar={() => setSidebarOpen((prev) => !prev)}
      />

      <div className="flex flex-1">
        {/* Sidebar Section */}
        <Sidebar
          sidebarOpen={sidebarOpen}
          theoreticalFrameworkFiles={theoreticalFrameworkFiles}
          setTheoreticalFrameworkFiles={setTheoreticalFrameworkFiles}
          relevantTheoryFiles={relevantTheoryFiles}
          setRelevantTheoryFiles={setRelevantTheoryFiles}
          supportingLiteratureFiles={supportingLiteratureFiles}
          setSupportingLiteratureFiles={setSupportingLiteratureFiles}
        />

        {/* Main Content Section */}
        <MainContent
          sidebarOpen={sidebarOpen}
          selectedStyle={selectedStyle}
          setSelectedStyle={setSelectedStyle}
          formData={formData}
          handleInputChange={handleInputChange}
          errors={errors}
          loading={loading}
          yesLoading={yesLoading}
          noLoading={noLoading}
          submitChangesLoading={submitChangesLoading}
          planContent={planContent}
          modificationResponses={modificationResponses}
          showModificationField={showModificationField}
          modificationField={modificationField}
          modificationError={modificationError}
          setModificationField={setModificationField}
          handleFeedback={handleFeedback}
          handleModificationSubmit={handleModificationSubmit}
          handleSubmit={(e) =>
            handleSubmit(e, {
              theoreticalFrameworkFiles,
              relevantTheoryFiles,
              supportingLiteratureFiles,
            })
          }
        />
      </div>
    </div>
  );
};

export default DashboardPage;
