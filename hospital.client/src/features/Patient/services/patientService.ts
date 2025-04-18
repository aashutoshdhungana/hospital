import axios, { AxiosError } from 'axios';
import Patient from '../schema/PatientSchema';

const patientService = {
  getPatients: async (): Promise<Patient[]> => {
    const response = await axios.get('/api/Patient');
  
    return response.data.map((x: any) => ({
      id: x.id,
      firstName: x.userInfo.firstName,
      middleName: x.userInfo.middleName,
      lastName: x.userInfo.lastName,
      email: x.userInfo.email,
      phoneNumber: x.userInfo.phoneNumber,
      emergencyContactPerson: x.emergencyContactPerson,
      emergencyContactNumber: x.emergencyPhoneNumber,
      gender: x.userInfo.gender,
      street: x.userInfo.street,
      city: x.userInfo.city,
      state: x.userInfo.state,
      country: x.userInfo.country,
      dateOfBirth: x.userInfo.dateOfBirth,
    }));
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
    const x = response.data;
  
    return {
      id: x.id,
      firstName: x.userInfo.firstName,
      middleName: x.userInfo.middleName,
      lastName: x.userInfo.lastName,
      email: x.userInfo.email,
      phoneNumber: x.userInfo.phoneNumber,
      emergencyContactPerson: x.emergencyContactPerson,
      emergencyContactNumber: x.emergencyPhoneNumber,
      gender: x.userInfo.gender,
      street: x.userInfo.street,
      city: x.userInfo.city,
      state: x.userInfo.state,
      country: x.userInfo.country,
      dateOfBirth: x.userInfo.dateOfBirth,
    };
  },
};

export default patientService;