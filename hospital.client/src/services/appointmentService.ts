import axios from 'axios';

export interface CreateAppointmentDTO {
  patientInfoId: number;
  doctorInfoId: number;
  appointmentDate: string;
}

export interface AppointmentFilters {
  from?: string;
  to?: string;
  doctorId?: number;
  patientId?: number;
}

const appointmentService = {
  createAppointment: async (appointment: CreateAppointmentDTO) => {
    const response = await axios.post('/api/Appointment', appointment);
    return response.data;
  },

  getAppointments: async (filters?: AppointmentFilters) => {
    const params = new URLSearchParams();
    if (filters?.from) params.append('From', filters.from);
    if (filters?.to) params.append('To', filters.to);
    if (filters?.doctorId) params.append('DoctorId', filters.doctorId.toString());
    if (filters?.patientId) params.append('PatientId', filters.patientId.toString());

    const response = await axios.get('/api/Appointment', { params });
    return response.data;
  }
};

export default appointmentService;
