import axios, { AxiosError } from "axios";
import { Appointment, AppointmentFilters } from "../schemas/Appointment";
import { AppointmentFormData } from "../schemas/ValidationSchema";


const appointmentService = {
    getAll: async (filters?: AppointmentFilters) => {
        const response = await axios.post('/api/Appointment/filter', filters);
        return response.data;

    },

    getById: async (id: number): Promise<Appointment> => {
        try {
            const response = await axios.get(`/api/Appointment/${id}`);
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
            const response = await axios.post("/api/Appointment", {
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
            await axios.put(`/api/Appointment/${id}`, {
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