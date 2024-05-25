import { Navigate, Route, Routes } from 'react-router-dom';
import React, { ReactElement } from 'react';
import DashboardLayout from '@/layouts/dashboard';
import LogoOnlyLayout from '@/layouts/LogoOnlyLayout';
import Login from '@/pages/Login';
// import Register from '@/pages/Register';
import DashboardApp from '@/pages/DashboardApp';
import Specialization from '@/pages/Specialization';
import Blog from '@/pages/Blog';
import Doctor from '@/pages/Doctor';
import Patient from '@/pages/Patient';
import Appointment from '@/pages/Appointment';
import NotFound from '@/pages/Page404';

export const Router = (): ReactElement => {
    return (
        <Routes>
            <Route path="/dashboard" element={<DashboardLayout />}>
                <Route path="" element={<Navigate to="/dashboard/app" replace />} />
                <Route path="app" element={<DashboardApp />} />
                <Route path="doctor" element={<Doctor />} />
                <Route path="appointment" element={<Appointment />} />
                <Route path="patient" element={<Patient />} />
                <Route path="specialization" element={<Specialization />} />
                <Route path="blog" element={<Blog />} />
            </Route>
            <Route path="/" element={<LogoOnlyLayout />}>
                <Route path="login" element={<Login />} />
                {/* <Route path="register" element={<Register />} /> */}
                <Route path="404" element={<NotFound />} />
                <Route path="" element={<Navigate to="/dashboard" />} />
                <Route path="*" element={<Navigate to="/404" />} />
            </Route>
        </Routes>
    );
};

export default Router;
