import React, { useContext, useEffect } from "react";
import LoginForm from "@/components/login/LoginForm";
import ImageContainer from "@/components/login/ImageContainer";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router";
import { SessionContext } from "@/context/SessionContext";

const Login = () => {
  const { session } = useContext(SessionContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (session) {
      console.log("Logged in");

      navigate("/dashboard", { replace: true });
    }
  }, [session]);

  return (
    <section className="w-full h-dvh p-5 flex items-center justify-center">
      <CardContent className="w-fit max-w-300 h-dvh max-h-150 grid grid-cols-2 gap-0 bg-card rounded-lg shadow-md">
        <LoginForm />
        <ImageContainer />
      </CardContent>
    </section>
  );
};

export default Login;
