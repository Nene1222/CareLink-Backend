import jsPDF from 'jspdf'
// import type { MedicalRecord } from '../services/api/medicalRecordService'
import type { MedicalRecord } from '../services/api/medicalRecordService'

export function generateMedicalRecordPDF(record: MedicalRecord): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  })

  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  const margin = 20
  const contentWidth = pageWidth - (margin * 2)
  let yPos = margin

  // Helper function to add a new page if needed
  const checkPageBreak = (requiredSpace: number) => {
    if (yPos + requiredSpace > pageHeight - margin) {
      doc.addPage()
      yPos = margin
    }
  }

  // Helper function to add text with word wrap
  const addWrappedText = (text: string, x: number, y: number, maxWidth: number, fontSize: number = 10) => {
    doc.setFontSize(fontSize)
    const lines = doc.splitTextToSize(text || 'N/A', maxWidth)
    doc.text(lines, x, y)
    return lines.length * (fontSize * 0.4) + 2
  }

  // Header Section
  doc.setFillColor(99, 102, 241) // Indigo color
  doc.rect(0, 0, pageWidth, 40, 'F')
  
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(24)
  doc.setFont('helvetica', 'bold')
  doc.text('MEDICAL RECORD', margin, 25)
  
  doc.setFontSize(12)
  doc.setFont('helvetica', 'normal')
  doc.text(`Record ID: ${record.recordId}`, margin, 35)
  
  yPos = 50

  // Patient Information Section
  doc.setTextColor(0, 0, 0)
  doc.setFontSize(16)
  doc.setFont('helvetica', 'bold')
  doc.text('PATIENT INFORMATION', margin, yPos)
  yPos += 10

  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  
  const patientInfo = [
    ['Name:', record.patient.name],
    ['Patient ID:', record.patient.id],
    ['Gender:', record.patient.gender],
    ['Date of Birth:', new Date(record.patient.dateOfBirth).toLocaleDateString()],
    ['Age:', `${record.patient.age} years`],
    ['Address:', record.patient.address || 'N/A'],
    ['Contact:', record.patient.contactNumber || 'N/A']
  ]

  patientInfo.forEach(([label, value]) => {
    checkPageBreak(8)
    doc.setFont('helvetica', 'bold')
    doc.text(label, margin, yPos)
    doc.setFont('helvetica', 'normal')
    doc.text(value || 'N/A', margin + 40, yPos)
    yPos += 6
  })

  yPos += 5

  // Visit Information Section
  checkPageBreak(15)
  doc.setFontSize(16)
  doc.setFont('helvetica', 'bold')
  doc.text('VISIT INFORMATION', margin, yPos)
  yPos += 10

  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.setFont('helvetica', 'bold')
  doc.text('Date of Visit:', margin, yPos)
  doc.setFont('helvetica', 'normal')
  doc.text(new Date(record.visit.dateOfVisit).toLocaleDateString(), margin + 40, yPos)
  yPos += 6

  doc.setFont('helvetica', 'bold')
  doc.text('Doctor:', margin, yPos)
  doc.setFont('helvetica', 'normal')
  doc.text(record.visit.doctor, margin + 40, yPos)
  yPos += 6

  if (record.visit.reasonOfVisit) {
    doc.setFont('helvetica', 'bold')
    doc.text('Reason of Visit:', margin, yPos)
    yPos += 6
    doc.setFont('helvetica', 'normal')
    yPos += addWrappedText(record.visit.reasonOfVisit, margin, yPos, contentWidth, 10)
  }

  yPos += 5

  // Medical History Section
  checkPageBreak(20)
  doc.setFontSize(16)
  doc.setFont('helvetica', 'bold')
  doc.text('MEDICAL HISTORY', margin, yPos)
  yPos += 10

  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  
  doc.setFont('helvetica', 'bold')
  doc.text('Allergies:', margin, yPos)
  doc.setFont('helvetica', 'normal')
  const allergiesText = record.medicalHistory.allergiesStatus === 'has-allergies' 
    ? (record.medicalHistory.allergiesDetails || 'Has allergies')
    : 'No known allergies'
  yPos += addWrappedText(allergiesText, margin, yPos, contentWidth, 10) + 3

  if (record.medicalHistory.currentMedications) {
    checkPageBreak(15)
    doc.setFont('helvetica', 'bold')
    doc.text('Current Medications:', margin, yPos)
    yPos += 6
    doc.setFont('helvetica', 'normal')
    yPos += addWrappedText(record.medicalHistory.currentMedications, margin, yPos, contentWidth, 10) + 3
  }

  if (record.medicalHistory.chronicDiseases && record.medicalHistory.chronicDiseases.length > 0) {
    checkPageBreak(10)
    doc.setFont('helvetica', 'bold')
    doc.text('Chronic Diseases:', margin, yPos)
    doc.setFont('helvetica', 'normal')
    doc.text(record.medicalHistory.chronicDiseases.join(', '), margin + 40, yPos)
    yPos += 6
  }

  if (record.medicalHistory.pastSurgeries) {
    checkPageBreak(15)
    doc.setFont('helvetica', 'bold')
    doc.text('Past Surgeries:', margin, yPos)
    yPos += 6
    doc.setFont('helvetica', 'normal')
    yPos += addWrappedText(record.medicalHistory.pastSurgeries, margin, yPos, contentWidth, 10) + 3
  }

  if (record.medicalHistory.familyHistories) {
    checkPageBreak(15)
    doc.setFont('helvetica', 'bold')
    doc.text('Family History:', margin, yPos)
    yPos += 6
    doc.setFont('helvetica', 'normal')
    yPos += addWrappedText(record.medicalHistory.familyHistories, margin, yPos, contentWidth, 10) + 3
  }

  yPos += 5

  // Vital Signs Section
  checkPageBreak(20)
  doc.setFontSize(16)
  doc.setFont('helvetica', 'bold')
  doc.text('VITAL SIGNS', margin, yPos)
  yPos += 10

  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  
  const vitalSigns = [
    ['Height:', `${record.vitalSigns.height} ${record.vitalSigns.heightUnit}`],
    ['Weight:', `${record.vitalSigns.weight} ${record.vitalSigns.weightUnit}`],
    ['BMI:', record.vitalSigns.bmi ? record.vitalSigns.bmi.toFixed(2) : 'N/A'],
    ['Blood Pressure:', record.vitalSigns.bloodPressure || 'N/A'],
    ['Pulse Rate:', record.vitalSigns.pulseRate ? `${record.vitalSigns.pulseRate} bpm` : 'N/A'],
    ['Temperature:', record.vitalSigns.temperature ? `${record.vitalSigns.temperature}°C` : 'N/A'],
    ['Respiratory Rate:', record.vitalSigns.respiratoryRate ? `${record.vitalSigns.respiratoryRate} /min` : 'N/A'],
    ['O2 Saturation:', record.vitalSigns.oxygenSaturation ? `${record.vitalSigns.oxygenSaturation}%` : 'N/A']
  ]

  vitalSigns.forEach(([label, value]) => {
    checkPageBreak(8)
    doc.setFont('helvetica', 'bold')
    doc.text(label, margin, yPos)
    doc.setFont('helvetica', 'normal')
    doc.text(value, margin + 50, yPos)
    yPos += 6
  })

  yPos += 5

  // Physical Examination Section
  if (record.physicalExamination) {
    checkPageBreak(20)
    doc.setFontSize(16)
    doc.setFont('helvetica', 'bold')
    doc.text('PHYSICAL EXAMINATION', margin, yPos)
    yPos += 10

    doc.setFontSize(10)
    const physicalFields = [
      ['General Appearance', record.physicalExamination.generalAppearance],
      ['Cardiovascular', record.physicalExamination.cardiovascular],
      ['Respiratory', record.physicalExamination.respiratory],
      ['Abdominal', record.physicalExamination.abdominal],
      ['Neurological', record.physicalExamination.neurological],
      ['Additional Findings', record.physicalExamination.additionalFindings]
    ]

    physicalFields.forEach(([label, value]) => {
      if (value) {
        checkPageBreak(15)
        doc.setFont('helvetica', 'bold')
        doc.text(`${label}:`, margin, yPos)
        yPos += 6
        doc.setFont('helvetica', 'normal')
        yPos += addWrappedText(value, margin, yPos, contentWidth, 10) + 3
      }
    })

    yPos += 5
  }

  // Diagnosis Section
  if (record.diagnosis) {
    checkPageBreak(20)
    doc.setFontSize(16)
    doc.setFont('helvetica', 'bold')
    doc.text('DIAGNOSIS & TESTS', margin, yPos)
    yPos += 10

    doc.setFontSize(10)
    if (record.diagnosis.diagnosis) {
      checkPageBreak(15)
      doc.setFont('helvetica', 'bold')
      doc.text('Diagnosis:', margin, yPos)
      yPos += 6
      doc.setFont('helvetica', 'normal')
      yPos += addWrappedText(record.diagnosis.diagnosis, margin, yPos, contentWidth, 10) + 3
    }

    if (record.diagnosis.testsOrdered) {
      checkPageBreak(15)
      doc.setFont('helvetica', 'bold')
      doc.text('Tests Ordered:', margin, yPos)
      yPos += 6
      doc.setFont('helvetica', 'normal')
      yPos += addWrappedText(record.diagnosis.testsOrdered, margin, yPos, contentWidth, 10) + 3
    }

    yPos += 5
  }

  // Treatment Plan Section
  if (record.treatmentPlan) {
    checkPageBreak(20)
    doc.setFontSize(16)
    doc.setFont('helvetica', 'bold')
    doc.text('TREATMENT PLAN', margin, yPos)
    yPos += 10

    doc.setFontSize(10)
    if (record.treatmentPlan.medicationsPrescribed) {
      checkPageBreak(15)
      doc.setFont('helvetica', 'bold')
      doc.text('Medications Prescribed:', margin, yPos)
      yPos += 6
      doc.setFont('helvetica', 'normal')
      yPos += addWrappedText(record.treatmentPlan.medicationsPrescribed, margin, yPos, contentWidth, 10) + 3
    }

    if (record.treatmentPlan.proceduresPerformed) {
      checkPageBreak(15)
      doc.setFont('helvetica', 'bold')
      doc.text('Procedures Performed:', margin, yPos)
      yPos += 6
      doc.setFont('helvetica', 'normal')
      yPos += addWrappedText(record.treatmentPlan.proceduresPerformed, margin, yPos, contentWidth, 10) + 3
    }

    if (record.treatmentPlan.instruction) {
      checkPageBreak(15)
      doc.setFont('helvetica', 'bold')
      doc.text('Instructions:', margin, yPos)
      yPos += 6
      doc.setFont('helvetica', 'normal')
      yPos += addWrappedText(record.treatmentPlan.instruction, margin, yPos, contentWidth, 10) + 3
    }
  }

  // Footer
  const totalPages = doc.getNumberOfPages()
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i)
    doc.setFontSize(8)
    doc.setTextColor(128, 128, 128)
    doc.text(
      `Page ${i} of ${totalPages} | Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}`,
      margin,
      pageHeight - 10
    )
    doc.text(
      `Status: ${record.status}`,
      pageWidth - margin - 30,
      pageHeight - 10
    )
  }

  // Save PDF
  doc.save(`Medical_Record_${record.recordId}.pdf`)
}

