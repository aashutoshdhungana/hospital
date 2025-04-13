export type Appointment = {
    id: number;
    doctorId: number;
    doctorName: string;
    patientId: number;
    patientName: string;
    appointmentDate: string;
    status: string;
    medicalAssesment: MedicalAssesmentFormData | null; // optional or can be `undefined` if needed
};


export type AppointmentFilters = {
    from?: string;
    to?: string;
    doctorId?: number;
    patientId?: number;
}


export type MedicalAssesmentFormData = {
    id: number;
    chiefComplaint: string;
    historyOfIllness: string;
    diagnosis: string;
    advice: string;
    appointmentInfoId: number;
    createdBy: string;
    createdAt: string;
    updatedBy: string;
    updatedAt: string;
};
