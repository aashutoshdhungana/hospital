import axios, { AxiosError } from 'axios';
import Patient from '../schema/PatientSchema';

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