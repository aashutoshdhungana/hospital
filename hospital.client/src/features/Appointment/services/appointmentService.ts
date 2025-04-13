import axios, { AxiosError } from "axios";
import { Appointment, AppointmentFilters } from "../schemas/Appointment";
import { AppointmentFormData } from "../schemas/ValidationSchema";

const mockAppointments: Appointment[] = [
    {
        "id": 1,
        "doctorId": 1,
        "doctorName": "Dr. John Smith",
        "patientId": 1,
        "patientName": "Michael Brown",
        "appointmentDate": "2025-04-19T10:00:00Z",
        "status": "Scheduled",
        "medicalAssesment": null
    },
    {
        "id": 2,
        "doctorId": 2,
        "doctorName": "Dr. Sarah Johnson",
        "patientId": 2,
        "patientName": "Emily Davis",
        "appointmentDate": "2025-04-12T14:00:00Z",
        "status": "Scheduled",
        "medicalAssesment": null
    },
    {
        "id": 3,
        "doctorId": 2,
        "doctorName": "Dr. Sarah Johnson",
        "patientId": 1,
        "patientName": "Michael Brown",
        "appointmentDate": "2025-04-16T06:40:34.93Z",
        "status": "Scheduled",
        "medicalAssesment": null
    }
]

const appointmentService = {
    getAll: async (filters?: AppointmentFilters) => {
        const params = new URLSearchParams();
        if (filters?.from) params.append('From', filters.from);
        if (filters?.to) params.append('To', filters.to);
        if (filters?.doctorId) params.append('DoctorId', filters.doctorId.toString());
        if (filters?.patientId) params.append('PatientId', filters.patientId.toString());

        // const response = await axios.get('/api/Appointment', { params });
        // return response.data;

        return mockAppointments;
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
            // const response = await axios.post("/api/Appointments", {
            //     ...appointmentData,
            // });
            const response = { data: mockAppointments[0] } // mock response
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
            // await axios.put(`/api/Appointments/${id}`, {
            //     ...appointmentData,
            // });
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