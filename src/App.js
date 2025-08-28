import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import MasterRecords from "./pages/MasterRecords";
import PrivateRoute from "./components/PrivateRoute";
import Layout from "./components/Layout";
import Stations from "./pages/Stations";
import Managers from "./pages/Managers";
import AdminRoute from "./components/AdminRoute";
import DailyDetailForm from "./pages/DailyDetailForm";
import MonthlySalary from "./pages/MonthlySalary";

function App() {
  return (
    <Router>
      <Routes>
        {/* Protected routes go inside Layout */}
        <Route
          element={
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          }
        >
          <Route path="/" element={<Home />} />
          <Route path="/dailydetail" element={<DailyDetailForm />} />

          {/* Only admins can access these */}
          <Route
            path="/masterrecord"
            element={
              <AdminRoute>
                <MasterRecords />
              </AdminRoute>
            }
          />
          <Route
            path="/stations"
            element={
              <AdminRoute>
                <Stations />
              </AdminRoute>
            }
          />
          <Route
            path="/summary"
            element={
              <AdminRoute>
                <MonthlySalary />
              </AdminRoute>
            }
          />
          <Route
            path="/managers"
            element={
              <AdminRoute>
                <Managers />
              </AdminRoute>
            }
          />
        </Route>

        {/* Public routes */}
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
