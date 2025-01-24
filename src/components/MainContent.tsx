'use client';

import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { BsArrowDownShort } from 'react-icons/bs';

// Components
import LoadingButton from './LoadingButton';

// Config
import { FORM_FIELDS } from '@/config/formFields';

/** 
 * Props for MainContent 
 * 
 * Note the four separate loading states:
 * - loading               -> for the main "Get Introduction" form
 * - yesLoading, noLoading -> for the "Yes"/"No" feedback buttons
 * - submitChangesLoading  -> for the "Submit Changes" modifications form
 */
type MainContentProps = {
  // UI/Structure
  sidebarOpen: boolean;

  // Writing style
  selectedStyle: string;
  setSelectedStyle: React.Dispatch<React.SetStateAction<string>>;

  // Form data
  formData: { [key: string]: string };
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleSubmit: (e: React.FormEvent) => void; // or (e: React.FormEvent, files?: any) if you pass files

  // Errors/Loading
  errors: { [key: string]: boolean };
  loading: boolean;
  yesLoading: boolean;
  noLoading: boolean;
  submitChangesLoading: boolean;

  // Generated content
  planContent: string | null;

  // Modification feedback
  modificationResponses: string | null;
  showModificationField: boolean;
  modificationField: string;
  modificationError: boolean;
  setModificationField: React.Dispatch<React.SetStateAction<string>>;
  handleFeedback: (feedback: 'Yes' | 'No') => void;
  handleModificationSubmit: (e: React.FormEvent) => void;
};

const WRITING_STYLES = [
  'AOM writing style',
  'Science Direct writing style',
  'Journal of Marketing writing style',
  'Custom writing style',
];

const MainContent: React.FC<MainContentProps> = ({
  // Layout
  sidebarOpen,

  // Writing Style
  selectedStyle,
  setSelectedStyle,

  // Form
  formData,
  handleInputChange,
  handleSubmit,
  errors,

  // Loading states
  loading,
  yesLoading,
  noLoading,
  submitChangesLoading,

  // API Responses
  planContent,
  modificationResponses,

  // Modification
  showModificationField,
  modificationField,
  modificationError,
  setModificationField,
  handleFeedback,
  handleModificationSubmit,
}) => {
  const [showArrow, setShowArrow] = useState(false);

  /** Scroll to bottom utility */
  const scrollToBottom = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: 'smooth',
    });
  };

  /** Show/hide arrow based on scroll position */
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight;
      const viewportHeight = window.innerHeight;
      const currentScrollPos = window.scrollY + viewportHeight;
      setShowArrow(currentScrollPos < totalHeight - 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  /**
   * Whenever new content appears (planContent, modification field,
   * or modificationResponses), scroll to bottom.
   */
  useEffect(() => {
    if (planContent || showModificationField || modificationResponses) {
      scrollToBottom();
    }
  }, [planContent, showModificationField, modificationResponses]);

  return (
    <main className={`flex-1 p-8 ${sidebarOpen ? '' : 'lg:block hidden'}`}>
      <h1 className="text-3xl font-bold mb-8">Introduction Writer</h1>

      {/* Writing Style Selection */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-4">Select an Academic Writing Style</h2>
        <div className="space-y-3">
          {WRITING_STYLES.map((style) => (
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
          ))}
        </div>
      </section>

      <section className="mb-8">
        <div className="bg-blue-50 border-l-4 border-blue-500 text-blue-700 p-4">
          You selected the <strong>{selectedStyle}</strong> {selectedStyle === 'Custom writing style' && (
            <span> - Please paste your writing style sample below</span>
          )}.
        </div>
      </section>

      {/* Main Form */}
      <section>
        <form className="space-y-6" onSubmit={(e) => {
          handleSubmit(e);
        }}>
          <h2 className="text-lg font-semibold mb-4">Answer the Following Queries</h2>
          {FORM_FIELDS.map(({ name, label, required }) => {
             if (name === 'customStyleDetails' && selectedStyle !== 'Custom writing style') {
              return null;
            }
            return (
            <div key={name}>
              <label
                className={`block text-sm font-medium mb-2 ${
                  required && errors[name] ? 'text-red-500' : 'text-gray-700'
                }`}
              >
                {label} {required && '(required)'}
              </label>
              <textarea
                name={name}
                value={formData[name]}
                onChange={handleInputChange}
                className={`w-full border rounded-lg shadow-sm p-3 ${
                  errors[name]
                    ? 'border-red-500'
                    : 'border-gray-300 focus:border-red-500'
                }`}
                rows={name === 'customStyleDetails' ? 8: 3}
                placeholder={`Enter ${label.toLowerCase()}...`}
              />
            </div>
            );
          })}

          {/* "Get Introduction" button with loading */}
          <LoadingButton type="submit" loading={loading}>
            Get Introduction
          </LoadingButton>
        </form>
      </section>

      {/* Generated plan content */}
      {planContent && (
        <section className="mt-8">
          <div className="p-6 bg-white shadow-lg rounded-lg">
            <h2 className="text-xl font-bold mb-4">Generated Output</h2>
            <ReactMarkdown className="prose prose-red">{planContent}</ReactMarkdown>

            {/* Feedback Section */}
            <div className="mt-6">
              <p className="text-lg font-medium mb-4">
                Are you happy with this response or need modifications?
              </p>
              <div className="flex space-x-4">
                {/* Yes Button with its own loading */}
                <LoadingButton
                  onClick={() => handleFeedback('Yes')}
                  loading={yesLoading}
                  className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                >
                  Yes
                </LoadingButton>
                {/* No Button with its own loading */}
                <LoadingButton
                  onClick={() => handleFeedback('No')}
                  loading={noLoading}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                >
                  No
                </LoadingButton>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Modification Input Section (shown when user clicks "No") */}
      {showModificationField && (
        <section className="mt-8">
          <div className="mt-6 p-6 bg-gray-50 border rounded-lg">
            <form onSubmit={handleModificationSubmit}>
              <label
                className={`block text-sm font-medium mb-2 ${
                  modificationError ? 'text-red-500' : 'text-gray-700'
                }`}
              >
                What changes do you want to make in the outline? Please mention here:
              </label>
              <textarea
                value={modificationField}
                onChange={(e) => {
                  setModificationField(e.target.value);
                }}
                className={`w-full border rounded-lg shadow-sm p-3 mb-4 ${
                  modificationError ? 'border-red-500' : 'border-gray-300'
                }`}
                rows={4}
                placeholder="Enter your suggestions..."
              />
              {/* "Submit Changes" with its own loading */}
              <LoadingButton
                type="submit"
                loading={submitChangesLoading}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
              >
                Submit Changes
              </LoadingButton>
            </form>
          </div>
        </section>
      )}

      {/* Render final or modified content */}
      {modificationResponses && (
        <section className="mt-8">
          <div className="p-6 bg-white shadow-lg rounded-lg">
            <h2 className="text-xl font-bold mb-4">Final introduction draft</h2>
            <ReactMarkdown className="prose prose-blue">
              {modificationResponses}
            </ReactMarkdown>
          </div>
        </section>
      )}

      {/* Scroll to Bottom Arrow */}
      {showArrow && (
        <div
          className="cursor-pointer fixed z-10 rounded-full bg-white border border-gray-200
          right-1/2 translate-x-1/2 w-8 h-8 flex items-center justify-center bottom-5"
          onClick={scrollToBottom}
        >
          <BsArrowDownShort size={30} className="text-gray-600" />
        </div>
      )}
    </main>
  );
};

export default MainContent;
