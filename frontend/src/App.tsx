import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import UnderConstruction from "./pages/UnderConstruction";
import RegisterPage from "./pages/Register";
import LoginPage from "./pages/Login";
import Layout from "./components/Layout";
import { UserProvider } from "./contexts/UserContext";
import ReportsPage from "./pages/Reports";
import InactivityWrapper from "./components/InactivityWrapper";

function App() {
  return (
    <UserProvider>
      <InactivityWrapper>
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path="*" element={<UnderConstruction />} />
/** Rutas principales de la aplicación
<Route path="/home" element={<HomePage />} />
<Route path="/register" element={<RegisterPage />} />
<Route path="/login" element={<LoginPage />} />
<Route path="/reports" element={<ReportsPage />} />
</Routes>
</Layout>
</BrowserRouter>
</InactivityWrapper>
</UserProvider>
);
}

export default App;
