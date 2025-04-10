import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '../../components/ui/table';
import { Button } from '../../components/ui/button';
import { Plus, User } from 'lucide-react';
import patientService, { Patient, Gender } from '../../features/Patient/services/patientService';

const PatientsList = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        setIsLoading(true);
        const fetchedPatients = await patientService.getPatients();
        setPatients(fetchedPatients);
      } catch (error) {
        console.error('Error fetching patients:', error);
        // Consider adding error toast or notification
      } finally {
        setIsLoading(false);
      }
    };

    fetchPatients();
  }, []);

  // Helper function to format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  // Helper function to convert gender number to string
  const getGenderString = (gender: number) => {
    switch(gender) {
      case Gender.Male: return 'Male';
      case Gender.Female: return 'Female';
      case Gender.Other: return 'Other';
      default: return 'Unknown';
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold">Patients</h1>
          <p className="text-muted-foreground">Manage patient records</p>
        </div>
        <Button onClick={() => navigate('/patients/new')}>
          <Plus className="mr-2 h-4 w-4" />
          Add New Patient
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <p>Loading patients...</p>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Date of Birth</TableHead>
              <TableHead>Gender</TableHead>
              <TableHead>Contact Person</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {patients.map((patient) => (
              <TableRow key={patient.id}>
                <TableCell>{`${patient.firstName} ${patient.lastName}`}</TableCell>
                <TableCell>{patient.email}</TableCell>
                <TableCell>{patient.phoneNumber}</TableCell>
                <TableCell>{formatDate(patient.dateOfBirth)}</TableCell>
                <TableCell>{getGenderString(patient.gender)}</TableCell>
                <TableCell>{patient.emergencyContactPerson}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {!isLoading && patients.length === 0 && (
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <User className="h-12 w-12 text-muted-foreground mb-4" />
          <h2 className="text-xl mb-2">No Patients Found</h2>
          <p className="text-muted-foreground mb-4">
            There are no patients in the system. 
            Would you like to add a new patient?
          </p>
          <Button onClick={() => navigate('/patients/new')}>
            <Plus className="mr-2 h-4 w-4" />
            Add Patient
          </Button>
        </div>
      )}
    </div>
  );
};

export default PatientsList;