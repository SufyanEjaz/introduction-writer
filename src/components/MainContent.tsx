'use client';

import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { getIntroduction } from '../services/authService';
import { FORM_FIELDS } from '../config/formFields';
import LoadingButton from './LoadingButton';
import { BsArrowDownShort } from "react-icons/bs";

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
  const modificationFieldRef = useRef<HTMLTextAreaElement | null>(null);
  const [showModificationField, setShowModificationField] = useState(false);
  const [modificationField, setModificationField] = useState('');
  const [modificationResponses, setModificationResponses] = useState<string | null>(null);
  const [modificationError, setModificationError] = useState(false);
  const [showArrow, setShowArrow] = useState(false); // State to control arrow visibility

  // Function to handle scroll
  const handleScroll = () => {
    const totalHeight = document.documentElement.scrollHeight; // Total page height
    const viewportHeight = window.innerHeight; // Viewport height
    const currentScrollPosition = window.scrollY + viewportHeight;

    // Show arrow if not at the bottom, hide if at the bottom
    setShowArrow(currentScrollPosition < totalHeight - 10);
  };

  // Scroll to the bottom of the content
  const scrollToBottom = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight, // Scroll to the bottom of the page
      behavior: 'smooth',
    });
  };

  // Attach and detach scroll listener
  useEffect(() => {
    const scrollListener = () => handleScroll();
    window.addEventListener('scroll', scrollListener);

    return () => {
      window.removeEventListener('scroll', scrollListener);
    };
  }, []);

  // Recheck the arrow visibility when content is appended (planContent changes)
  useEffect(() => {
    if (planContent || showModificationField || modificationResponses) {
      scrollToBottom();
    }
    // handleScroll();
  }, [planContent, showModificationField, modificationResponses]);

  const [yesLoading, setYesLoading] = useState(false);
  const [noLoading, setNoLoading] = useState(false);
  const handleFeedback = async (feedback: string) => {
    if (feedback === 'Yes') {
      setYesLoading(true);
      try {
        const response = await getIntroduction({ user_response: 'Yes' });
      } catch (error) {
        console.error('Error submitting feedback:', error);
      } finally {
        setYesLoading(false);
      }
    } else {
      setNoLoading(true);
      setShowModificationField(true);
      setNoLoading(false);
    }
  };

  const [submitChangesLoading, setSubmitChangesLoading] = useState(false);
  const handleModificationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!modificationField.trim()) {
      setModificationError(true); // Show error styles
      modificationFieldRef.current?.focus(); // Focus the field
      return;
    }

    setSubmitChangesLoading(true);
    try {
      const response = await getIntroduction({ user_response: 'No', changes_recommended: modificationField });
      // setModificationResponses((prev) => [...prev, response?.data || '']);
      const finalDraft = response?.plan || null;
      setModificationResponses(finalDraft);
      setModificationField(''); // Clear the input field
      setModificationError(false); // Clear error styles
    } catch (error) {
      console.error('Error submitting modifications:', error);
      alert('An error occurred while submitting your modifications.');
    } finally {
      setSubmitChangesLoading(false);
    }
  };

  return (
    <main className={`flex-1 p-8 ${sidebarOpen ? '' : 'lg:block hidden'}`}>
      <h1 className="text-3xl font-bold mb-4 text-center">Introduction Writer</h1>

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
        <div className="bg-blue-50 border-l-4 border-blue-500 text-blue-700 p-4">
          You selected the <strong>{selectedStyle}</strong>.
        </div>
      </section>

      <section ref={contentRef}>
        <h2 className="text-lg font-semibold mb-4">Answer Following Queries</h2>
        <form className="space-y-6" onSubmit={handleSubmit}>
          {FORM_FIELDS.map(({ name, label, required }) => (
            <div key={name}>
              <label
                className={`block text-sm font-medium mb-2 ${required && errors[name] ? 'text-red-500' : 'text-gray-700'
                  }`}
              >
                {label} {required && '(required)'}
              </label>
              <textarea
                ref={(el) => (formRefs.current[name] = el)}
                name={name}
                value={(formData as any)[name]}
                onChange={handleInputChange}
                className={`w-full border rounded-lg shadow-sm p-3 ${errors[name] ? 'border-red-500' : 'border-gray-300 focus:border-red-500'
                  }`}
                rows={3}
                placeholder={`Enter ${label.toLowerCase()}...`}
              ></textarea>
            </div>
          ))}

          <LoadingButton
            type="submit"
            loading={loading}
          >
            Get Introduction
          </LoadingButton>
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
                <LoadingButton
                  onClick={() => handleFeedback('Yes')}
                  loading={yesLoading}
                  className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                >
                  Yes
                </LoadingButton>
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

      {/* Modification Input Section */}
      {showModificationField && (
        <section ref={contentRef} className="mt-8">
          <div className="mt-6 p-6 bg-gray-50 border rounded-lg">
            <form onSubmit={handleModificationSubmit}>
              <label
                className={`block text-sm font-medium mb-2 ${modificationError ? 'text-red-500' : 'text-gray-700'
                  }`}
              >
                What changes do you want to make in the outline? Please mention here:
              </label>
              <textarea
                ref={modificationFieldRef}
                value={modificationField}
                onChange={(e) => {
                  setModificationField(e.target.value);
                  setModificationError(false);
                }}
                className={`w-full border rounded-lg shadow-sm p-3 mb-4 ${modificationError ? 'border-red-500' : 'border-gray-300'
                  }`}
                rows={4}
                placeholder="Enter your suggestions..."
              ></textarea>
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


      {/* Render all responses */}
      {modificationResponses && (
        <section ref={contentRef} className="mt-8">
          <div className="p-6 bg-white shadow-lg rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Final introduction draft</h3>
            <ReactMarkdown className="prose prose-blue">{modificationResponses}</ReactMarkdown>
          </div>
        </section>
      )}

      {/* Scroll to Content Button */}
      {showArrow && (
        <div
          className="cursor-pointer fixed z-10 rounded-full bg-white bg-clip-padding border text-token-text-secondary border-token-border-light right-1/2 translate-x-1/2 bg-token-main-surface-primary w-8 h-8 flex items-center justify-center bottom-5"
          onClick={scrollToBottom}
        >
          <BsArrowDownShort size={30} className="text-gray-600" />
        </div>
      )}
    </main>
  );
};

export default MainContent;
