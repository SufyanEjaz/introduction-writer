'use client';

import { useState, useRef } from 'react';
import { getIntroduction } from '@/services/authService';

interface FormDataType {
  [key: string]: string;
}

interface Errors {
  [key: string]: boolean;
}

interface FilePayload {
  theoreticalFrameworkFiles: File[];
  relevantTheoryFiles: File[];
  supportingLiteratureFiles: File[];
}

const useIntroductionForm = () => {
  // 1. Writing style
  const [selectedStyle, setSelectedStyle] = useState('AOM writing style');

  // 2. Basic form data
  const [formData, setFormData] = useState<FormDataType>({
    customStyleDetails: '',
    mainQuery: '',
    centralPhenomenon: '',
    context: '',
    independentVariable: '',
    boundaryConditions: '',
    mediators: '',
    background: '',
    significance: '',
    proposedHypothesis: '',
    underpinningTheories: '',
    researchMethodology: '',
    journalScope: '',
    mustIncludeArgument: '',
    instructions: '',
    user_id: '45',
    user_email: 'abc@abc.com',
  });

  // 3. Manage errors and loading
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);

  // 4. The final plan (introduction) text from the server
  const [planContent, setPlanContent] = useState<string | null>(null);

  // 5. For modifications
  const [showModificationField, setShowModificationField] = useState(false);
  const [modificationField, setModificationField] = useState('');
  const [modificationResponses, setModificationResponses] = useState<string | null>(null);
  const [modificationError, setModificationError] = useState(false);

  // Refs for focusing on error fields
  const formRefs = useRef<{ [key: string]: HTMLTextAreaElement | null }>({});

  // ---- HANDLE INPUT CHANGES ----
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: false }));
  };

  // ---- VALIDATION ----
  const validateForm = (includeCustomStyle: boolean): boolean => {
    const newErrors: Errors = {};
    const requiredFields = ['mainQuery', 'centralPhenomenon', 'context', 'independentVariable','significance', 'proposedHypothesis'];

    // Include `customStyleDetails` if "Custom writing style" is selected
    if (includeCustomStyle) {
      requiredFields.push('customStyleDetails');
    }

    requiredFields.forEach((field) => {
      if (!formData[field]?.trim()) {
        newErrors[field] = true;
      }
    });

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      // Focus on the first error
      const firstErrorKey = requiredFields.find((field) => newErrors[field]);
      if (firstErrorKey) {
        formRefs.current[firstErrorKey]?.focus();
      }
      return false;
    }
    return true;
  };

  // ---- SUBMIT THE MAIN FORM (WITH FILES) ----
  /**
   * @param {React.FormEvent} e
   * @param {FilePayload} files  -> optional param for your files
   */
  const handleSubmit = async (e: React.FormEvent, files?: FilePayload) => {
    e.preventDefault();

    const includeCustomStyle = selectedStyle === 'Custom writing style';

    if (!validateForm(includeCustomStyle)) return;
    setLoading(true);

    try {
      // 1. Build the FormData
      const payload = new FormData();

      // Append text fields
      Object.entries(formData).forEach(([key, value]) => {
        // Exclude `customStyleDetails` if not required
        if (key === 'customStyleDetails' && !includeCustomStyle) return;
        payload.append(key, value);
      });
      console.log(payload)
      // Append the selected style
      payload.append('selectedStyle', selectedStyle);

      // If files are provided, append them
      if (files) {
        const {
          theoreticalFrameworkFiles,
          relevantTheoryFiles,
          supportingLiteratureFiles,
        } = files;

        theoreticalFrameworkFiles.forEach((file) => {
          payload.append('theoreticalFrameworkFiles', file);
        });

        relevantTheoryFiles.forEach((file) => {
          payload.append('relevantTheoryFiles', file);
        });

        supportingLiteratureFiles.forEach((file) => {
          payload.append('supportingLiteratureFiles', file);
        });
      }

      // 2. Send request with FormData
      const response = await getIntroduction(payload);
      console.log(response);
      const planContentInResponse = response?.plan || null;
      setPlanContent(planContentInResponse);

      setLoading(false);

      // Scroll to the bottom if we have new content
      if (planContentInResponse) {
        window.scrollTo({
          top: document.documentElement.scrollHeight,
          behavior: 'smooth',
        });
      }
    } catch (err: unknown) {
      setLoading(false);
      if (err instanceof Error) {
        console.error(err.message);
      } else {
        console.error('An error occurred while submitting the form.');
      }
    }
  };

  // ---- HANDLE FEEDBACK (YES / NO) ----
  const [yesLoading, setYesLoading] = useState(false);
  const [noLoading, setNoLoading] = useState(false);

  const handleFeedback = async (feedback: 'Yes' | 'No') => {
    if (feedback === 'Yes') {
      setYesLoading(true);
      try {
        const payload = new FormData();
        payload.append('user_response', 'Yes');
        // await getIntroduction(payload);
        alert("Thankyou very much for using our service.")
        // Add any additional logic if needed
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

  // ---- HANDLE MODIFICATIONS ----
  const [submitChangesLoading, setSubmitChangesLoading] = useState(false);

  const handleModificationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!modificationField.trim()) {
      setModificationError(true);
      return;
    }

    setSubmitChangesLoading(true);
    try {
      // If you need to send files again, build FormData here as well
      const payload = new FormData();
      payload.append('user_response', 'No');
      payload.append('changes_recommended', modificationField);
      const response = await getIntroduction(payload);
      const finalDraft = response?.plan || null;
      setModificationResponses(finalDraft);

      // Reset
      setModificationField('');
      setModificationError(false);
    } catch (error) {
      console.error('Error submitting modifications:', error);
    } finally {
      setSubmitChangesLoading(false);
    }
  };

  return {
    // states
    selectedStyle,
    setSelectedStyle,
    formData,
    errors,
    loading,
    planContent,
    modificationResponses,
    showModificationField,
    modificationField,
    modificationError,

    // handlers
    handleInputChange,
    handleSubmit, // accepts e, plus optional file param
    handleFeedback,
    handleModificationSubmit,

    // additional
    setModificationField,

    // optional internal loading states for feedback
    yesLoading,
    noLoading,
    submitChangesLoading,
  };
};

export default useIntroductionForm;
