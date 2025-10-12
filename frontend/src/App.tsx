import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import RegisterPage from "./pages/Register";
import LoginPage from "./pages/Login";
import Layout from "./components/Layout";
import { UserProvider } from "./contexts/UserContext";
import ReportsPage from "./pages/Reports";
import NotFound from "./components/NotFound";


function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </UserProvider>
  );
}

export default App;
