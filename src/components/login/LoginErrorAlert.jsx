import React from "react";
import { Alert, AlertTitle, AlertDescription, AlertAction } from "../ui/alert";
import { CircleExclamationPoint } from "lucide-react";

const LoginErrorAlert = ({ message }) => {
  return (
    <Alert variant={"destructive"}>
      <CircleExclamationPoint strokeWidth={1} />
      <AlertTitle>Login Failed</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
};

export default LoginErrorAlert;
