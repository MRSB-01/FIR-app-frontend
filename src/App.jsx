// src/App.jsx (updated)
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ThemeProvider } from "./context/ThemeContext";
import Register from "./pages/Register";
import Login from "./pages/Login";
import FirForm from "./pages/FirForm";
import Report from "./pages/Report";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/form"
            element={
              <Layout>
                <FirForm />
              </Layout>
            }
          />
          <Route
            path="/form/:id"
            element={
              <Layout>
                <FirForm />
              </Layout>
            }
          />
          <Route
            path="/report"
            element={
              <Layout>
                <Report />
              </Layout>
            }
          />
          <Route
            path="/dashboard"
            element={
              <Layout>
                <Dashboard />
              </Layout>
            }
          />
          <Route
            path="/profile"
            element={
              <Layout>
                <Profile />
              </Layout>
            }
          />
        </Routes>
        <ToastContainer />
      </Router>
    </ThemeProvider>
  );
}

export default App;
