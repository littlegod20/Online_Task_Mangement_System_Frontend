import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import SignUp from "./pages/auth/SignUp";
import Login from "./pages/auth/Login";
import Home from "./pages/common/Home";
import { ProtectedRoute } from "./components/ProtectedRoute";

function App() {
  return (
    <main>
      <BrowserRouter>
        <Routes>
          {/* these are public Routes */}
          <Route path="/" element={<MainLayout />}>
            <Route index element={<SignUp />} />
            <Route path="/login" element={<Login />} />
          </Route>
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          >
            <Route index element={<Home />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </main>
  );
}

export default App;
