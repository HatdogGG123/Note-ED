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
      navigate("/dashboard", { replace: true });
    }
  }, [session]);

  return (
    <section className="w-full min-h-dvh p-5 flex justify-center items-center">
      <CardContent className="w-fit max-w-300 h-fit max-h-200 grid grid-cols-1 gap-0 bg-card rounded-lg shadow-md md:grid-cols-2">
        <LoginForm />
        <ImageContainer />
      </CardContent>
    </section>
  );
};

export default Login;
