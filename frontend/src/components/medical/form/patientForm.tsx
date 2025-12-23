import React, { useState, useEffect } from 'react';
import '../../../assets/style/medical/form/patientForm.css';

interface PatientFormData {
  name: string;
  gender: 'Female' | 'Male' | 'Other' | '';
  dateOfBirth: string;
  age: string;
  id: string;
  address: string;
  contactNumber: string;
  dateOfVisit: string;
}

interface PatientFormProps {
  initialData?: {
    patient?: {
      name?: string;
      gender?: 'Female' | 'Male' | 'Other';
      dateOfBirth?: string | Date;
      age?: number;
      id?: string;
      address?: string;
      contactNumber?: string;
    };
    visit?: {
      dateOfVisit?: string | Date;
    };
  };
}

const PatientForm: React.FC<PatientFormProps> = ({ initialData }) => {
  const [formData, setFormData] = useState<PatientFormData>({
    name: '',
    gender: '',
    dateOfBirth: '',
    age: '',
    id: '',
    address: '',
    contactNumber: '',
    dateOfVisit: ''
  });

  // Populate form when initialData changes
  useEffect(() => {
    if (initialData) {
      const formatDate = (date: string | Date | undefined): string => {
        if (!date) return '';
        const d = date instanceof Date ? date : new Date(date);
        if (isNaN(d.getTime())) return '';
        return d.toISOString().split('T')[0];
      };

      setFormData({
        name: initialData.patient?.name || '',
        gender: initialData.patient?.gender || '',
        dateOfBirth: formatDate(initialData.patient?.dateOfBirth),
        age: initialData.patient?.age?.toString() || '',
        id: initialData.patient?.id || '',
        address: initialData.patient?.address || '',
        contactNumber: initialData.patient?.contactNumber || '',
        dateOfVisit: formatDate(initialData.visit?.dateOfVisit)
      });
    }
  }, [initialData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleGenderChange = (gender: 'Female' | 'Male' | 'Other') => {
    setFormData(prev => ({
      ...prev,
      gender
    }));
  };

  return (
    <div className="patient-form-wrapper">
      <div className="patient-form-container">
        {/* Header Section */}
        <div className="form-header">
          <div className="avatar-icon">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>
          </div>
          <div className="header-text">
            <h2 className="form-title">Patient Information</h2>
            <p className="form-subtitle">Basic patients details and contacts information</p>
          </div>
        </div>

        {/* Form Fields */}
        <div className="form-content">
          {/* Name and Gender Row */}
          <div className="form-row">
            <div className="form-group full-width">
              <label className="form-label">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Clinic CareLink Network"
              />
            </div>

            <div className="form-group full-width">
              <label className="form-label">Gender</label>
              <div className="gender-options">
                <label className="radio-option">
                  <input
                    type="radio"
                    name="gender"
                    checked={formData.gender === 'Female'}
                    onChange={() => handleGenderChange('Female')}
                  />
                  <span className="radio-label">Female</span>
                </label>
                <label className="radio-option">
                  <input
                    type="radio"
                    name="gender"
                    checked={formData.gender === 'Male'}
                    onChange={() => handleGenderChange('Male')}
                  />
                  <span className="radio-label">Male</span>
                </label>
                <label className="radio-option">
                  <input
                    type="radio"
                    name="gender"
                    checked={formData.gender === 'Other'}
                    onChange={() => handleGenderChange('Other')}
                  />
                  <span className="radio-label">Other</span>
                </label>
              </div>
            </div>
          </div>

          {/* Date of Birth, Age, ID Row */}
          <div className="form-row three-cols">
            <div className="form-group">
              <label className="form-label">Date of Birth</label>
              <div className="input-with-icon">
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Age</label>
              <input
                type="text"
                name="age"
                value={formData.age}
                onChange={handleInputChange}
                className="form-input"
                placeholder=""
              />
            </div>

            <div className="form-group">
              <label className="form-label">ID</label>
              <input
                type="text"
                name="id"
                value={formData.id}
                onChange={handleInputChange}
                className="form-input"
                placeholder=""
              />
            </div>
          </div>

          {/* Address and Contact Number Row */}
          <div className="form-row">
            <div className="form-group full-width">
              <label className="form-label">Address</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className="form-input"
                placeholder=""
              />
            </div>

            <div className="form-group full-width">
              <label className="form-label">Contact Number</label>
              <input
                type="tel"
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleInputChange}
                className="form-input"
                placeholder=""
              />
            </div>
          </div>

          {/* Date of Visit Row */}
          <div className="form-row">
            <div className="form-group full-width">
              <label className="form-label">Date Of Visit</label>
              <input
                type="date"
                name="dateOfVisit"
                value={formData.dateOfVisit}
                onChange={handleInputChange}
                className="form-input"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientForm;