import axios, { AxiosError } from 'axios';

export interface Patient {
  id?: number;
  firstName: string;
  middleName?: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  emergencyContactPerson: string;
  emergencyContactNumber: string;
  gender: number;
  street?: string;
  city?: string;
  state?: string;
  country?: string;
  dateOfBirth: string;
}

// Enum for gender to make the form more user-friendly
export enum Gender {
  Male = 0,
  Female = 1,
  Other = 2
}

const patientService = {
  getPatients: async (): Promise<Patient[]> => {
    const response = await axios.get('/api/Patient');
    return response.data;
  },

  createPatient: async (patient: Patient): Promise<Patient> => {
    try {
      const response = await axios.post('/api/Patient', {
        ...patient,
        // Ensure date is in correct format
        dateOfBirth: new Date(patient.dateOfBirth).toISOString()
      });
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        // Rethrow to be handled in the component
        throw error;
      }
      throw error;
    }
  },

  getPatientById: async (id: number): Promise<Patient> => {
    const response = await axios.get(`/api/Patient/${id}`);
    return response.data;
  },
};

export default patientService;