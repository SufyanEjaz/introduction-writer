'use client';

import React, { useState, useRef } from 'react';
import { useAuthGuard } from '../../hooks/useAuth';
import ArrowBackIos from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIos from '@mui/icons-material/ArrowForwardIos';
import FileUpload from '../../components/FileUpload';
import Header from '../../components/Header';
import { getIntroduction } from '../../services/authService';

const Dashboard = () => {
  const isLoading = useAuthGuard(); // Check if the user is authenticated
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedStyle, setSelectedStyle] = useState('AOM writing style');

  const [theoreticalFrameworkFiles, setTheoreticalFrameworkFiles] = useState<File[]>([]);
  const [relevantTheoryFiles, setRelevantTheoryFiles] = useState<File[]>([]);
  const [supportingLiteratureFiles, setSupportingLiteratureFiles] = useState<File[]>([]);

  const [formData, setFormData] = useState({
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

  // const handleSubmit = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   if (validateForm()) {
  //     alert('Form submitted successfully!');
  //     console.log('Form Data:', formData);
  //   } else {
  //     alert('Please fill in all required fields.');
  //   }
  // };
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
    return null; // Prevent rendering the page until the user is verified
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <div className="flex flex-1">
        {/* Sidebar */}
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
                <div className="mb-8">
                  <h2 className="text-lg font-semibold mb-3">Upload Existing Vector Database</h2>
                  <button className="w-full border border-blue-500 text-blue-500 py-2 px-4 rounded-lg hover:bg-blue-100">
                    Load Vector Database
                  </button>
                </div>

                <div className="mb-8">
                  <h2 className="text-lg font-semibold mb-3">Upload Theoretical Framework</h2>
                  <FileUpload
                    files={theoreticalFrameworkFiles}
                    setFiles={setTheoreticalFrameworkFiles}
                    onDrop={(files) => console.log('Uploaded Files:', files)}
                    accept={{
                      'image/*': ['.png', '.jpg', '.jpeg'],
                    }}
                    maxSize={200 * 1024 * 1024} // 200MB limit
                  />
                </div>

                <div className="mb-8">
                  <h2 className="text-lg font-semibold mb-3">Upload Relevant Theory Files</h2>
                  <FileUpload
                    files={relevantTheoryFiles}
                    setFiles={setRelevantTheoryFiles}
                    onDrop={(files) => console.log('Uploaded Files:', files)}
                    accept={{
                      'application/pdf': ['.pdf'],
                    }}
                    maxSize={200 * 1024 * 1024} // 200MB limit
                  />
                </div>

                <div className="mb-8">
                  <h2 className="text-lg font-semibold mb-3">Upload Supporting Literature Files</h2>
                  <FileUpload
                    files={supportingLiteratureFiles}
                    setFiles={setSupportingLiteratureFiles}
                    onDrop={(files) => console.log('Uploaded Files:', files)}
                    accept={{
                      'application/pdf': ['.pdf'],
                    }}
                    maxSize={200 * 1024 * 1024} // 200MB limit
                  />
                </div>
              </div>

              <div className="p-4 border-t bg-gray-100">
                <h2 className="text-lg font-semibold mb-3">Generate and Save Embeddings</h2>
                <button className="w-full border border-red-500 text-red-500 py-2 px-4 rounded-lg hover:bg-red-100">
                  Get Embeddings
                </button>
              </div>
            </div>
          </div>
        </aside>

        {/* Toggle Arrow */}
        <div
          className={`absolute flex items-center justify-center z-10 top-4 left-4 bg-white border border-gray-300 rounded-full p-2 shadow-lg hover:shadow-xl hover:bg-gray-100 transition-all duration-300`}
          style={{
            position: 'fixed',
            top: '16px',
            left: sidebarOpen ? '16px' : '',
            zIndex: 10,
          }}
        >
          <button onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? <ArrowBackIos fontSize="medium" /> : <ArrowForwardIos fontSize="medium" />}
          </button>
        </div>

        {/* Main Content Area */}
        <main className={`flex-1 p-8 ${sidebarOpen ? '' : 'lg:block hidden'}`}>
          <h1 className="text-3xl font-bold mb-8">Introduction Writer</h1>

          <section className="mb-8">
            <h2 className="text-lg font-semibold mb-4">Select an Academic Writing Style</h2>
            <div className="space-y-3">
              {['AOM writing style', 'Science Direct writing style', 'Journal of Marketing writing style', 'Custom writing style'].map(
                (style) => (
                  <label key={style} className="flex items-center">
                    <input
                      type="radio"
                      name="writingStyle"
                      value={style}
                      className="form-radio text-red-500"
                      onChange={(e) => setSelectedStyle(e.target.value)}
                      checked={selectedStyle === style}
                    />
                    <span className="ml-3 text-gray-700">{style}</span>
                  </label>
                )
              )}
            </div>
          </section>

          <section className="mb-8">
            <div className="bg-blue-50 border-l-4 border-blue-500 text-blue-700 p-4 rounded-lg">
              You selected the <strong>{selectedStyle}</strong>.
            </div>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-4">Answer Following Queries</h2>
            <form className="space-y-6" onSubmit={handleSubmit}>
              {[
                { name: 'mainQuery', label: 'Please enter your main query / research question' },
                { name: 'background', label: 'Please enter the background of your research' },
                { name: 'significance', label: 'Please enter the significance of your research' },
                { name: 'proposedHypothesis', label: 'Please enter proposed hypothesis, if any' },
                { name: 'underpinningTheories', label: 'Please enter the underpinning theory/theories you are using' },
                { name: 'researchMethodology', label: 'Briefly describe your research methodology' },
                { name: 'journalScope', label: 'Please mention the name and scope of the journal you want to publish' },
                { name: 'context', label: 'Please mention the context of the research i.e. industry, employee orientation, workplace etc.' },
                { name: 'instructions', label: 'Are there any special instructions you want the program to focus on?' },
                { name: 'boundaryConditions', label: 'What are the boundary conditions/moderators in the study?' },
                { name: 'mediators', label: 'What are the mediators in the study?' },
                { name: 'mustIncludeArgument', label: 'Any must-include argument in the introduction?' },
              ].map(({ name, label }) => (
                <div key={name}>
                  <label
                    className={`block text-sm font-medium mb-2 ${
                      ['mainQuery', 'background', 'significance'].includes(name) && errors[name]
                        ? 'text-red-500'
                        : 'text-gray-700'
                    }`}
                  >
                    {label} {['mainQuery', 'background', 'significance'].includes(name) && '(required)'}
                  </label>
                  <textarea
                    ref={(el) => (formRefs.current[name] = el)}
                    name={name}
                    value={(formData as any)[name]}
                    onChange={handleInputChange}
                    className={`w-full border rounded-lg shadow-sm p-3 ${
                      errors[name] ? 'border-red-500' : 'border-gray-300 focus:border-red-500'
                    }`}
                    rows={3}
                    placeholder={`Enter ${label.toLowerCase()}...`}
                  ></textarea>
                </div>
              ))}

              <button type="submit" className="bg-red-500 text-white py-2 px-6 rounded-lg hover:bg-red-600">
                Get Introduction
              </button>
            </form>
          </section>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
