'use client';

import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { getIntroduction } from '../services/authService';
import { FORM_FIELDS } from '../config/formFields';

// Props for MainContent Component
type MainContentProps = {
  sidebarOpen: boolean;
  selectedStyle: string;
  setSelectedStyle: React.Dispatch<React.SetStateAction<string>>;
  formData: { [key: string]: string };
  setFormData: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>;
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
  errors: { [key: string]: boolean };
  formRefs: React.MutableRefObject<{ [key: string]: HTMLTextAreaElement | null }>;
  planContent: string | null; // New prop for displaying API response
  loading: boolean  // State to show a loading spinner
  contentRef: React.MutableRefObject<HTMLDivElement | null>; // Ref to scroll into the generated content
};

const MainContent: React.FC<MainContentProps> = ({
  sidebarOpen,
  selectedStyle,
  setSelectedStyle,
  formData,
  setFormData,
  handleInputChange,
  handleSubmit,
  errors,
  formRefs,
  planContent,
  loading,
  contentRef
}) => {
  const [showModificationField, setShowModificationField] = useState(false);
  const [modificationField, setModificationField] = useState('');
  const [modificationResponses, setModificationResponses] = useState<string[]>([]);

  const handleFeedback = async (feedback: string) => {
    if (feedback === 'Yes') {
      try {
        const response = await getIntroduction({ user_response: 'Yes' });
        alert('Thank you for your feedback!');
        console.log('API Response:', response);
      } catch (error) {
        console.error('Error submitting feedback:', error);
        alert('An error occurred while submitting your feedback.');
      }
    } else {
      setShowModificationField(true);
    }
  };

  const handleModificationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!modificationField.trim()) {
      alert('Please provide details about the changes you want to make.');
      return;
    }

    try {
      const response = await getIntroduction({ changes_recommended: modificationField });
      setModificationResponses((prev) => [...prev, response?.data || '']);
      setModificationField(''); // Clear the input field
      alert('Your suggestions have been submitted.');
      console.log('Modification Response:', response);
    } catch (error) {
      console.error('Error submitting modifications:', error);
      alert('An error occurred while submitting your modifications.');
    }
  };

  return (
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
          {FORM_FIELDS.map(({ name, label, required }) => (
            <div key={name}>
              <label
                className={`block text-sm font-medium mb-2 ${
                  required && errors[name] ? 'text-red-500' : 'text-gray-700'
                }`}
              >
                {label} {required && '(required)'}
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

          <button 
            type="submit" 
            className="bg-red-500 text-white py-2 px-6 rounded-lg hover:bg-red-600"
            disabled={loading}
           >
            {loading ? 'Loading...' : 'Get Introduction'}
          </button>
        </form>
      </section>

      {/* Render plan content in a card below the form */}
      {planContent && (
        <section ref={contentRef} className="mt-8">
          <div className="p-6 bg-white shadow-lg rounded-lg">
            <h2 className="text-xl font-bold mb-4">Generated Output</h2>
            <ReactMarkdown className="prose prose-red">{planContent}</ReactMarkdown>

            {/* Feedback Section */}
            <div className="mt-6">
              <p className="text-lg font-medium mb-4">Are you happy with this response or need modifications?</p>
              <div className="flex space-x-4">
                <button
                  onClick={() => handleFeedback('Yes')}
                  className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                >
                  Yes
                </button>
                <button
                  onClick={() => handleFeedback('No')}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                >
                  No
                </button>
              </div>
            </div>
          </div>

          {/* Modification Input Section */}
          {showModificationField && (
            <div className="mt-6 p-6 bg-gray-50 border rounded-lg">
              <form onSubmit={handleModificationSubmit}>
                <label className="block text-lg font-medium mb-2">
                  What changes do you want to make in the outline? Please mention here:
                </label>
                <textarea
                  value={modificationField}
                  onChange={(e) => setModificationField(e.target.value)}
                  className="w-full border rounded-lg shadow-sm p-3 mb-4"
                  rows={4}
                  placeholder="Enter your suggestions..."
                ></textarea>
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
                  Submit Changes
                </button>
              </form>

              {/* Render all responses */}
              {modificationResponses.map((response, index) => (
                <div key={index} className="mt-4 p-4 bg-white shadow rounded-lg">
                  <h3 className="text-lg font-semibold mb-2">Updated Response {index + 1}</h3>
                  <ReactMarkdown className="prose prose-blue">{response}</ReactMarkdown>
                </div>
              ))}
            </div>
          )}
        </section>
      )}
    </main>
  );
};

export default MainContent;
