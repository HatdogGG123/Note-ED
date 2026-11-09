import React, { useState, useContext } from "react";
import { supabase } from "@/lib/supabaseClient";
import { SessionContext } from "@/context/SessionContext";
import { Button } from "../ui/button";
import { replace, useNavigate } from "react-router";
import { Spinner } from "../ui/spinner";

const LogoutButton = () => {
  const { session, setSession } = useContext(SessionContext);
  const [isLogoutLoading, setIsLogoutLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    setIsLogoutLoading(true);
    const { error } = await supabase.auth.signOut();
    setIsLogoutLoading(false);

    if (!error) {
      setSession(null);

      navigate("/", { replace: true });
    }
  };

  return (
    <Button onClick={handleLogout}>
      {isLogoutLoading ? (
        <>
          <Spinner />
          Logging out...
        </>
      ) : (
        "Logout"
      )}
    </Button>
  );
};

export default LogoutButton;
