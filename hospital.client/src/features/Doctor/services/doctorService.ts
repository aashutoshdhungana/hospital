import axios from 'axios';
import { Doctor } from '../schemas/CreateDoctorSchema';

const doctorService = {
	getDoctors: async (): Promise<Doctor[]> => {
		const response = await axios.get('/api/Doctor');

		return response.data.map((x: any) => ({
			id: x.id,
			firstName: x.userInfo.firstName,
			middleName: x.userInfo.middleName,
			lastName: x.userInfo.lastName,
			email: x.userInfo.email,
			phoneNumber: x.userInfo.phoneNumber,
			gender: x.userInfo.gender,
			specialization: x.specialization,
			medicalLicenseNumber: x.medicalLicenseNumber,
			pastExperienceInYears: x.pastExperienceInYears,
		}));
	},

	getDoctorById: async (id: number): Promise<Doctor> => {
		const response = await axios.get(`/api/Doctor/${id}`);
		const x = response.data;

		return {
			id: x.id,
			firstName: x.userInfo.firstName,
			middleName: x.userInfo.middleName,
			lastName: x.userInfo.lastName,
			email: x.userInfo.email,
			phoneNumber: x.userInfo.phoneNumber,
			gender: x.userInfo.gender,
			specialization: x.specialization,
			medicalLicenseNumber: x.medicalLicenseNumber,
			pastExperienceInYears: x.pastExperienceInYears,
		};
	},
};

export default doctorService;
