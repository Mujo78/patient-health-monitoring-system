import {
  createBrowserRouter,
  RouterProvider,
  Route,
  createRoutesFromElements,
} from "react-router-dom";
import AppLayout from "./components/Layout/AppLayout";
import LandingPage from "./pages/LandingPage";
import HomeLayout from "./components/Layout/HomeLayout";
import ForgotPassword from "./pages/auth/ForgotPassword";
import VerificationPage from "./pages/auth/VerificationPage";
import ForgotPasswordRes from "./pages/auth/ForgotPasswordRes";
import VerificationPageRes from "./pages/auth/VerificationPageRes";
import Authorized from "./helpers/Authorized";
import UserRequired from "./helpers/UserRequired";
import ErrorPage from "./pages/ErrorPage";
import PatientCheck from "./helpers/PatientCheck";
import MakeAppointment from "./pages/patient/appointment/MakeAppointment";
import MyAppointments from "./pages/patient/appointment/MyAppointments";
import MedicalStaff from "./pages/patient/staff/MedicalStaff";
import Medicine from "./pages/patient/Medicine";
import PatientDashboard from "./pages/patient/PatientDashboard";
import DoctorCheck from "./helpers/DoctorCheck";
import PharmacyCheck from "./helpers/PharmacyCheck";
import DoctorDashboard from "./pages/doctor/dashboard/DoctorDashboard";
import PharmacyDashboard from "./pages/pharmacy/dashboard/PharmacyDashboard";
import AppointmentDepartment from "./pages/patient/appointment/AppointmentDepartment";
import AppointmentLayout from "./components/Layout/AppointmentLayout";
import Appointment from "./pages/patient/appointment/Appointment";
import DoctorAppointments from "./pages/doctor/appointment/DoctorAppointments";
import DocAppointment from "./pages/doctor/appointment/DocAppointment";
import MyPatients from "./pages/doctor/MyPatients";
import MyDepartment from "./pages/doctor/MyDepartment";
import Patient from "./pages/doctor/Patient";
import Notification from "./pages/Notification";
import Notifications from "./pages/Notifications";
import MedicineOverview from "./pages/pharmacy/MedicineOverview";
import AddMedicine from "./pages/pharmacy/AddMedicine";
import OneMedicine from "./pages/pharmacy/OneMedicine";
import PatientProfile from "./pages/patient/profile/PatientProfile";
import DoctorProfile from "./pages/doctor/profile/DoctorProfile";
import PharmacyProfile from "./pages/pharmacy/profile/PharmacyProfile";
import GeneralSettings from "./pages/patient/profile/GeneralSettings";
import PersonalInformation from "./pages/patient/profile/PersonalInformation";
import Security from "./pages/Security";
import PersonalInfoDoc from "./pages/doctor/profile/PersonalInfoDoc";
import InfoPharmacy from "./pages/pharmacy/profile/InfoPharmacy";
import MedicalStaffDepartment from "./pages/patient/staff/MedicalStaffDepartment";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<AppLayout />}>
      <Route index element={<LandingPage />} loader={Authorized} />
      <Route path="/" element={<HomeLayout />} loader={UserRequired}>
        <Route loader={PatientCheck}>
          <Route path="/patient/:id" element={<PatientDashboard />} />
          <Route path="/my-appointments" element={<MyAppointments />}>
            <Route path=":id" element={<Appointment />} />
          </Route>
          <Route path="/appointment" element={<AppointmentLayout />}>
            <Route path="new" element={<AppointmentDepartment />}>
              <Route path=":doctorId" element={<MakeAppointment />} />
            </Route>
          </Route>
          <Route path="/profile/p/:id" element={<PatientProfile />}>
            <Route index element={<GeneralSettings />} />
            <Route path="personal-info" element={<PersonalInformation />} />
            <Route path="security" element={<Security />} />
          </Route>
          <Route path="/staff" element={<MedicalStaff />}>
            <Route
              path=":departmentName"
              element={<MedicalStaffDepartment />}
            />
          </Route>
          <Route path="/medicine-overview" element={<Medicine />} />
          <Route path="/notifications" element={<Notifications />}>
            <Route path=":id" element={<Notification />} />
          </Route>
        </Route>
        <Route loader={DoctorCheck}>
          <Route path="/doctor/:id" element={<DoctorDashboard />} />
          <Route path="/appointments" element={<DoctorAppointments />}>
            <Route path=":id" element={<DocAppointment />} />
          </Route>
          <Route path="/my-patients" element={<MyPatients />}>
            <Route path=":id" element={<Patient />} />
          </Route>
          <Route path="/profile/d/:id" element={<DoctorProfile />}>
            <Route index element={<PersonalInfoDoc />} />
            <Route path="security-page" element={<Security />} />
          </Route>
          <Route path="/my-patients/search" element={<MyPatients />} />
          <Route path="/my-department" element={<MyDepartment />} />
          <Route path="/doctor-notifications" element={<Notifications />}>
            <Route path=":id" element={<Notification />} />
          </Route>
        </Route>
        <Route loader={PharmacyCheck}>
          <Route path="/pharmacy/:id" element={<PharmacyDashboard />} />
          <Route path="/medicine" element={<MedicineOverview />}>
            <Route path=":id" element={<OneMedicine />} />
          </Route>
          <Route path="/add-medicine" element={<AddMedicine />} />
          <Route path="/pharmacy-notifications" element={<Notifications />}>
            <Route path=":id" element={<Notification />} />
          </Route>
          <Route path="/profile/ph/:id" element={<PharmacyProfile />}>
            <Route index element={<InfoPharmacy />} />
            <Route path="page-security" element={<Security />} />
          </Route>
        </Route>
      </Route>
      <Route
        path="api/v1/user/reset-password/:token"
        element={<ForgotPassword />}
      />
      <Route
        path="api/v1/user/reset-password-result"
        element={<ForgotPasswordRes />}
      />
      <Route
        path="api/v1/user/verify/:verificationToken"
        element={<VerificationPage />}
      />
      <Route
        path="api/v1/user/verify-result"
        element={<VerificationPageRes />}
      />
      <Route path="*" element={<ErrorPage />} />
    </Route>
  )
);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
