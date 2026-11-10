import { SessionContext } from "@/context/SessionContext";
import React, { useState, useContext, useRef } from "react";
import { Link, useNavigate } from "react-router";
import { Mail, Lock, User2, Eye, EyeOff } from "lucide-react";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import { Alert, AlertTitle, AlertDescription, AlertAction } from "../ui/alert";
import {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
} from "../ui/card";
import {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldContent,
  FieldTitle,
} from "../ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupText,
  InputGroupInput,
  InputGroupTextarea,
} from "../ui/input-group";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import SignupErrorAlert from "./SignupErrorAlert";
import { supabase } from "@/lib/supabaseClient";
import EmailSentAlert from "./EmailSentAlert";
import { Spinner } from "@/components/ui/spinner";
import logo from "../../assets/note-ed-logo.jpg";

const SignUpForm = () => {
  let [captchaToken, setCaptchaToken] = useState("");
  const captcha = useRef();
  const { setSession } = useContext(SessionContext);
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [signupError, setSignupError] = useState(null);
  const [userCredentials, setUserCredential] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    fullname: "",
  });

  const navigate = useNavigate();

  const togglePassword = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!captchaToken) {
      setSignupError({ captchaRequired: "Please complete the captcha." });
      return;
    }

    setIsLoading(true);
    setSignupError("");
    setIsEmailSent(false);

    if (userCredentials.password !== userCredentials.confirmPassword) {
      setSignupError({
        passwordNotMatch: "This field must much your password.",
      });

      setIsLoading(false);
      return;
    } else if (userCredentials.password.length < 8) {
      setSignupError({
        weakPassword: "Password must be 8 characters long",
      });

      setIsLoading(false);
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email: userCredentials.email,
      password: userCredentials.password,
      options: {
        emailRedirectTo: `${window.location.origin}/dashboard`,
        captchaToken,
      },
    });

    captcha.current?.resetCaptcha();
    setCaptchaToken("");

    if (data.user?.identities?.length === 0) {
      setSignupError({
        existingEmail:
          "This email is already registered. Please log in instead.",
      });

      setIsLoading(false);
      return;
    } else if (error?.code === "weak_password") {
      setSignupError({
        weakPassword: "Password must be 8 characters long",
      });

      setIsLoading(false);
      return;
    } else if (error?.code === "over_email_send_rate_limit") {
      setSignupError({
        requestLimitReached: "Too many attempts. Please try again later.",
      });
    } else if (error?.message?.toLowerCase().includes("captcha")) {
      setSignupError({
        captchaRequestLimitReached: "Captcha failed. Please try again.",
      });
    }

    setIsLoading(false);

    if (data.session) {
      console.log("Account Created");

      const profileResponse = await createNewProfile(
        data.user.id,
        userCredentials.fullname,
      );

      if (profileResponse.error) {
        console.log(profileResponse.error);
        return;
      }

      setUser(profileResponse.data);
      setSession(data.session);

      navigate("/dashboard", { replace: true });
    } else if (!data.session && !error) {
      setIsEmailSent(true);
    }

    console.log(data);
  };

  return (
    <section className="flex justify-end items-center h-full w-full">
      <Card
        className={
          "h-full justify-center w-md  border-none ring-0 md:rounded-tr-none md:rounded-br-none shadow-none"
        }
      >
        <CardHeader className={"flex flex-col items-center"}>
          <img
            src={logo}
            alt="Note-ED Logo."
            loading="lazy"
            className="aspect-square size-10"
          />
          <FieldLegend className={"text-center"}>
            <span className="text-[2rem] text-center">Sign In to Task-ED!</span>
          </FieldLegend>
          <FieldDescription className={"text-center"}>
            Log in to keep your tasks and notes organized in one place.
          </FieldDescription>

          {signupError?.requestLimitReached && (
            <SignupErrorAlert message={signupError.requestLimitReached} />
          )}

          {isEmailSent && <EmailSentAlert email={userCredentials.email} />}
        </CardHeader>

        <CardContent>
          <form action="" className="w-full h-full" onSubmit={handleSignup}>
            {/* fullname Input Field */}
            <FieldGroup>
              <Field>
                <FieldContent>
                  <FieldLabel htmlFor={"fullname"}>fullname</FieldLabel>
                  <InputGroup>
                    <InputGroupAddon>
                      <User2 strokeWidth={1} />
                    </InputGroupAddon>
                    <InputGroupInput
                      id={"fullname"}
                      placeholder={"John Doe"}
                      type={"text"}
                      required
                      ref={""}
                      onChange={(e) => {
                        setUserCredential((prev) => ({
                          ...prev,
                          fullname: e.target.value,
                        }));

                        setSignupError("");
                      }}
                    />
                  </InputGroup>
                </FieldContent>
              </Field>

              {/* Email Input Field */}
              <Field data-invalid={!!signupError?.existingEmail}>
                <FieldContent>
                  <FieldLabel htmlFor={"email"}>Email</FieldLabel>
                  <InputGroup>
                    <InputGroupAddon>
                      <Mail strokeWidth={1} />
                    </InputGroupAddon>
                    <InputGroupInput
                      aria-invalid={!!signupError?.existingEmail}
                      id={"email"}
                      placeholder={"sample@gmail.com"}
                      type={"email"}
                      required
                      ref={""}
                      onChange={(e) => {
                        setUserCredential((prev) => ({
                          ...prev,
                          email: e.target.value,
                        }));

                        setSignupError("");
                      }}
                    />
                  </InputGroup>
                  {signupError?.existingEmail && (
                    <>
                      <FieldError>{signupError?.existingEmail}</FieldError>
                    </>
                  )}
                </FieldContent>
              </Field>

              {/* Password Input Field */}
              <Field data-invalid={!!signupError?.weakPassword}>
                <FieldContent>
                  <FieldLabel htmlFor={"password"}>Password</FieldLabel>
                  <FieldDescription
                    className={
                      !!signupError?.weakPassword ? "text-destructive" : ""
                    }
                  >
                    Must be 8 characters long
                  </FieldDescription>
                  <InputGroup>
                    <InputGroupAddon align="inline-start">
                      <Lock strokeWidth={1} />
                    </InputGroupAddon>
                    <InputGroupInput
                      aria-invalid={!!signupError?.weakPassword}
                      id={"password"}
                      type={isPasswordVisible ? "text" : "password"}
                      required
                      ref={""}
                      onChange={(e) => {
                        setUserCredential((prev) => ({
                          ...prev,
                          password: e.target.value,
                        }));

                        setSignupError("");
                      }}
                    />
                    <InputGroupButton
                      onClick={togglePassword}
                      align="inline-end"
                    >
                      {isPasswordVisible ? (
                        <Eye strokeWidth={1} />
                      ) : (
                        <EyeOff strokeWidth={1} />
                      )}
                    </InputGroupButton>
                  </InputGroup>

                  {signupError?.weakPassword && (
                    <FieldError>{signupError?.weakPassword}</FieldError>
                  )}
                </FieldContent>
              </Field>

              {/* Confirm Password Input Field */}
              <Field data-invalid={!!signupError?.passwordNotMatch}>
                <FieldContent>
                  <FieldLabel htmlFor={"confirmPassword"}>
                    Confirm Password
                  </FieldLabel>
                  <FieldDescription
                    className={
                      !!signupError?.passwordNotMatch ? "text-destructive" : ""
                    }
                  >
                    Must match the password
                  </FieldDescription>
                  <InputGroup>
                    <InputGroupAddon align="inline-start">
                      <Lock strokeWidth={1} />
                    </InputGroupAddon>
                    <InputGroupInput
                      aria-invalid={!!signupError?.passwordNotMatch}
                      id={"confirmPassword"}
                      type={isPasswordVisible ? "text" : "password"}
                      required
                      ref={""}
                      onChange={(e) => {
                        setUserCredential((prev) => ({
                          ...prev,
                          confirmPassword: e.target.value,
                        }));

                        setSignupError("");
                      }}
                    />
                    <InputGroupButton
                      onClick={togglePassword}
                      align="inline-end"
                    >
                      {isPasswordVisible ? (
                        <Eye strokeWidth={1} />
                      ) : (
                        <EyeOff strokeWidth={1} />
                      )}
                    </InputGroupButton>
                  </InputGroup>
                </FieldContent>
              </Field>

              <Field>
                <HCaptcha
                  sitekey={import.meta.env.VITE_HCAPTCHA_SITEKEY}
                  onVerify={setCaptchaToken}
                  ref={captcha}
                />
                {(signupError?.captchaRequired ||
                  signupError?.captchaRequestLimitReached) && (
                  <FieldError>
                    {signupError?.captchaRequired ||
                      signupError?.captchaRequestLimitReached}
                  </FieldError>
                )}
              </Field>

              {/* Login Button */}
              <Button size="lg" type={"submit"} className={"mt-5"}>
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <Spinner />
                    <p>Signing Up...</p>
                  </div>
                ) : (
                  <>Sign up</>
                )}
              </Button>
            </FieldGroup>
          </form>
        </CardContent>

        <CardFooter>
          <CardDescription className={"text-center w-full"}>
            Already have an account?{" "}
            <span className="underline underline-offset-1 text-blue">
              <Link to={"/"}>Log in</Link>
            </span>
          </CardDescription>
        </CardFooter>
      </Card>
    </section>
  );
};

async function createNewProfile(id, fullname) {
  const response = await supabase
    .from("profile")
    .insert({
      id: id,
      fullname: fullname,
    })
    .select()
    .single();

  return response;
}

export default SignUpForm;
