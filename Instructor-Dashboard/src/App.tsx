import { Routes, Route } from "react-router-dom";
import AuthPanelSwitcher from "./components/AuthPanelSwitcher";
import Layout from "./components/Layout";
import DashboardPage from "./pages/DashboardPage";
import ClassesPage from "./pages/ClassesPage";
import ClassDetailsPage from "./pages/ClassDetailsPage";
import ClassroomPage from "./pages/ClassroomPage";
import AuthGuard from "./components/AuthGuard";
import "./main.css";

export default function App() {
  return (
    <Routes>
      {/* Public route */}
      <Route path="/" element={<AuthPanelSwitcher />} />

      {/* Protected routes */}
      <Route element={<Layout />}>
        <Route
          path="/home"
          element={
            <AuthGuard>
              <DashboardPage />
            </AuthGuard>
          }
        />
        <Route
          path="/classes"
          element={
            <AuthGuard>
              <ClassesPage />
            </AuthGuard>
          }
        />
        <Route
          path="/classes/:id"
          element={
            <AuthGuard>
              <ClassDetailsPage />
            </AuthGuard>
          }
        />
        {/* Example: if you add later */}
        {/* <Route path="/create-class" element={<AuthGuard><ClassCreationPage /></AuthGuard>} /> */}
      </Route>
      
      {/* Classroom route (full screen, no layout) */}
      <Route
        path="/classroom/:id"
        element={
          <AuthGuard>
            <ClassroomPage />
          </AuthGuard>
        }
      />
    </Routes>
  );
}
