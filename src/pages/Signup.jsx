import React, { useContext, useEffect } from "react";
import SignUpForm from "@/components/signup/SignUpForm";
import ImageContainer from "@/components/login/ImageContainer";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router";
import { SessionContext } from "@/context/SessionContext";

const Signup = () => {
  const { session } = useContext(SessionContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (session) {
      console.log("Logged in");

      navigate("/dashboard", { replace: true });
    }
  }, [session]);

  return (
    <section className="w-full min-h-dvh p-5 flex justify-center items-center">
      <CardContent className="w-fit max-w-300 h-fit max-h-200 grid grid-cols-1 gap-0 bg-card rounded-lg shadow-md md:grid-cols-2">
        <SignUpForm />
        <ImageContainer />
      </CardContent>
    </section>
  );
};

export default Signup;
