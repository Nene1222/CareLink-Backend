import React, { useState, useRef, useEffect } from 'react';
import '../../assets/style/medical/CompleteMedicalRecord.css';
import type { MedicalRecordData } from './page';
import { medicalRecordService, type MedicalRecord } from '../../services/api/medicalRecordService';

// Import all your form components
import PatientForm from '../../components/medical/form/patientForm';
import MedicalHistory from '../../components/medical/form/medicalHistory';
import VitalSigns from '../../components/medical/form/vitalSignsForm';
import PhysicalExamination from '../../components/medical/form/physicalForm';
import TreatmentPlan from '../../components/medical/form/treatmentForm';

interface CompleteMedicalRecordProps {
  onBack?: () => void;
  editingRecord?: MedicalRecordData | MedicalRecord | null;
  onAddRecord?: (record: MedicalRecordData) => void;
  onUpdateRecord?: (record: MedicalRecordData) => void;
}

const CompleteMedicalRecord: React.FC<CompleteMedicalRecordProps> = ({ 
  onBack, 
  editingRecord,
  onAddRecord,
  onUpdateRecord
}) => {
  const formRef = useRef<HTMLDivElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fullRecord, setFullRecord] = useState<MedicalRecord | null>(null);

  // Fetch full record data when editingRecord is provided
  useEffect(() => {
    const fetchFullRecord = async () => {
      if (editingRecord) {
        try {
          // If editingRecord is already a full MedicalRecord, use it
          if ('patient' in editingRecord && 'visit' in editingRecord) {
            setFullRecord(editingRecord as MedicalRecord);
          } else {
            // Otherwise, fetch it using recordId or _id
            const recordId = (editingRecord as MedicalRecordData).recordId;
            if (recordId) {
              const record = await medicalRecordService.getByRecordId(recordId);
              setFullRecord(record);
            } else if ((editingRecord as any)._id) {
              const record = await medicalRecordService.getById((editingRecord as any)._id);
              setFullRecord(record);
            }
          }
        } catch (err) {
          console.error('Failed to fetch full record:', err);
        }
      } else {
        setFullRecord(null);
      }
    };
    fetchFullRecord();
  }, [editingRecord]);

  // Populate diagnosis fields when fullRecord is loaded
  useEffect(() => {
    if (fullRecord && formRef.current) {
      const diagnosisTextarea = formRef.current.querySelector<HTMLTextAreaElement>('textarea[name="diagnosis"]');
      const testsOrderedTextarea = formRef.current.querySelector<HTMLTextAreaElement>('textarea[name="testsOrdered"]');
      
      if (diagnosisTextarea && fullRecord.diagnosis?.diagnosis) {
        diagnosisTextarea.value = fullRecord.diagnosis.diagnosis;
      }
      if (testsOrderedTextarea && fullRecord.diagnosis?.testsOrdered) {
        testsOrderedTextarea.value = fullRecord.diagnosis.testsOrdered;
      }
    }
  }, [fullRecord]);

  const collectAllFormData = (): Partial<MedicalRecord> => {
    if (!formRef.current) return {};

    // Collect patient form data
    const patientNameInput = formRef.current.querySelector<HTMLInputElement>('input[name="name"]');
    const patientIdInput = formRef.current.querySelector<HTMLInputElement>('input[name="id"]');
    const ageInput = formRef.current.querySelector<HTMLInputElement>('input[name="age"]');
    
    // Get gender from checked radio button - check the label text since radio buttons don't have value attributes
    const genderRadioInputs = formRef.current.querySelectorAll<HTMLInputElement>('input[name="gender"]');
    const checkedGenderRadio = Array.from(genderRadioInputs).find(input => input.checked);
    let gender: 'Female' | 'Male' | 'Other' = 'Other';
    if (checkedGenderRadio) {
      const labelText = checkedGenderRadio.parentElement?.querySelector('.radio-label')?.textContent?.trim() || '';
      if (labelText === 'Female') {
        gender = 'Female';
      } else if (labelText === 'Male') {
        gender = 'Male';
      } else if (labelText === 'Other') {
        gender = 'Other';
      }
    }
    
    const dateOfBirthInput = formRef.current.querySelector<HTMLInputElement>('input[name="dateOfBirth"]');
    const addressInput = formRef.current.querySelector<HTMLInputElement>('input[name="address"]');
    const contactInput = formRef.current.querySelector<HTMLInputElement>('input[name="contactNumber"]');
    const dateOfVisitInput = formRef.current.querySelector<HTMLInputElement>('input[name="dateOfVisit"]');
    
    // Collect medical history
    const reasonOfVisitInput = formRef.current.querySelector<HTMLTextAreaElement>('textarea[name="reasonOfVisit"]');
    // Collect allergies status - radio buttons (name="allergies" in medical history)
    // Check which radio is selected by looking at the parent label text
    const allergiesRadioInputs = formRef.current.querySelectorAll<HTMLInputElement>('input[name="allergies"]');
    const checkedAllergiesRadio = Array.from(allergiesRadioInputs).find(input => input.checked);
    let allergiesStatus: 'no-known' | 'has-allergies' = 'no-known';
    if (checkedAllergiesRadio) {
      const labelText = checkedAllergiesRadio.parentElement?.querySelector('.radio-label-inline')?.textContent?.toLowerCase() || '';
      allergiesStatus = labelText.includes('has allergies') ? 'has-allergies' : 'no-known';
    }
    const allergiesDetailsInput = formRef.current.querySelector<HTMLTextAreaElement>('textarea[name="allergiesDetails"]');
    const currentMedicationsInput = formRef.current.querySelector<HTMLTextAreaElement>('textarea[name="currentMedications"]');
    // Collect chronic diseases - get label text from checked checkboxes
    const chronicDiseasesInputs = formRef.current.querySelectorAll<HTMLInputElement>('.checkbox-group input[type="checkbox"]:checked');
    const chronicDiseases = Array.from(chronicDiseasesInputs).map(input => {
      // Get the label text (next sibling span with class checkbox-label)
      const label = input.parentElement?.querySelector('.checkbox-label');
      return label?.textContent?.trim() || '';
    }).filter(text => text && !text.includes('No Known Allergies') && !text.includes('Has Allergies')); // Filter out placeholder labels
    const chronicDiseasesDetailsInput = formRef.current.querySelector<HTMLTextAreaElement>('textarea[name="chronicDiseasesDetails"]');
    const pastSurgeriesInput = formRef.current.querySelector<HTMLTextAreaElement>('textarea[name="pastSurgeries"]');
    const familyHistoriesInput = formRef.current.querySelector<HTMLTextAreaElement>('textarea[name="familyHistories"]');
    
    // Collect vital signs
    const heightInput = formRef.current.querySelector<HTMLInputElement>('input[name="height"]');
    const heightUnitSelect = formRef.current.querySelector<HTMLSelectElement>('select[name="heightUnit"]');
    const weightInput = formRef.current.querySelector<HTMLInputElement>('input[name="weight"]');
    const weightUnitSelect = formRef.current.querySelector<HTMLSelectElement>('select[name="weightUnit"]');
    const bloodPressureInput = formRef.current.querySelector<HTMLInputElement>('input[name="bloodPressure"]');
    const pulseRateInput = formRef.current.querySelector<HTMLInputElement>('input[name="pulseRate"]');
    const temperatureInput = formRef.current.querySelector<HTMLInputElement>('input[name="temperature"]');
    const respiratoryRateInput = formRef.current.querySelector<HTMLInputElement>('input[name="respiratoryRate"]');
    const oxygenSaturationInput = formRef.current.querySelector<HTMLInputElement>('input[name="oxygenSaturation"]');
    
    // Collect physical examination
    const generalAppearanceInput = formRef.current.querySelector<HTMLTextAreaElement>('textarea[name="generalAppearance"]');
    const cardiovascularInput = formRef.current.querySelector<HTMLTextAreaElement>('textarea[name="cardiovascular"]');
    const respiratoryInput = formRef.current.querySelector<HTMLTextAreaElement>('textarea[name="respiratory"]');
    const abdominalInput = formRef.current.querySelector<HTMLTextAreaElement>('textarea[name="abdominal"]');
    const neurologicalInput = formRef.current.querySelector<HTMLTextAreaElement>('textarea[name="neurological"]');
    const additionalFindingsInput = formRef.current.querySelector<HTMLTextAreaElement>('textarea[name="additionalFindings"]');
    
    // Collect diagnosis
    const diagnosisTextarea = formRef.current.querySelector<HTMLTextAreaElement>('textarea[name="diagnosis"]');
    const testsOrderedTextarea = formRef.current.querySelector<HTMLTextAreaElement>('textarea[name="testsOrdered"]');
    
    // Collect treatment plan
    const medicationsPrescribedInput = formRef.current.querySelector<HTMLTextAreaElement>('textarea[name="medicationsPrescribed"]');
    const proceduresPerformedInput = formRef.current.querySelector<HTMLTextAreaElement>('textarea[name="proceduresPerformed"]');
    const instructionInput = formRef.current.querySelector<HTMLTextAreaElement>('textarea[name="instruction"]');
    
    // Default doctor (can be made dynamic)
    const doctor = 'Dr. Michael Chen';

    // Calculate age from date of birth if not provided
    let age = parseInt(ageInput?.value || '0');
    if (!age && dateOfBirthInput?.value) {
      const birthDate = new Date(dateOfBirthInput.value);
      const today = new Date();
      age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
    }

    return {
      patient: {
        name: patientNameInput?.value || '',
        id: patientIdInput?.value || '',
        gender: gender, // Use the gender extracted from radio button label
        dateOfBirth: dateOfBirthInput?.value || new Date().toISOString(),
        age: age || 0,
        address: addressInput?.value || '',
        contactNumber: contactInput?.value || ''
      },
      visit: {
        dateOfVisit: dateOfVisitInput?.value || new Date().toISOString(),
        doctor: doctor,
        reasonOfVisit: reasonOfVisitInput?.value || ''
      },
      medicalHistory: {
        allergiesStatus: allergiesStatus,
        allergiesDetails: allergiesDetailsInput?.value || '',
        currentMedications: currentMedicationsInput?.value || '',
        chronicDiseases: chronicDiseases,
        chronicDiseasesDetails: chronicDiseasesDetailsInput?.value || '',
        pastSurgeries: pastSurgeriesInput?.value || '',
        familyHistories: familyHistoriesInput?.value || ''
      },
      vitalSigns: {
        height: parseFloat(heightInput?.value || '0'),
        heightUnit: (heightUnitSelect?.value as 'cm' | 'in') || 'cm',
        weight: parseFloat(weightInput?.value || '0'),
        weightUnit: (weightUnitSelect?.value as 'kg' | 'lb') || 'kg',
        bloodPressure: bloodPressureInput?.value || '',
        pulseRate: pulseRateInput?.value ? parseFloat(pulseRateInput.value) : undefined,
        temperature: temperatureInput?.value ? parseFloat(temperatureInput.value) : undefined,
        respiratoryRate: respiratoryRateInput?.value ? parseFloat(respiratoryRateInput.value) : undefined,
        oxygenSaturation: oxygenSaturationInput?.value ? parseFloat(oxygenSaturationInput.value) : undefined
      },
      physicalExamination: {
        generalAppearance: generalAppearanceInput?.value || '',
        cardiovascular: cardiovascularInput?.value || '',
        respiratory: respiratoryInput?.value || '',
        abdominal: abdominalInput?.value || '',
        neurological: neurologicalInput?.value || '',
        additionalFindings: additionalFindingsInput?.value || ''
      },
      diagnosis: {
      diagnosis: diagnosisTextarea?.value || '',
        testsOrdered: testsOrderedTextarea?.value || ''
      },
      treatmentPlan: {
        medicationsPrescribed: medicationsPrescribedInput?.value || '',
        proceduresPerformed: proceduresPerformedInput?.value || '',
        instruction: instructionInput?.value || ''
      }
    };
  };

  const handleSubmit = async () => {
    const formData = collectAllFormData();
    
    // Validate required fields
    if (!formData.patient?.name || !formData.patient?.id) {
      alert('Please fill in at least Patient Name and Patient ID');
      return;
    }

    if (!formData.patient?.gender) {
      alert('Please select Patient Gender');
      return;
    }

    if (!formData.patient?.dateOfBirth) {
      alert('Please fill in Date of Birth');
      return;
    }

    if (!formData.visit?.dateOfVisit || !formData.visit?.doctor) {
      alert('Please fill in Date of Visit and Doctor name');
      return;
    }

    if (!formData.medicalHistory?.allergiesStatus) {
      alert('Please select Allergies Status');
      return;
    }

    if (!formData.vitalSigns?.height || !formData.vitalSigns?.weight || !formData.vitalSigns?.heightUnit || !formData.vitalSigns?.weightUnit) {
      alert('Please fill in Height, Weight, and their units in Vital Signs section');
      return;
    }

    setIsSubmitting(true);

    try {
      const recordId = fullRecord?.recordId || (editingRecord as any)?.recordId || `MR-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`;
      
      const recordToSave: Partial<MedicalRecord> = {
        ...formData,
      recordId,
      status: 'Completed'
    };

      // Log the data being sent for debugging
      console.log('Sending medical record data:', JSON.stringify(recordToSave, null, 2));

      if (fullRecord || editingRecord) {
        // Update existing record
        const recordIdToUpdate = fullRecord?._id || fullRecord?.id || (editingRecord as any)?._id || (editingRecord as any)?.id || '';
        if (recordIdToUpdate) {
          await medicalRecordService.update(recordIdToUpdate, recordToSave);
        alert('Medical record updated successfully!');
      } else {
          throw new Error('Cannot update: Record ID not found');
      }
    } else {
        // Create new record
        await medicalRecordService.create(recordToSave);
        alert('Medical record submitted successfully!');
      }

      // Call parent callbacks if provided
      if (onAddRecord && !fullRecord && !editingRecord) {
        onAddRecord({} as MedicalRecordData); // Trigger reload
      }
      if (onUpdateRecord && (fullRecord || editingRecord)) {
        onUpdateRecord({} as MedicalRecordData); // Trigger reload
      }

      // Navigate back
      if (onBack) {
        onBack();
      }
    } catch (err: any) {
      console.error('Failed to save medical record:', err);
      console.error('Error object:', err);
      // Extract error message from API response
      const errorMessage = err.data?.error || err.message || 'Failed to save medical record. Please try again.';
      const errorDetails = err.data?.details || (err.data?.missing ? JSON.stringify(err.data.missing, null, 2) : '');
      alert(`${errorMessage}${errorDetails ? '\n\nMissing fields:\n' + errorDetails : ''}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveDraft = async () => {
    const formData = collectAllFormData();
    
    if (!formData.patient?.name || !formData.patient?.id) {
      alert('Please fill in at least Patient Name and Patient ID');
      return;
    }

    setIsSubmitting(true);

    try {
      const recordId = fullRecord?.recordId || (editingRecord as any)?.recordId || `MR-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`;
      
      const recordToSave: Partial<MedicalRecord> = {
        ...formData,
      recordId,
      status: 'Daft'
    };

      if (fullRecord || editingRecord) {
        // Update existing record
        const recordIdToUpdate = fullRecord?._id || fullRecord?.id || (editingRecord as any)?._id || (editingRecord as any)?.id || '';
        if (recordIdToUpdate) {
          await medicalRecordService.update(recordIdToUpdate, recordToSave);
        alert('Medical record saved as draft!');
      } else {
          throw new Error('Cannot update: Record ID not found');
      }
    } else {
        // Create new record
        await medicalRecordService.create(recordToSave);
        alert('Medical record saved as draft!');
      }

      // Call parent callbacks if provided
      if (onAddRecord && !fullRecord && !editingRecord) {
        onAddRecord({} as MedicalRecordData); // Trigger reload
      }
      if (onUpdateRecord && (fullRecord || editingRecord)) {
        onUpdateRecord({} as MedicalRecordData); // Trigger reload
      }

      // Navigate back
      if (onBack) {
        onBack();
      }
    } catch (err: any) {
      console.error('Failed to save medical record:', err);
      alert(err.message || 'Failed to save medical record. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="complete-medical-record-page" ref={formRef}>
      {/* Header Section - Same as default medical records page */}
      <div className="header">
        <div className="header-left">
          {onBack && (
            <button className="back-button" onClick={onBack} style={{ marginRight: '20px' }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
            </button>
          )}
          <div>
            <h1 className="title">Medical Record</h1>
            <p className="subtitle">Manage Organization</p>
          </div>
        </div>
      </div>

      {/* Forms Container */}
      <div className="forms-container">
        {/* 1. Patient Information */}
        <div className="form-section">
          <PatientForm initialData={fullRecord || undefined} />
        </div>

        {/* 2. Medical History */}
        <div className="form-section">
          <MedicalHistory initialData={fullRecord || undefined} />
        </div>

        {/* 3. Vital Signs */}
        <div className="form-section">
          <VitalSigns initialData={fullRecord || undefined} />
        </div>

        {/* 4. Physical Examination */}
        <div className="form-section">
          <PhysicalExamination initialData={fullRecord || undefined} />
        </div>

        {/* 5. Diagnosis & Tests */}
        <div className="form-section">
          <div className="diagnosis-tests-form">
            <div className="diagnosis-header">
              <div className="diagnosis-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                  <polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
              </div>
              <div className="diagnosis-header-text">
                <h2 className="diagnosis-title">Diagnosis & Tests</h2>
                <p className="diagnosis-subtitle">Medical diagnosis and laboratory tests</p>
              </div>
            </div>
            <div className="diagnosis-content">
              <div className="diagnosis-field">
                <label className="diagnosis-label">Diagnosis</label>
                <textarea name="diagnosis" className="diagnosis-textarea input-short" rows={4} placeholder="Enter diagnosis"></textarea>
              </div>
              <div className="diagnosis-field">
                <label className="diagnosis-label">Tests Ordered</label>
                <textarea name="testsOrdered" className="diagnosis-textarea input-short" rows={4} placeholder="Enter tests ordered"></textarea>
              </div>
            </div>
          </div>
        </div>

        {/* 6. Treatment Plan */}
        <div className="form-section">
          <TreatmentPlan initialData={fullRecord || undefined} />
        </div>
      </div>

      {/* Bottom Action Buttons */}
      <div className="bottom-actions">
        <button className="btn-secondary-large" onClick={handleSaveDraft} disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save as Draft'}
        </button>
        <button className="btn-primary-large" onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Submit Medical Record'}
        </button>
      </div>
    </div>
  );
};

export default CompleteMedicalRecord;

