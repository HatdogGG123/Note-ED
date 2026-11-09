import { supabase } from "@/lib/supabaseClient";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import LogoutButton from "@/components/dashboard/LogoutButton";
import { SessionContext } from "@/context/SessionContext";
import { Spinner } from "@/components/ui/spinner";

const Dashboard = () => {
  const { session, isLoading } = useContext(SessionContext);
  const [isFetchingUser, setIsFetchingUser] = useState(false);
  const [user, setUser] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !session) {
      navigate("/", { replace: true });
      return;
    }

    getUser();
  }, [session, isLoading, navigate]);

  if (isLoading) return <div>Loading...</div>;

  const getUser = async () => {
    setIsFetchingUser(true);

    const { data, error } = await supabase
      .from("profile")
      .select("*")
      .eq("id", session?.user?.id)
      .limit(1);

    setIsFetchingUser(false);

    if (error) {
      console.log(error);

      return;
    }

    setUser({
      fullname: data[0]?.fullname,
      id: data[0]?.id,
    });
  };

  return (
    <>
      {isFetchingUser ? (
        <section className="h-dvh w-full flex items-center justify-center">
          <section className="flex items-center gap-2">
            <Spinner />
            <p>Loading...</p>
          </section>
        </section>
      ) : (
        <>
          Dashboard <LogoutButton />
          <p>Logged in</p>
          <p>{user.fullname}</p>
        </>
      )}
    </>
  );
};

export default Dashboard;
