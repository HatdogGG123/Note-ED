import { supabase } from "./lib/supabaseClient";
import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { Routes, Route } from "react-router";
import Dashboard from "./pages/Dashboard";
import ForgotPassword from "./pages/ForgotPassword";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import PageNotFound from "./pages/PageNotFound";
import UnauthorizedAccess from "./pages/UnauthorizedAccess";

function App() {
  return (
    <>
      <Routes>
        <Route path={"/"} element={<Login />} />
        <Route path={"/dashboard"} element={<Dashboard />} />
        <Route path={"/Signup"} element={<Signup />} />
        <Route path={"/unauthorizedAccess"} element={<UnauthorizedAccess />} />
        <Route path={"*"} element={<PageNotFound />} />
      </Routes>
    </>
  );
}

export default App;
