import { useEffect, useState } from 'react';
import './App.css';
import { AuthProvider } from './context/AuthContext';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import LoginForm from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoutes';
import CommonDashboard from './pages/CommonDashboard';

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element = {<LoginForm />} />
                    <Route path="/login" element = {<LoginForm />} />
                    <Route element={<ProtectedRoute/>}>
                        <Route path="/dashboard" element={<CommonDashboard/>}/>
                    </Route>                
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    )
}

export default App;