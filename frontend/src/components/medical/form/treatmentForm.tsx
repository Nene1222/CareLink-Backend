import React, { useState, useEffect } from 'react';
import '../../../assets/style/medical/form/treatmentForm.css';

interface TreatmentPlanData {
  medicationsPrescribed: string;
  proceduresPerformed: string;
  instruction: string;
}

interface TreatmentPlanProps {
  initialData?: {
    treatmentPlan?: {
      medicationsPrescribed?: string;
      proceduresPerformed?: string;
      instruction?: string;
    };
  };
}

const TreatmentPlan: React.FC<TreatmentPlanProps> = ({ initialData }) => {
  const [formData, setFormData] = useState<TreatmentPlanData>({
    medicationsPrescribed: '',
    proceduresPerformed: '',
    instruction: ''
  });

  // Populate form when initialData changes
  useEffect(() => {
    if (initialData?.treatmentPlan) {
      setFormData({
        medicationsPrescribed: initialData.treatmentPlan.medicationsPrescribed || '',
        proceduresPerformed: initialData.treatmentPlan.proceduresPerformed || '',
        instruction: initialData.treatmentPlan.instruction || ''
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
    <div className="treatment-plan-wrapper">
      <div className="treatment-plan-container">
        {/* Header Section */}
        <div className="treatment-header">
          <div className="treatment-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="8" width="18" height="12" rx="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M7 8V6a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="12" cy="14" r="2"/>
            </svg>
          </div>
          <div className="treatment-header-text">
            <h2 className="treatment-title">Treatment Plan</h2>
            <p className="treatment-subtitle">Prescribed medications and care instructions</p>
          </div>
        </div>

        {/* Form Content */}
        <div className="treatment-content">
          {/* Medications Prescribed */}
          <div className="treatment-section">
            <label className="treatment-label">Medications Prescribed</label>
            <p className="treatment-hint">Include drug name, dosage, frequency, and duration</p>
            <textarea
              name="medicationsPrescribed"
              value={formData.medicationsPrescribed}
              onChange={handleInputChange}
              className="treatment-textarea"
              rows={5}
            />
          </div>

          {/* Procedures Performed */}
          <div className="treatment-section">
            <label className="treatment-label">Procedures Performed</label>
            <textarea
              name="proceduresPerformed"
              value={formData.proceduresPerformed}
              onChange={handleInputChange}
              className="treatment-textarea small"
              rows={3}
            />
          </div>

          {/* Instruction */}
          <div className="treatment-section">
            <label className="treatment-label">Instruction</label>
            <p className="treatment-hint">Lifestyle advice, precautions, and self-care instructions</p>
            <textarea
              name="instruction"
              value={formData.instruction}
              onChange={handleInputChange}
              className="treatment-textarea large"
              rows={6}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TreatmentPlan;