import React from 'react';
import '../../assets/style/medical/medicalRecordDetails.css';
import type { MedicalRecord } from '../../services/api/medicalRecordService';

interface MedicalRecordDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  record?: MedicalRecord | null;
}

const MedicalRecordDetails: React.FC<MedicalRecordDetailsProps> = ({
  isOpen,
  onClose,
  record
}) => {
  if (!isOpen || !record) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <>
      {/* Overlay */}
      <div className="modal-overlay" onClick={onClose}></div>

      {/* Modal */}
      <div className="medical-details-modal">
        {/* Header */}
        <div className="modal-header">
          <div>
            <h2 className="modal-title">Medical Record Details</h2>
            <p className="modal-subtitle">Complete medical record information for {record.patient.name}</p>
          </div>
          <button className="close-btn" onClick={onClose}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="modal-content">
          {/* Patient Information */}
          <section className="details-section">
            <div className="section-header">
              <svg className="section-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              <h3 className="section-title">Patient Information</h3>
            </div>
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">Name</span>
                <span className="info-value">{record.patient.name}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Patient ID</span>
                <span className="info-value">{record.patient.id}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Age</span>
                <span className="info-value">{record.patient.age} years</span>
              </div>
              <div className="info-item">
                <span className="info-label">Gender</span>
                <span className="info-value">{record.patient.gender}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Date of Birth</span>
                <span className="info-value">{formatDate(record.patient.dateOfBirth)}</span>
              </div>
              {record.patient.address && (
                <div className="info-item full-width">
                  <span className="info-label">Address</span>
                  <span className="info-value">{record.patient.address}</span>
                </div>
              )}
              {record.patient.contactNumber && (
                <div className="info-item">
                  <span className="info-label">Contact Number</span>
                  <span className="info-value">{record.patient.contactNumber}</span>
                </div>
              )}
            </div>
          </section>

          {/* Visit Information */}
          <section className="details-section">
            <div className="section-header">
              <svg className="section-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
              <h3 className="section-title">Visit Information</h3>
            </div>
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">Date of Visit</span>
                <span className="info-value">{formatDate(record.visit.dateOfVisit)}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Record ID</span>
                <span className="info-value">{record.recordId}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Doctor</span>
                <span className="info-value">{record.visit.doctor}</span>
              </div>
            </div>
            {record.visit.reasonOfVisit && (
              <div className="info-item full-width">
                <span className="info-label">Reason of Visit</span>
                <span className="info-value">{record.visit.reasonOfVisit}</span>
              </div>
            )}
          </section>

          {/* Vital Signs */}
          <section className="details-section">
            <div className="section-header">
              <svg className="section-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
              </svg>
              <h3 className="section-title">Vital Signs</h3>
            </div>
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">Height</span>
                <span className="info-value">{record.vitalSigns.height} {record.vitalSigns.heightUnit}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Weight</span>
                <span className="info-value">{record.vitalSigns.weight} {record.vitalSigns.weightUnit}</span>
              </div>
              {record.vitalSigns.bmi && (
                <div className="info-item">
                  <span className="info-label">BMI</span>
                  <span className="info-value">{record.vitalSigns.bmi.toFixed(2)}</span>
                </div>
              )}
              {record.vitalSigns.bloodPressure && (
                <div className="info-item">
                  <span className="info-label">Blood Pressure</span>
                  <span className="info-value">{record.vitalSigns.bloodPressure}</span>
                </div>
              )}
              {record.vitalSigns.pulseRate && (
                <div className="info-item">
                  <span className="info-label">Pulse Rate</span>
                  <span className="info-value">{record.vitalSigns.pulseRate} bpm</span>
                </div>
              )}
              {record.vitalSigns.temperature && (
                <div className="info-item">
                  <span className="info-label">Temperature</span>
                  <span className="info-value">{record.vitalSigns.temperature}°C</span>
                </div>
              )}
              {record.vitalSigns.respiratoryRate && (
                <div className="info-item">
                  <span className="info-label">Respiratory Rate</span>
                  <span className="info-value">{record.vitalSigns.respiratoryRate} /min</span>
                </div>
              )}
              {record.vitalSigns.oxygenSaturation && (
                <div className="info-item">
                  <span className="info-label">O2 Saturation</span>
                  <span className="info-value">{record.vitalSigns.oxygenSaturation}%</span>
                </div>
              )}
            </div>
          </section>

          {/* Medical Details */}
          <section className="details-section">
            <div className="section-header">
              <svg className="section-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
              <h3 className="section-title">Medical Details</h3>
            </div>
            <div className="detail-block">
              <span className="detail-label">Allergies</span>
              <p className="detail-text">
                {record.medicalHistory.allergiesStatus === 'has-allergies'
                  ? (record.medicalHistory.allergiesDetails || 'Has allergies')
                  : 'No known allergies'}
              </p>
            </div>
            {record.medicalHistory.currentMedications && (
              <div className="detail-block">
                <span className="detail-label">Current Medications</span>
                <p className="detail-text">{record.medicalHistory.currentMedications}</p>
              </div>
            )}
            {record.medicalHistory.chronicDiseases && record.medicalHistory.chronicDiseases.length > 0 && (
              <div className="detail-block">
                <span className="detail-label">Chronic Diseases</span>
                <p className="detail-text">{record.medicalHistory.chronicDiseases.join(', ')}</p>
              </div>
            )}
            {record.medicalHistory.pastSurgeries && (
              <div className="detail-block">
                <span className="detail-label">Past Surgeries</span>
                <p className="detail-text">{record.medicalHistory.pastSurgeries}</p>
              </div>
            )}
            {record.medicalHistory.familyHistories && (
              <div className="detail-block">
                <span className="detail-label">Family History</span>
                <p className="detail-text">{record.medicalHistory.familyHistories}</p>
              </div>
            )}
            {record.physicalExamination && (
              <>
                {record.physicalExamination.generalAppearance && (
                  <div className="detail-block">
                    <span className="detail-label">General Appearance</span>
                    <p className="detail-text">{record.physicalExamination.generalAppearance}</p>
                  </div>
                )}
                {record.physicalExamination.cardiovascular && (
                  <div className="detail-block">
                    <span className="detail-label">Cardiovascular</span>
                    <p className="detail-text">{record.physicalExamination.cardiovascular}</p>
                  </div>
                )}
                {record.physicalExamination.respiratory && (
                  <div className="detail-block">
                    <span className="detail-label">Respiratory</span>
                    <p className="detail-text">{record.physicalExamination.respiratory}</p>
                  </div>
                )}
                {record.physicalExamination.abdominal && (
                  <div className="detail-block">
                    <span className="detail-label">Abdominal</span>
                    <p className="detail-text">{record.physicalExamination.abdominal}</p>
                  </div>
                )}
                {record.physicalExamination.neurological && (
                  <div className="detail-block">
                    <span className="detail-label">Neurological</span>
                    <p className="detail-text">{record.physicalExamination.neurological}</p>
                  </div>
                )}
                {record.physicalExamination.additionalFindings && (
                  <div className="detail-block">
                    <span className="detail-label">Additional Findings</span>
                    <p className="detail-text">{record.physicalExamination.additionalFindings}</p>
                  </div>
                )}
              </>
            )}
            {record.diagnosis?.diagnosis && (
              <div className="detail-block">
                <span className="detail-label">Diagnosis</span>
                <p className="detail-text">{record.diagnosis.diagnosis}</p>
              </div>
            )}
            {record.diagnosis?.testsOrdered && (
              <div className="detail-block">
                <span className="detail-label">Tests Ordered</span>
                <p className="detail-text">{record.diagnosis.testsOrdered}</p>
              </div>
            )}
            {record.treatmentPlan?.medicationsPrescribed && (
              <div className="detail-block">
                <span className="detail-label">Medications Prescribed</span>
                <p className="detail-text">{record.treatmentPlan.medicationsPrescribed}</p>
              </div>
            )}
            {record.treatmentPlan?.proceduresPerformed && (
              <div className="detail-block">
                <span className="detail-label">Procedures Performed</span>
                <p className="detail-text">{record.treatmentPlan.proceduresPerformed}</p>
              </div>
            )}
            {record.treatmentPlan?.instruction && (
              <div className="detail-block">
                <span className="detail-label">Instructions</span>
                <p className="detail-text">{record.treatmentPlan.instruction}</p>
              </div>
            )}
            <div className="detail-block">
              <span className="detail-label">Status</span>
              <span className={`status-badge-inline ${record.status.toLowerCase()}`}>
                {record.status}
              </span>
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default MedicalRecordDetails;