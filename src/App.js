import Header from "./Components/Header";
import "./Components/Header.css";
import Dashboard from "./Components/dashboard";
import "./Components/dashboard.css";
import Trust from "./Components/trust";
import "./Components/trust.css";
import Login from "./Components/Login";
import "./Components/Login.css";
import Signup from "./Components/Signup";
import ParentStep1 from "./Components/ParentWizard/ParentStep1";
import ParentStep2 from "./Components/ParentWizard/ParentStep2";
import ParentStep3 from "./Components/ParentWizard/ParentStep3";
import { BrowserRouter, Routes, Route,useLocation } from "react-router-dom";
import ParentStep4 from "./Components/ParentWizard/ParentStep4";
import ParentStep5 from "./Components/ParentWizard/ParentStep5";
import ParentStep6 from "./Components/ParentWizard/ParentStep6";
import ParentStep7 from "./Components/ParentWizard/ParentStep7";

import Parentdashboard from "./Components/ParentWizard/Parentdashboard";
import "./Components/ParentWizard/parentWizard.css";
import "./Components/ParentWizard/CaretakerCard.css";
import CaretakerCard from "./Components/ParentWizard/CaretakerCard.jsx";
import Caretakerstep1 from "./Components/caretakerwizard/Caretakerstep1";
import Caretakerstep2 from "./Components/caretakerwizard/Caretakerstep2.jsx";
import Caretakerstep3 from "./Components/caretakerwizard/Caretakerstep3.jsx";
import Caretakerstep4 from "./Components/caretakerwizard/Caretakerstep4.jsx";
import Caretakerstep5 from "./Components/caretakerwizard/Caretakerstep5.jsx";
import Caretakerstep6 from "./Components/caretakerwizard/Caretakerstep6.jsx";
import Caretakerstep7 from "./Components/caretakerwizard/Caretakerstep7.jsx";
import Caretakerstep8 from "./Components/caretakerwizard/Caretakerstep8.jsx";
import CaretakerDashboard from "./Components/caretakerwizard/CaretakerDashboard.jsx"
import "./Components/caretakerwizard/Caretaker.css";
import Forgotpassword from "./Components/forgotpassword.js";
import ResetPassword from "./Components/ResetPassword.js";
import AdminDashboard from "./Components/AdminDashboard/AdminDashboard.jsx";
import  "./Components/AdminDashboard/adminDashboard.css";
import OtpVerification from "./Components/otpVerification.js";
import slidebar from "./Components/AdminDashboard/Slidebar.jsx";
import UserList from "./Components/AdminDashboard/Userlist.jsx";
import UserRow from "./Components/AdminDashboard/UserRow.jsx";
import ParentProfile from "./Components/ParentWizard/Parentprofile.jsx";
import CaretakerProfile from "./Components/caretakerwizard/Caretakerprofile.jsx";
import ParentBookings from "./pages/parent/ParentBookings.jsx";
import CaretakerBookings from "./pages/caretaker/CaretakerBookings.jsx";
import MessagesList from "./pages/messages/MessagesList.jsx";
import ChatScreen from "./pages/messages/ChatScreen.jsx";



// ...other imports

function AppLayout() {
  const location = useLocation();

  // Routes where global Header should NOT appear
  const hideHeaderRoutes = [
    "/caretakerdashboard",
    "/parent-dashboard",
    "/parent-profile",
    "/caretaker-profile",
  ];

  const shouldShowHeader = !hideHeaderRoutes.some(route =>
    location.pathname.startsWith(route)
  );

  return (
    <>
      {shouldShowHeader && <Header />}
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/trust" element={<Trust />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/otp-verification" element={<OtpVerification />} />

        <Route path="/parent-step1" element={<ParentStep1 />} />
        <Route path="/parent-step2" element={<ParentStep2 />} />
        <Route path="/parent-step3" element={<ParentStep3 />} />
        <Route path="/parent-step4" element={<ParentStep4 />} />
        <Route path="/parent-step5" element={<ParentStep5 />} />
        <Route path="/parent-step6" element={<ParentStep6 />} />
        <Route path="/parent-step7" element={<ParentStep7 />} />

        <Route path="/parent-dashboard" element={<Parentdashboard />} />
        <Route path="/parent/bookings" element={<ParentBookings />} />
        <Route path="/parent-profile/:id" element={<ParentProfile />} />
        <Route path="/caretakers/profile/:id" element={<CaretakerProfile />} />

        <Route path="/caretakerdashboard" element={<CaretakerDashboard />} />
        <Route path="/caretaker/bookings" element={<CaretakerBookings />} />
        <Route path="/messages" element={<MessagesList />} />
        <Route path="/messages/:chatId" element={<ChatScreen />} />

        <Route path="/Caretakerstep1" element={<Caretakerstep1 />} />
        <Route path="/Caretakerstep2" element={<Caretakerstep2 />} />
        <Route path="/Caretakerstep3" element={<Caretakerstep3 />} />
        <Route path="/Caretakerstep4" element={<Caretakerstep4 />} />
        <Route path="/Caretakerstep5" element={<Caretakerstep5 />} />
        <Route path="/Caretakerstep6" element={<Caretakerstep6 />} />
        <Route path="/Caretakerstep7" element={<Caretakerstep7 />} />
        <Route path="/Caretakerstep8" element={<Caretakerstep8 />} />

        <Route path="/forgotpassword" element={<Forgotpassword />} />
        <Route path="/ResetPassword" element={<ResetPassword />} />
        <Route path="/AdminDashboard" element={<AdminDashboard />} />
      </Routes>
    </>
  );
}
export default function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
}