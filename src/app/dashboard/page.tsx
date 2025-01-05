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
      alert('Form submitted successfully!');
      console.log('API Response:', response.data);
    } catch (error: any) {
      console.log('Error submitting form:', error);
      alert(
        error.response?.data?.message || 'An error occurred while submitting the form.'
      );
    }
  };

  if (isLoading) {
    return null; // Prevent rendering until user authentication is verified
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex flex-1">
        <Sidebar
          sidebarOpen={sidebarOpen}
          theoreticalFrameworkFiles={theoreticalFrameworkFiles}
          setTheoreticalFrameworkFiles={setTheoreticalFrameworkFiles}
          relevantTheoryFiles={relevantTheoryFiles}
          setRelevantTheoryFiles={setRelevantTheoryFiles}
          supportingLiteratureFiles={supportingLiteratureFiles}
          setSupportingLiteratureFiles={setSupportingLiteratureFiles}
        />
        <ToggleArrow sidebarOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
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
        />
      </div>
    </div>
  );
};

export default Dashboard;
