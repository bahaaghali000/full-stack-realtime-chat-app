import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import {
  About,
  Chats,
  Login,
  NotFound,
  Profile,
  Settings,
  SignUp,
  Users,
} from "../pages";

const Routing: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />

      <Route path="/" element={<Navigate to="/chats" />} />

      <Route path="/" element={<ProtectedRoute />}>
        <Route path="chats" element={<Chats />} />
        <Route path="profile" element={<Profile />} />
        <Route path="about" element={<About />} />
        <Route path="settings" element={<Settings />} />
        <Route path="users" element={<Users />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default Routing;
