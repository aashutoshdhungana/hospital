import { useEffect, useState, useCallback } from "react";
import { format } from "date-fns";
import appointmentService from "../../services/appointmentService";
import { Button } from "../../components/ui/button";
import { Calendar, Grid, List  } from "lucide-react";
import { DateRangePicker } from "../../components/ui/date-range-picker";
import { useNavigate } from "react-router-dom";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "../../components/ui/select";
import { Input } from "../../components/ui/input";

interface Appointment {
  id: number;
  patientName: string;
  doctorName: string;
  appointmentDate: string;
  status: string;
}

const AppointmentList = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [dateRange, setDateRange] = useState<
    { from: Date; to: Date } | undefined
  >();
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const navigate = useNavigate();

  const loadAppointments = useCallback(async () => {
    try {
      setIsLoading(true);
      const filters = {
        from: dateRange?.from?.toISOString(),
        to: dateRange?.to?.toISOString(),
      };
      const data = await appointmentService.getAppointments(filters);
      setAppointments(data);
    } catch (error) {
      console.error("Error loading appointments:", error);
    } finally {
      setIsLoading(false);
    }
  }, [dateRange]);

  useEffect(() => {
    loadAppointments();
  }, [loadAppointments]);

  // Filter appointments based on status and search query
  const filteredAppointments = appointments.filter(appointment => 
    (statusFilter === 'All' || appointment.status === statusFilter) &&
    (searchQuery === '' || 
      appointment.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      appointment.doctorName.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Render mobile table row
  const renderMobileRow = (appointment: Appointment) => (
    <div 
      key={appointment.id} 
      className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-4 mb-4"
    >
      <div className="flex justify-between items-start mb-2">
        <div>
          <div className="font-semibold text-lg dark:text-white">
            {appointment.patientName}
          </div>
          <div className="text-gray-600 dark:text-gray-300">
            Dr. {appointment.doctorName}
          </div>
        </div>
        <span 
          className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
            appointment.status === "Confirmed"
              ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
              : appointment.status === "Pending"
              ? "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200"
              : "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200"
          }`}
        >
          {appointment.status}
        </span>
      </div>
      <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
        {format(new Date(appointment.appointmentDate), "PPpp")}
      </div>
      <div className="flex justify-end">
        <Button variant="ghost" size="sm">
          View Details
        </Button>
      </div>
    </div>
  );

  // Render desktop table row
  const renderDesktopRow = (appointment: Appointment) => (
    <tr key={appointment.id}>
      <td className="whitespace-nowrap px-6 py-4 dark:text-white">
        {appointment.patientName}
      </td>
      <td className="whitespace-nowrap px-6 py-4 dark:text-white">
        {appointment.doctorName}
      </td>
      <td className="whitespace-nowrap px-6 py-4 dark:text-gray-300">
        {format(new Date(appointment.appointmentDate), "PPpp")}
      </td>
      <td className="whitespace-nowrap px-6 py-4">
        <span
          className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
            appointment.status === "Confirmed"
              ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
              : appointment.status === "Pending"
              ? "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200"
              : "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200"
          }`}
        >
          {appointment.status}
        </span>
      </td>
      <td className="whitespace-nowrap px-6 py-4">
        <Button variant="ghost" size="sm">
          View Details
        </Button>
      </td>
    </tr>
  );

  return (
    <div className="w-full min-h-screen flex flex-col">
      <div className="w-full p-4 sm:p-6 dark:text-white">
        {/* Top Section with Filters */}
        <div className="mb-6 space-y-4">
          {/* Responsive Header */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <h1 className="text-2xl font-semibold w-full dark:text-white">
              Appointments
            </h1>
            
            {/* Filters Container */}
            <div className="w-full flex flex-col sm:flex-row items-center gap-2">
              <Input 
                placeholder="Search appointments" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full sm:flex-1 dark:bg-gray-700 dark:text-white dark:border-gray-600"
              />
              
              <Select 
                value={statusFilter} 
                onValueChange={setStatusFilter}
              >
                <SelectTrigger className="w-full sm:w-[180px] dark:bg-gray-700 dark:text-white dark:border-gray-600">
                  <SelectValue placeholder="Filter Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Statuses</SelectItem>
                  <SelectItem value="Confirmed">Confirmed</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {/* Date and View Mode Section */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="w-full flex flex-col sm:flex-row items-center gap-2">
              <div className="w-full flex-1 mr-2">
                <DateRangePicker
                  value={dateRange}
                  onChange={(range) => {
                    setDateRange(
                      range ? { from: range.from!, to: range.to! } : undefined
                    );
                  }}
                />
              </div>
              <Button 
                onClick={() => navigate("/appointments/create")}
                className="w-full sm:w-auto"
              >
                <Calendar className="mr-2 h-4 w-4" />
                New Appointment
              </Button>
            </div>
            
            {/* View Mode Toggles */}
            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <Button 
                variant={viewMode === 'list' ? 'default' : 'outline'}
                onClick={() => setViewMode('list')}
                size="icon"
              >
                <List className="h-4 w-4" />
              </Button>
              <Button 
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                onClick={() => setViewMode('grid')}
                size="icon"
              >
                <Grid className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Content Section with Scrollable Container */}
        <div className="w-full overflow-x-auto">
          {isLoading ? (
            <div className="flex h-40 items-center justify-center dark:text-white">
              <div className="text-lg">Loading appointments...</div>
            </div>
          ) : filteredAppointments.length === 0 ? (
            <div className="flex h-40 items-center justify-center text-gray-500 dark:text-gray-400">
              No appointments found
            </div>
          ) : viewMode === 'list' ? (
            // Desktop Table View
            <div className="hidden sm:block rounded-lg border dark:border-gray-700 overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    {['Patient', 'Doctor', 'Date & Time', 'Status', 'Actions'].map((header) => (
                      <th 
                        key={header} 
                        className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-900">
                  {filteredAppointments.map(renderDesktopRow)}
                </tbody>
              </table>
            </div>
          ) : (
            // Grid View
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {filteredAppointments.map(renderMobileRow)}
            </div>
          )}

          {/* Mobile List View (for small screens) */}
          <div className="sm:hidden space-y-4 p-4">
            {filteredAppointments.map(renderMobileRow)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentList;