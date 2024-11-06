import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import SignUp from "./pages/auth/SignUp";
import Login from "./pages/auth/Login";

function App() {
  return (
    <main>
      <BrowserRouter>
        <Routes>
          {/* these are public Routes */}
          <Route path="/" element={<MainLayout />}>
            <Route path="/signup" index element={<SignUp />} />
            <Route path="/login" element={<Login />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </main>
  );
}

export default App;
