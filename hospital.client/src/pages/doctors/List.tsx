import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '../../components/ui/table';
import { Button } from '../../components/ui/button';
import { Plus, Stethoscope } from 'lucide-react';
import doctorService from '../../features/Doctor/services/doctorService';
import { Doctor, specializations } from '@/features/Doctor/schemas/CreateDoctorSchema';
import { Gender } from '@/features/UserInfo/schemas/UserInfo';
import { toast } from 'sonner';

const List = () => {
	const [doctors, setDoctors] = useState<Doctor[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const navigate = useNavigate();

	useEffect(() => {
		const fetchDoctors = async () => {
			try {
				setIsLoading(true);
				const data = await doctorService.getDoctors();
				setDoctors(data);
			} catch (error) {
                toast.error('Failed to load doctors. Please try again later.');
			} finally {
				setIsLoading(false);
			}
		};

		fetchDoctors();
	}, []);

	const getGenderString = (gender: number) => {
		switch (gender) {
			case Gender.Male:
				return 'Male';
			case Gender.Female:
				return 'Female';
			case Gender.Other:
				return 'Other';
			default:
				return 'Unknown';
		}
	};

	return (
		<div className="p-6 space-y-6">
			<div className="flex justify-between items-center">
				<div>
					<h1 className="text-2xl font-semibold">Doctors</h1>
					<p className="text-muted-foreground">Manage doctor profiles</p>
				</div>
				<Button onClick={() => navigate('/doctor/new')}>
					<Plus className="mr-2 h-4 w-4" />
					Add New Doctor
				</Button>
			</div>

			{isLoading ? (
				<div className="flex justify-center items-center h-64">
					<p>Loading doctors...</p>
				</div>
			) : doctors.length === 0 ? (
				<div className="flex flex-col items-center justify-center h-64 text-center">
					<Stethoscope className="h-12 w-12 text-muted-foreground mb-4" />
					<h2 className="text-xl mb-2">No Doctors Found</h2>
					<p className="text-muted-foreground mb-4">
						There are no doctors in the system.
						Would you like to add one?
					</p>
					<Button onClick={() => navigate('/doctor/new')}>
						<Plus className="mr-2 h-4 w-4" />
						Add Doctor
					</Button>
				</div>
			) : (
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Name</TableHead>
							<TableHead>Email</TableHead>
							<TableHead>Phone</TableHead>
							<TableHead>Gender</TableHead>
							<TableHead>Specialization</TableHead>
							<TableHead>Experience (Years)</TableHead>
							<TableHead>Medical License</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{doctors.map((doctor) => (
							<TableRow key={doctor.id}>
								<TableCell>{`${doctor.firstName} ${doctor.lastName}`}</TableCell>
								<TableCell>{doctor.email}</TableCell>
								<TableCell>{doctor.phoneNumber}</TableCell>
								<TableCell>{getGenderString(doctor.gender)}</TableCell>
								<TableCell>{specializations.find(x => x.value == doctor.specialization)?.label ?? ""}</TableCell>
								<TableCell>{doctor.pastExperienceInYears}</TableCell>
								<TableCell>{doctor.medicalLicenseNumber}</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			)}
		</div>
	);
};

export default List;
