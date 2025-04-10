import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '../../components/ui/select';
import patientService, { Patient, Gender } from '../../features/Patient/services/patientService';
import { AxiosError } from 'axios';

const CreatePatient = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [formData, setFormData] = useState<Patient>({
    firstName: '',
    middleName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    emergencyContactPerson: '',
    emergencyContactNumber: '',
    gender: Gender.Male,
    street: '',
    city: '',
    state: '',
    country: '',
    dateOfBirth: new Date().toISOString()
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear any existing errors when user starts typing
    setErrors([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors([]);
    
    // Basic client-side validation
    const validationErrors: string[] = [];
    
    if (!formData.firstName.trim()) validationErrors.push('First Name is required');
    if (!formData.lastName.trim()) validationErrors.push('Last Name is required');
    if (!formData.email.trim()) validationErrors.push('Email is required');
    if (!formData.phoneNumber.trim()) validationErrors.push('Phone Number is required');
    if (!formData.emergencyContactPerson.trim()) validationErrors.push('Emergency Contact Person is required');
    if (!formData.emergencyContactNumber.trim()) validationErrors.push('Emergency Contact Number is required');

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      validationErrors.push('Invalid email format');
    }

    // Phone number validation (basic)
    const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
    if (formData.phoneNumber && !phoneRegex.test(formData.phoneNumber)) {
      validationErrors.push('Invalid phone number format');
    }

    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setIsLoading(true);
      await patientService.createPatient({
        ...formData,
        // Ensure optional fields are not empty strings
        middleName: formData.middleName?.trim() || undefined,
        street: formData.street?.trim() || undefined,
        city: formData.city?.trim() || undefined,
        state: formData.state?.trim() || undefined,
        country: formData.country?.trim() || undefined
      });
      navigate('/patients');
    } catch (error) {
      if (error instanceof AxiosError) {
        // Handle specific error responses from the server
        if (error.response) {
          // The request was made and the server responded with a status code
          const serverErrors = error.response.data;
          
          // If the server returns an array of errors
          if (Array.isArray(serverErrors)) {
            setErrors(serverErrors);
          } 
          // If the server returns an object with errors
          else if (typeof serverErrors === 'object') {
            const errorMessages = Object.values(serverErrors)
              .flat()
              .filter((msg): msg is string => typeof msg === 'string');
            setErrors(errorMessages);
          } 
          // Fallback error message
          else {
            setErrors(['Failed to create patient. Please check your input.']);
          }
        } else if (error.request) {
          // The request was made but no response was received
          setErrors(['No response from server. Please try again.']);
        } else {
          // Something happened in setting up the request
          setErrors(['Error creating patient. Please try again.']);
        }
      } else {
        // Handle non-axios errors
        setErrors(['An unexpected error occurred.']);
      }
      console.error('Error creating patient:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Create New Patient</h1>
        <p className="text-muted-foreground">Enter patient information</p>
      </div>

      {errors.length > 0 && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded mb-4">
          <ul className="list-disc list-inside">
            {errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>First Name</Label>
            <Input
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              placeholder="First Name"
              required
            />
          </div>
          <div className="space-y-2">
            <Label>Middle Name (Optional)</Label>
            <Input
              name="middleName"
              value={formData.middleName}
              onChange={handleInputChange}
              placeholder="Middle Name"
            />
          </div>
          <div className="space-y-2">
            <Label>Last Name</Label>
            <Input
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              placeholder="Last Name"
              required
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Email</Label>
            <Input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Email"
              required
            />
          </div>
          <div className="space-y-2">
            <Label>Phone Number</Label>
            <Input
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              placeholder="Phone Number"
              required
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Gender</Label>
            <Select
              value={formData.gender.toString()}
              onValueChange={(value) => 
                setFormData(prev => ({ ...prev, gender: parseInt(value) }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">Male</SelectItem>
                <SelectItem value="1">Female</SelectItem>
                <SelectItem value="2">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Date of Birth</Label>
            <Input
              name="dateOfBirth"
              type="date"
              value={formData.dateOfBirth.split('T')[0]}
              onChange={(e) => 
                setFormData(prev => ({ 
                  ...prev, 
                  dateOfBirth: new Date(e.target.value).toISOString() 
                }))
              }
              required
            />
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Street</Label>
            <Input
              name="street"
              value={formData.street}
              onChange={handleInputChange}
              placeholder="Street Address"
            />
          </div>
          <div className="space-y-2">
            <Label>City</Label>
            <Input
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              placeholder="City"
            />
          </div>
          <div className="space-y-2">
            <Label>State</Label>
            <Input
              name="state"
              value={formData.state}
              onChange={handleInputChange}
              placeholder="State"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Country</Label>
            <Input
              name="country"
              value={formData.country}
              onChange={handleInputChange}
              placeholder="Country"
            />
          </div>
          <div className="space-y-2">
            <Label>Emergency Contact Person</Label>
            <Input
              name="emergencyContactPerson"
              value={formData.emergencyContactPerson}
              onChange={handleInputChange}
              placeholder="Emergency Contact Name"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Emergency Contact Number</Label>
          <Input
            name="emergencyContactNumber"
            value={formData.emergencyContactNumber}
            onChange={handleInputChange}
            placeholder="Emergency Contact Phone"
            required
          />
        </div>

        <div className="flex gap-4">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Creating...' : 'Create Patient'}
          </Button>
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => navigate('/patients')}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreatePatient;