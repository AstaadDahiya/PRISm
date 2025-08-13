import PatientPortal from "./_components/patient-portal";

// Let's assume we're viewing patient '1' for this portal
const PATIENT_ID_FOR_VIEW = '1';

export default function PatientViewPage() {
  return <PatientPortal patientId={PATIENT_ID_FOR_VIEW} />;
}
