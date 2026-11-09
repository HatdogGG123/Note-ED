import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router";
import LogoutButton from "@/components/dashboard/LogoutButton";
import { SessionContext } from "@/context/SessionContext";

const Dashboard = () => {
  const { session, isLoading } = useContext(SessionContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !session) {
      navigate("/", { replace: true });
    }
  }, [session, isLoading, navigate]);

  if (isLoading) return <div>Loading...</div>;
  if (!session) return null;

  return (
    <div>
      Dashboard <LogoutButton />
      <p>Logged in</p>
    </div>
  );
};

export default Dashboard;
