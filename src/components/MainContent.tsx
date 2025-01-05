'use client';

import React from 'react';

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
}) => {
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
  );
};

export default MainContent;
