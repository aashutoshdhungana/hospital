import axios, { AxiosError } from "axios";
import { Appointment, AppointmentFilters } from "../schemas/Appointment";
import { AppointmentFormData } from "../schemas/ValidationSchema";


const appointmentService = {
    getAll: async (filters?: AppointmentFilters) => {
        const params = new URLSearchParams();
        if (filters?.from) params.append('From', filters.from);
        if (filters?.to) params.append('To', filters.to);
        if (filters?.doctorId) params.append('DoctorId', filters.doctorId.toString());
        if (filters?.patientId) params.append('PatientId', filters.patientId.toString());

        const response = await axios.get('/api/Appointment', { params });
        return response.data;

    },

    getById: async (id: number): Promise<Appointment> => {
        try {
            const response = await axios.get(`/api/Appointments/${id}`);
            return response.data;
        } catch (error) {
            if (error instanceof AxiosError) {
                throw error;
            }
            throw error;
        }
    },

    create: async (appointmentData: AppointmentFormData): Promise<Appointment> => {
        try {
            const response = await axios.post("/api/Appointments", {
                ...appointmentData,
            });
            return response.data;
        } catch (error) {
            if (error instanceof AxiosError) {
                throw error;
            }
            throw error;
        }
    },

    update: async (id: number, appointmentData: AppointmentFormData): Promise<void> => {
        try {
            await axios.put(`/api/Appointments/${id}`, {
                ...appointmentData,
            });
            console.log('updating appointment with id:', id, 'data:', appointmentData);
        } catch (error) {
            if (error instanceof AxiosError) {
                throw error;
            }
            throw error;
        }
    },

    delete: async (id: number): Promise<void> => {
        try {
            // await axios.delete(`/api/Appointments/${id}`);
            console.log('deleting appointment with id:', id);
        } catch (error) {
            if (error instanceof AxiosError) {
                throw error;
            }
            throw error;
        }
    },
};

export default appointmentService;