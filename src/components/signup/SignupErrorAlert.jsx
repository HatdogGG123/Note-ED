import React from "react";
import { Alert, AlertTitle, AlertDescription, AlertAction } from "../ui/alert";
import { CircleExclamationPoint } from "lucide-react";

const SignupErrorAlert = () => {
  return (
    <Alert variant={"destructive"}>
      <CircleExclamationPoint strokeWidth={1} />
      <AlertTitle>Signup limit reached</AlertTitle>
      <AlertDescription>Please try again after 1 hour.</AlertDescription>
    </Alert>
  );
};

export default SignupErrorAlert;
