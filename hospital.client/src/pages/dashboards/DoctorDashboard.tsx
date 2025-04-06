import { useState, useEffect } from 'react';
import { Calendar, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';

interface DoctorDashboardStats {
    todayAppointments: number;
    upcomingAppointments: number;
}
const DoctorDashboard: React.FC = () => {
    const [stats, setStats] = useState<DoctorDashboardStats>({
        todayAppointments: 0,
        upcomingAppointments: 0,
    });

    useEffect(() => {
        const loadDashboardStats = async () => {
            setStats({
                todayAppointments: 5,
                upcomingAppointments: 10,
            })
        }
        loadDashboardStats();
    }, []);

    return (
        <div className="p-6">
            <h1 className="mb-6 text-2xl font-semibold">Doctor's Dashboard</h1>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Today's Appointments</CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.todayAppointments}</div>
                        <p className="text-xs text-muted-foreground">
                            Appointments scheduled for today
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Upcoming Appointments</CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.upcomingAppointments}</div>
                        <p className="text-xs text-muted-foreground">
                            Scheduled for next 7 days
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default DoctorDashboard;