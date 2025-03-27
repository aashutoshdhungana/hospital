import { useState } from 'react';
import { useAuth } from "../hooks/useAuth";
import { Bell, User,  Calendar,  } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";

import { motion, AnimatePresence } from 'framer-motion';

const CommonDashboard = () => {
  const { user, roles } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  // Quick stats for dashboard
  const dashboardStats = [
    { label: 'Patients', value: 256, icon: <User className="text-blue-500" /> },
    { label: 'Appointments', value: 42, icon: <Calendar className="text-green-500" /> },
    { label: 'Notifications', value: 7, icon: <Bell className="text-red-500" /> }
  ];

  

  return (
    <div className={`min-h-screen bg-background text-foreground transition-colors duration-300`}>
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-between items-center mb-8"
        >
          <div className="flex items-center space-x-4">
            <Avatar>
              <AvatarImage src="https://avatars.dicebear.com/api/avataaars/john-doe.svg"
              // {user?.avatarUrl}
               alt={user?.firstName} />
              <AvatarFallback>{user?.firstName?.[0]}{user?.lastName?.[0]}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold">Welcome, {user?.firstName} {user?.lastName}</h1>
              <p className="text-muted-foreground"> EHR Dashboard</p>
            </div>
          </div>

         
        </motion.div>

        {/* Roles Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8"
        >
       
          <div className="flex space-x-2">
            {roles.map(role => (
              <motion.div 
                key={role}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm font-medium"
              >
                {role}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Dashboard Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="patients">Patients</TabsTrigger>
            <TabsTrigger value="appointments">Appointments</TabsTrigger>
          </TabsList>
          
          <AnimatePresence mode="wait">
            <TabsContent value="overview">
              <motion.div
                key="overview"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-3 gap-4 mt-4"
              >
                {dashboardStats.map((stat) => (
                  <Card key={stat.label}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
                      {stat.icon}
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stat.value}</div>
                    </CardContent>
                  </Card>
                ))}
              </motion.div>
            </TabsContent>

            <TabsContent value="patients">
              <motion.div
                key="patients"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Patient List</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {/* Placeholder for patient list */}
                    <p className="text-muted-foreground">Patient management coming soon</p>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            <TabsContent value="appointments">
              <motion.div
                key="appointments"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Upcoming Appointments</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {/* Placeholder for appointments */}
                    <p className="text-muted-foreground">Appointment scheduling coming soon</p>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>
          </AnimatePresence>
        </Tabs>
      </div>
    </div>
  );
};

export default CommonDashboard;