import "./App.css"
import { AuthProvider } from "./context/AuthContext"
import { BrowserRouter as Router } from "react-router-dom"
import { ThemeProvider } from "./context/ThemeContextProvider"
import LoginForm from "./pages/Login"
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoutes"
import CommonDashboard from "./pages/Dashboard"
import { Route, Routes, Navigate, Outlet } from "react-router-dom"
import Layout from "./components/DashboardLayout"
import ReceptionistDashboard from "./pages/receptionist/ReceptionistDashboard"
import AppointmentList from "./pages/appointments/AppointmentList"
import CreateAppointment from "./pages/appointments/CreateAppointment"
import ReceptionistLayout from "./components/layouts/receptionist/ReceptionistLayout"
import CreatePatient from "./pages/patients/Create"
import PatientsList from "./pages/patients/List"

function App() {
  return (
    <AuthProvider>
      <Router>
        <ThemeProvider>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<LoginForm />} />
            <Route path="/login" element={<LoginForm />} />

            {/* Protected routes */}
            <Route element={<ProtectedRoute />}>
              {/* Main dashboard layout */}
              <Route
                path="/"
                element={
                  <Layout>
                    <Outlet />
                  </Layout>
                }
              >
                <Route index element={<Navigate to="/dashboard" replace />} />
                <Route path="dashboard" element={<CommonDashboard />} />

                {/* Appointments routes */}
                <Route path="appointments">
                  <Route index element={<Navigate to="/appointments/list" replace />} />
                  <Route path="list" element={<AppointmentList />} />
                  <Route path="create" element={<CreateAppointment />} />
                </Route>
                {/* Appointments routes */}
                <Route path="patients">
                  <Route index element={<Navigate to="/patients/list" replace />} />
                  <Route path="list" element={<PatientsList/>} />
                  <Route path="new" element={<CreatePatient />} />
                </Route>

                {/* Other content routes */}
                
                <Route
                  path="medical-records"
                  element={<div className="p-4 bg-card rounded-lg">Medical Records Content</div>}
                />
                <Route
                  path="prescriptions/*"
                  element={<div className="p-4 bg-card rounded-lg">Prescriptions Content</div>}
                />
                <Route path="vitals" element={<div className="p-4 bg-card rounded-lg">Vitals Content</div>} />
                <Route
                  path="notifications"
                  element={<div className="p-4 bg-card rounded-lg">Notifications Content</div>}
                />
                <Route path="settings"
                 element={<div className="p-4 bg-card rounded-lg">Settings Content</div>} />
                <Route path="doctor/*" element={<div className="p-4 bg-card rounded-lg">Doctor Tools Content</div>} />
              </Route>

              {/* Receptionist layout and routes */}
              <Route
                path="/receptionist"
                element={
                  <ReceptionistLayout>
                    <Outlet />
                  </ReceptionistLayout>
                }
              >
                <Route index element={<Navigate to="/receptionist/dashboard" replace />} />
                <Route path="dashboard" element={<ReceptionistDashboard />} />
                <Route path="appointments">
                  <Route index element={<Navigate to="/receptionist/appointments/list" replace />} />
                  <Route path="list" element={<AppointmentList />} />
                  <Route path="create" element={<CreateAppointment />} />
                </Route>
              </Route>
            </Route>
          </Routes>
        </ThemeProvider>
      </Router>
    </AuthProvider>
  )
}

export default App

