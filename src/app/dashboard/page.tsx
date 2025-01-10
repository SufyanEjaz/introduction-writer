'use client';

import React, { useState, useRef } from 'react';
import { useAuthGuard } from '../../hooks/useAuth';
import Header from '../../components/Header';
import Sidebar from '../../components/Sidebar';
import ToggleArrow from '../../components/ToggleArrow';
import MainContent from '../../components/MainContent';
import { getIntroduction } from '../../services/authService';

const Dashboard = () => {
  const isLoading = useAuthGuard(); // Check if the user is authenticated
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedStyle, setSelectedStyle] = useState('AOM writing style');
  const [planContent, setPlanContent] = useState<string | null>(null);
  const [theoreticalFrameworkFiles, setTheoreticalFrameworkFiles] = useState<File[]>([]);
  const [relevantTheoryFiles, setRelevantTheoryFiles] = useState<File[]>([]);
  const [supportingLiteratureFiles, setSupportingLiteratureFiles] = useState<File[]>([]);
  
  const [formData, setFormData] = useState<{ [key: string]: string }>({
    mainQuery: '',
    background: '',
    significance: '',
    proposedHypothesis: '',
    underpinningTheories: '',
    researchMethodology: '',
    journalScope: '',
    context: '',
    instructions: '',
    boundaryConditions: '',
    mediators: '',
    mustIncludeArgument: '',
  });

  const [errors, setErrors] = useState<{ [key: string]: boolean }>({});
  const [loading, setLoading] = useState(false); // Loader state
  const contentRef = useRef<HTMLDivElement>(null); // Ref to focus on content
  const formRefs = useRef<{ [key: string]: HTMLTextAreaElement | null }>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: false }));
  };

  const validateForm = () => {
    const newErrors: { [key: string]: boolean } = {};
    const requiredFields = ['mainQuery', 'background', 'significance'];

    requiredFields.forEach((field) => {
      if (!formData[field as keyof typeof formData]?.trim()) {
        newErrors[field] = true;
      }
    });

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      const firstErrorKey = requiredFields.find((field) => newErrors[field]);
      if (firstErrorKey) {
        formRefs.current[firstErrorKey]?.focus();
      }
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      alert('Please fill in all required fields.');
      return;
    }

    // Combine the file data with the form data
    const payload = {
      ...formData,
      selectedStyle,
      theoreticalFrameworkFiles,
      relevantTheoryFiles,
      supportingLiteratureFiles,
    };

    try {
      const response = await getIntroduction(payload);

      // Extract `plan` content and store it
      const planContentInResponse = response?.intro_outline?.plan || null;
      setPlanContent(planContentInResponse);

      // Scroll to the rendered content
      if (planContentInResponse && contentRef.current) {
        contentRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    } catch (error: any) {
      alert(
        error.response?.data?.message || 'An error occurred while submitting the form.'
      );
    }
  };

  if (isLoading) return null; // Prevent rendering until user authentication is verified

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header Section */}
      <Header />

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

        {/* Sidebar Toggle Arrow */}
        <ToggleArrow
          sidebarOpen={sidebarOpen}
          toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        />

        {/* Main Content Section */}
        <MainContent
          sidebarOpen={sidebarOpen}
          selectedStyle={selectedStyle}
          setSelectedStyle={setSelectedStyle}
          formData={formData}
          setFormData={setFormData}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          errors={errors}
          formRefs={formRefs}
          planContent={planContent} // Pass the response content to MainContent
          loading={loading}
          contentRef={contentRef} // Pass content ref
        />
      </div>
    </div>
  );
};

export default Dashboard;
