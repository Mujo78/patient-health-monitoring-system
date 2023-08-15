import React from 'react'

import { createBrowserRouter, RouterProvider, Route, createRoutesFromElements } from 'react-router-dom'
import AppLayout from './pages/AppLayout'
import LandingPage from './pages/LandingPage'
import HomeLayout from './pages/HomeLayout'
import ForgotPassword from './pages/auth/ForgotPassword'
import VerificationPage from './pages/auth/VerificationPage'
import ForgotPasswordRes from './pages/auth/ForgotPasswordRes'
import VerificationPageRes from './pages/auth/VerificationPageRes'
import Authorized from './helpers/Authorized'
import UserRequired from './helpers/UserRequired'
import ErrorPage from './pages/ErrorPage'
import PatientCheck from './helpers/PatientCheck'
import MakeAppointment from './pages/patient/appointment/MakeAppointment'
import MyAppointments from './pages/patient/appointment/MyAppointments'
import MedicalStaff from './pages/patient/MedicalStaff'
import Medicine from './pages/patient/Medicine'
import Settings from './pages/patient/Settings'
import PatientDashboard from './pages/patient/PatientDashboard'
import DoctorCheck from './helpers/DoctorCheck'
import PharmacyCheck from './helpers/PharmacyCheck'
import DoctorDashboard from './pages/doctor/DoctorDashboard'
import PharmacyDashboard from './pages/pharmacy/PharmacyDashboard'
import AppointmentDepartment from './pages/patient/appointment/AppointmentDepartment'
import AppointmentLayout from './pages/patient/appointment/AppointmentLayout'

const router = createBrowserRouter(createRoutesFromElements(
  <Route path='/' element={<AppLayout />}>
    <Route index element={<LandingPage />} loader={Authorized} />
    <Route path='/' element={<HomeLayout />} loader={UserRequired}>
      <Route loader={PatientCheck}>
        <Route path='/patient/:id' element={<PatientDashboard />} />
        <Route path='/my-appointments' element={<MyAppointments />} />
        <Route path='/appointment' element={<AppointmentLayout />}>
          <Route path='new' element={<AppointmentDepartment />}>
              <Route path=':doctorId' element={<MakeAppointment />} />
          </Route>
        </Route>
        <Route path='/staff' element={<MedicalStaff />} />
        <Route path='/medicine-overview' element={<Medicine />} />
        <Route path='/settings' element={<Settings />} />
      </Route>
      <Route loader={DoctorCheck}>
        <Route path='/doctor/:id' element={<DoctorDashboard />} />
      </Route>
      <Route loader={PharmacyCheck}>
        <Route path='/pharmacy/:id' element={<PharmacyDashboard />} />
      </Route>
    </Route>
    <Route path='api/v1/user/reset-password/:token' element={<ForgotPassword />} />
    <Route path='api/v1/user/reset-password-result' element={<ForgotPasswordRes />} />
    <Route path='api/v1/user/verify/:verificationToken' element={<VerificationPage />} />
    <Route path='api/v1/user/verify-result' element={<VerificationPageRes />} />
    <Route path='*' element={<ErrorPage />} />
  </Route>
))

const App: React.FC = () => {
  return <RouterProvider router={router} />
}

export default App
