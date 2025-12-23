import React, { useState, useEffect } from 'react';
import '../../../assets/style/medical/form/physicalForm.css';

interface PhysicalExaminationData {
  generalAppearance: string;
  cardiovascular: string;
  respiratory: string;
  abdominal: string;
  neurological: string;
  additionalFindings: string;
}

interface PhysicalExaminationProps {
  initialData?: {
    physicalExamination?: {
      generalAppearance?: string;
      cardiovascular?: string;
      respiratory?: string;
      abdominal?: string;
      neurological?: string;
      additionalFindings?: string;
    };
  };
}

const PhysicalExamination: React.FC<PhysicalExaminationProps> = ({ initialData }) => {
  const [formData, setFormData] = useState<PhysicalExaminationData>({
    generalAppearance: '',
    cardiovascular: '',
    respiratory: '',
    abdominal: '',
    neurological: '',
    additionalFindings: ''
  });

  // Populate form when initialData changes
  useEffect(() => {
    if (initialData?.physicalExamination) {
      setFormData({
        generalAppearance: initialData.physicalExamination.generalAppearance || '',
        cardiovascular: initialData.physicalExamination.cardiovascular || '',
        respiratory: initialData.physicalExamination.respiratory || '',
        abdominal: initialData.physicalExamination.abdominal || '',
        neurological: initialData.physicalExamination.neurological || '',
        additionalFindings: initialData.physicalExamination.additionalFindings || ''
      });
    }
  }, [initialData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="physical-exam-wrapper">
      <div className="physical-exam-container">
        {/* Header Section */}
        <div className="exam-header">
          <div className="exam-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
              <path d="M12 5v6"/>
              <path d="M9 8h6"/>
            </svg>
          </div>
          <div className="exam-header-text">
            <h2 className="exam-title">Physical Examination</h2>
            <p className="exam-subtitle">Detailed examination findings by system</p>
          </div>
        </div>

        {/* Form Content */}
        <div className="exam-content">
          {/* General Appearance */}
          <div className="exam-section full-width">
            <label className="exam-label">General Appearance</label>
            <textarea
              name="generalAppearance"
              value={formData.generalAppearance}
              onChange={handleInputChange}
              className="exam-textarea"
              rows={3}
            />
          </div>

          {/* Cardiovascular and Respiratory */}
          <div className="exam-row">
            <div className="exam-section">
              <label className="exam-label">Cardiovascular</label>
              <textarea
                name="cardiovascular"
                value={formData.cardiovascular}
                onChange={handleInputChange}
                className="exam-textarea"
                rows={3}
              />
            </div>

            <div className="exam-section">
              <label className="exam-label">Respiratory</label>
              <textarea
                name="respiratory"
                value={formData.respiratory}
                onChange={handleInputChange}
                className="exam-textarea"
                rows={3}
              />
            </div>
          </div>

          {/* Abdominal and Neurological */}
          <div className="exam-row">
            <div className="exam-section">
              <label className="exam-label">Abdominal</label>
              <textarea
                name="abdominal"
                value={formData.abdominal}
                onChange={handleInputChange}
                className="exam-textarea"
                rows={3}
              />
            </div>

            <div className="exam-section">
              <label className="exam-label">Neurological</label>
              <textarea
                name="neurological"
                value={formData.neurological}
                onChange={handleInputChange}
                className="exam-textarea"
                rows={3}
              />
            </div>
          </div>

          {/* Additional Findings */}
          <div className="exam-section full-width">
            <label className="exam-label">Additional Findings</label>
            <textarea
              name="additionalFindings"
              value={formData.additionalFindings}
              onChange={handleInputChange}
              className="exam-textarea large"
              rows={6}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhysicalExamination;