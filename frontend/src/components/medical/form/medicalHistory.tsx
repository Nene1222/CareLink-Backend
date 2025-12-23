import React, { useState, useEffect } from 'react';
import '../../../assets/style/medical/form/medicalHistoryForm.css';

interface MedicalHistoryData {
  reasonOfVisit: string;
  allergiesStatus: 'no-known' | 'has-allergies' | '';
  allergiesDetails: string;
  chronicDiseases: string[];
  chronicDiseasesDetails: string;
  pastSurgeries: string;
  familyHistories: string;
  currentMedications: string;
}

interface MedicalHistoryProps {
  initialData?: {
    visit?: {
      reasonOfVisit?: string;
    };
    medicalHistory?: {
      allergiesStatus?: 'no-known' | 'has-allergies';
      allergiesDetails?: string;
      chronicDiseases?: string[];
      chronicDiseasesDetails?: string;
      pastSurgeries?: string;
      familyHistories?: string;
      currentMedications?: string;
    };
  };
}

const MedicalHistory: React.FC<MedicalHistoryProps> = ({ initialData }) => {
  const [formData, setFormData] = useState<MedicalHistoryData>({
    reasonOfVisit: '',
    allergiesStatus: '',
    allergiesDetails: '',
    chronicDiseases: [],
    chronicDiseasesDetails: '',
    pastSurgeries: '',
    familyHistories: '',
    currentMedications: ''
  });

  // Populate form when initialData changes
  useEffect(() => {
    if (initialData) {
      setFormData({
        reasonOfVisit: initialData.visit?.reasonOfVisit || '',
        allergiesStatus: initialData.medicalHistory?.allergiesStatus || '',
        allergiesDetails: initialData.medicalHistory?.allergiesDetails || '',
        chronicDiseases: initialData.medicalHistory?.chronicDiseases || [],
        chronicDiseasesDetails: initialData.medicalHistory?.chronicDiseasesDetails || '',
        pastSurgeries: initialData.medicalHistory?.pastSurgeries || '',
        familyHistories: initialData.medicalHistory?.familyHistories || '',
        currentMedications: initialData.medicalHistory?.currentMedications || ''
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

  const handleAllergiesChange = (status: 'no-known' | 'has-allergies') => {
    setFormData(prev => ({
      ...prev,
      allergiesStatus: status
    }));
  };

  const handleChronicDiseaseToggle = (disease: string) => {
    setFormData(prev => ({
      ...prev,
      chronicDiseases: prev.chronicDiseases.includes(disease)
        ? prev.chronicDiseases.filter(d => d !== disease)
        : [...prev.chronicDiseases, disease]
    }));
  };

  return (
    <div className="medical-history-wrapper">
      <div className="medical-history-container">
        {/* Header Section */}
        <div className="history-header">
          <div className="header-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <circle cx="12" cy="13" r="2"/>
              <path d="M12 15v4"/>
            </svg>
          </div>
          <div className="header-text">
            <h2 className="history-title">Medical History</h2>
            <p className="history-subtitle">Patient's Medical Background And Current Condition</p>
          </div>
        </div>

        {/* Form Content */}
        <div>
          {/* Reason of Visit */}
          <div>
            <label className="section-label">
              Reason of Visit <span className="required">*</span>
            </label>
            <p className="section-hint">What brings the patient in today ?</p>
            <textarea
              name="reasonOfVisit"
              value={formData.reasonOfVisit}
              onChange={handleInputChange}
              className="form-textarea"
              rows={4}
            />
          </div>

          {/* Allergies */}
          <div>
            <label className="section-label">Allergies</label>
            <div className="radio-group">
              <label className="radio-option-inline">
                <input
                  type="radio"
                  name="allergies"
                  checked={formData.allergiesStatus === 'no-known'}
                  onChange={() => handleAllergiesChange('no-known')}
                />
                <span className="radio-label-inline">No Known Allergies</span>
              </label>
              <label className="radio-option-inline">
                <input
                  type="radio"
                  name="allergies"
                  checked={formData.allergiesStatus === 'has-allergies'}
                  onChange={() => handleAllergiesChange('has-allergies')}
                />
                <span className="radio-label-inline">Has Allergies</span>
              </label>
            </div>
            <textarea
              name="allergiesDetails"
              value={formData.allergiesDetails}
              onChange={handleInputChange}
              className="form-textarea small"
              rows={3}
            />
          </div>

          {/* Chronic Diseases */}
          <div>
            <label>Chronic Diseases</label>
            <p className="section-hint">Select all that apply</p>
            <div className="checkbox-group">
              <label className="checkbox-option">
                <input
                  type="checkbox"
                  checked={formData.chronicDiseases.includes('no-known-1')}
                  onChange={() => handleChronicDiseaseToggle('no-known-1')}
                />
                <span className="checkbox-label">No Known Allergies</span>
              </label>
              <label className="checkbox-option">
                <input
                  type="checkbox"
                  checked={formData.chronicDiseases.includes('has-allergies-1')}
                  onChange={() => handleChronicDiseaseToggle('has-allergies-1')}
                />
                <span className="checkbox-label">Has Allergies</span>
              </label>
              <label className="checkbox-option">
                <input
                  type="checkbox"
                  checked={formData.chronicDiseases.includes('no-known-2')}
                  onChange={() => handleChronicDiseaseToggle('no-known-2')}
                />
                <span className="checkbox-label">No Known Allergies</span>
              </label>
              <label className="checkbox-option">
                <input
                  type="checkbox"
                  checked={formData.chronicDiseases.includes('has-allergies-2')}
                  onChange={() => handleChronicDiseaseToggle('has-allergies-2')}
                />
                <span className="checkbox-label">Has Allergies</span>
              </label>
            </div>
            <textarea
              name="chronicDiseasesDetails"
              value={formData.chronicDiseasesDetails}
              onChange={handleInputChange}
              className="form-textarea small"
              rows={3}
            />
          </div>

          {/* Past Surgeries and Family Histories */}
          <div className="form-row-two">
            <div >
              <label className="section-label">Past Surgeries</label>
              <textarea
                name="pastSurgeries"
                value={formData.pastSurgeries}
                onChange={handleInputChange}
                className="form-textarea small"
                rows={3}
              />
            </div>

            <div >
              <label className="section-label">Family Histories</label>
              <textarea
                name="familyHistories"
                value={formData.familyHistories}
                onChange={handleInputChange}
                className="form-textarea small"
                rows={3}
              />
            </div>
          </div>

          {/* Current Medications */}
          <div >
            <label className="section-label">Current Medications</label>
            <textarea
              name="currentMedications"
              value={formData.currentMedications}
              onChange={handleInputChange}
              className="form-textarea large"
              rows={6}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicalHistory;