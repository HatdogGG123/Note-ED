import React from "react";
import { Alert, AlertTitle, AlertDescription, AlertAction } from "../ui/alert";
import { Info } from "lucide-react";

const EmailSentAlert = ({ email }) => {
  return (
    <Alert>
      <Info strokeWidth={1} />
      <AlertTitle>Confirmation link sent</AlertTitle>
      <AlertDescription>
        We sent a confirmation link to{" "}
        <span className="font-semibold">{email}</span>. Click it to activate
        youraccount and continue to your dashboard.
      </AlertDescription>
    </Alert>
  );
};

export default EmailSentAlert;
