import React, { useState, useEffect } from 'react';
import '../../../assets/style/medical/form/vitalSignForm.css';

interface VitalSignsData {
  height: string;
  heightUnit: string;
  weight: string;
  weightUnit: string;
  bloodPressure: string;
  pulseRate: string;
  temperature: string;
  respiratoryRate: string;
  oxygenSaturation: string;
}

interface VitalSignsProps {
  initialData?: {
    vitalSigns?: {
      height?: number;
      heightUnit?: 'cm' | 'in';
      weight?: number;
      weightUnit?: 'kg' | 'lb';
      bloodPressure?: string;
      pulseRate?: number;
      temperature?: number;
      respiratoryRate?: number;
      oxygenSaturation?: number;
    };
  };
}

const VitalSigns: React.FC<VitalSignsProps> = ({ initialData }) => {
  const [formData, setFormData] = useState<VitalSignsData>({
    height: '',
    heightUnit: 'cm',
    weight: '',
    weightUnit: 'kg',
    bloodPressure: '',
    pulseRate: '',
    temperature: '',
    respiratoryRate: '',
    oxygenSaturation: ''
  });

  // Populate form when initialData changes
  useEffect(() => {
    if (initialData?.vitalSigns) {
      setFormData({
        height: initialData.vitalSigns.height?.toString() || '',
        heightUnit: initialData.vitalSigns.heightUnit || 'cm',
        weight: initialData.vitalSigns.weight?.toString() || '',
        weightUnit: initialData.vitalSigns.weightUnit || 'kg',
        bloodPressure: initialData.vitalSigns.bloodPressure || '',
        pulseRate: initialData.vitalSigns.pulseRate?.toString() || '',
        temperature: initialData.vitalSigns.temperature?.toString() || '',
        respiratoryRate: initialData.vitalSigns.respiratoryRate?.toString() || '',
        oxygenSaturation: initialData.vitalSigns.oxygenSaturation?.toString() || ''
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

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="vital-signs-wrapper">
      <div className="vital-signs-container">
        {/* Header Section */}
        <div className="vital-header">
          <div className="vital-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2L2 7l10 5 10-5-10-5z"/>
              <path d="M2 17l10 5 10-5"/>
              <path d="M2 12l10 5 10-5"/>
            </svg>
          </div>
          <div className="vital-header-text">
            <h2 className="vital-title">Vital Signs</h2>
            <p className="vital-subtitle">Current Vital Measurements</p>
          </div>
        </div>

        {/* Form Content */}
        <div className="vital-content">
          {/* First Row: Height, Weight, Blood Pressure */}
          <div className="vital-row">
            <div className="vital-field">
              <label className="vital-label">Height</label>
              <div className="input-with-dropdown">
                <input
                  type="text"
                  name="height"
                  value={formData.height}
                  onChange={handleInputChange}
                  className="vital-input"
                  placeholder=""
                />
                <select
                  name="heightUnit"
                  value={formData.heightUnit}
                  onChange={handleSelectChange}
                  className="vital-dropdown"
                >
                  <option value="cm">cm</option>
                  <option value="ft">ft</option>
                  <option value="in">in</option>
                </select>
              </div>
            </div>

            <div className="vital-field">
              <label className="vital-label">Weight</label>
              <div className="input-with-dropdown">
                <input
                  type="text"
                  name="weight"
                  value={formData.weight}
                  onChange={handleInputChange}
                  className="vital-input"
                  placeholder=""
                />
                <select
                  name="weightUnit"
                  value={formData.weightUnit}
                  onChange={handleSelectChange}
                  className="vital-dropdown"
                >
                  <option value="kg">kg</option>
                  <option value="lbs">lbs</option>
                </select>
              </div>
            </div>

            <div className="vital-field blood-pressure">
              <label className="vital-label">Blood Pressure</label>
              <div className="input-with-unit">
                <input
                  type="text"
                  name="bloodPressure"
                  value={formData.bloodPressure}
                  onChange={handleInputChange}
                  className="vital-input"
                  placeholder=""
                />
                <span className="unit-label">mmHg</span>
              </div>
            </div>
          </div>

          {/* Second Row: Pulse Rate, Temperature, Respiratory Rate, Oxygen Saturation */}
          <div className="vital-row">
            <div className="vital-field">
              <label className="vital-label">Pulse Rate</label>
              <div className="input-with-unit">
                <input
                  type="text"
                  name="pulseRate"
                  value={formData.pulseRate}
                  onChange={handleInputChange}
                  className="vital-input"
                  placeholder=""
                />
                <span className="unit-label">bpm</span>
              </div>
            </div>

            <div className="vital-field">
              <label className="vital-label">Temperature</label>
              <div className="input-with-unit">
                <input
                  type="text"
                  name="temperature"
                  value={formData.temperature}
                  onChange={handleInputChange}
                  className="vital-input"
                  placeholder=""
                />
                <span className="unit-label">°C</span>
              </div>
            </div>

            <div className="vital-field">
              <label className="vital-label">Respiratory Rate</label>
              <div className="input-with-unit">
                <input
                  type="text"
                  name="respiratoryRate"
                  value={formData.respiratoryRate}
                  onChange={handleInputChange}
                  className="vital-input"
                  placeholder=""
                />
                <span className="unit-label">min</span>
              </div>
            </div>

            <div className="vital-field">
              <label className="vital-label">Oxygen Saturation</label>
              <div className="input-with-unit">
                <input
                  type="text"
                  name="oxygenSaturation"
                  value={formData.oxygenSaturation}
                  onChange={handleInputChange}
                  className="vital-input"
                  placeholder=""
                />
                <span className="unit-label">%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VitalSigns;