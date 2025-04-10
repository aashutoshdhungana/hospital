import { lazy } from "react";
import { RouteObject } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute/ProtectedRoutes";
import Layout from "../components/layouts/Layout";
import NotFound from "../pages/NotFound";
import Unauthorized from "../pages/Unauthorized";

const Dashboard = lazy(() => import('../pages/Dashboard'));
const AllPatients = lazy(() => import('../pages/patients/List'));
const CreatePatient = lazy(() => import('../pages/patients/Create'));
const EditPatient = lazy(() => import('../pages/patients/Edit'));
const AppointmentList = lazy(() => import('../pages/appointments/AppointmentList'));
const CreateAppointment = lazy(() => import('../pages/appointments/CreateAppointment'));
const EditAppointment = lazy(() => import('../pages/appointments/Edit'));
const CreateMedicine = lazy(() => import('../pages/medicines/Create'));
const EditMedicine = lazy(() => import('../pages/medicines/Edit'));
const MedicineList = lazy(() => import('../pages/medicines/List'));
const LoginForm = lazy(() => import('../pages/Login'));
const CreateDoctor = lazy(() => import('../pages/doctors/Create'));
const EditDoctor = lazy(() => import('../pages/doctors/Edit'));
const AllDoctors = lazy(() => import('../pages/doctors/List'));

const RouteConfig: RouteObject[] = [
    {
        path: '/login',
        element: <LoginForm />,
    },
    {
        element: <ProtectedRoute />,
        children: [
            {
                element: <Layout />,
                children: [
                    {
                        path: '/',
                        element: <Dashboard />
                    },
                    {
                        path: '/dashboard',
                        element: <Dashboard />
                    },
                    {
                        path: '/patients',
                        element: <ProtectedRoute requiredPermissions={['patients.view']} />,
                        children: [{index: true, element: <AllPatients />}],
                    },
                    {
                        path: '/patient/new',
                        element: <ProtectedRoute requiredPermissions={['patients.create']} />,
                        children: [{index: true, element: <CreatePatient />}],        
                    },
                    {
                        path: '/patient/edit/:id',
                        element: <ProtectedRoute requiredPermissions={['patients.edit']} />,
                        children: [{index: true, element: <EditPatient />}],        
                    },
                    {
                        path: '/appointments',
                        element: <ProtectedRoute requiredPermissions={['appointments.view']} />,    
                        children: [{index: true, element: <AppointmentList />}],
                    },
                    {
                        path: '/appointments/assigned-to/:doctorId',
                        element: <ProtectedRoute requiredPermissions={['appointments.view']} />,    
                        children: [{index: true, element: <AppointmentList />}],
                    },
                    {
                        path: '/appointments/assigned-to-me',
                        element: <ProtectedRoute requiredPermissions={['appointments.me']} />,    
                        children: [{index: true, element: <AppointmentList />}],
                    },
                    {
                        path: '/appointment/new',
                        element: <ProtectedRoute requiredPermissions={['appointments.create']} />,
                        children: [{index: true, element: <CreateAppointment />}],
                    },
                    {
                        path: '/appointment/edit/:id',
                        element: <ProtectedRoute requiredPermissions={['appointments.edit']} />,
                        children: [{index: true, element: <EditAppointment />}],
                    },
                    {
                        path: '/medicines',
                        element: <ProtectedRoute requiredPermissions={['medicines.view']} />,
                        children: [{index: true, element: <MedicineList />}],
                    },
                    {
                        path: '/medicine/new',
                        element: <ProtectedRoute requiredPermissions={['medicines.create']} />,
                        children: [{index: true, element: <CreateMedicine />}],
                    },
                    {
                        path: '/medicine/edit/:id',
                        element: <ProtectedRoute requiredPermissions={['medicines.edit']} />,
                        children: [{index: true, element: <EditMedicine />}],
                    },
                    {
                        path: '/doctor/new',
                        element: <ProtectedRoute requiredPermissions={['doctors.create']} />,
                        children: [{ index: true, element: <CreateDoctor />}],
                    },
                    {
                        path: '/doctor/edit/:id',
                        element: <ProtectedRoute requiredPermissions={['doctors.edit']} />,
                        children: [{ index: true, element: <EditDoctor />}],
                    },
                    {
                        path: '/doctors',
                        element: <ProtectedRoute requiredPermissions={['doctors.view']} />,
                        children: [{ index: true, element: <AllDoctors />}],
                    }
                ]
            }
        ]    
    },
    {
        path: '*',
        element: <NotFound />
    },
    {
        path: '/unauthorized',
        element: <Unauthorized />,        
    },
]

export default RouteConfig;