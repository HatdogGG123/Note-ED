import HCaptcha from "@hcaptcha/react-hcaptcha";
import React, { useState, useRef, useContext, useEffect } from "react";
import { SessionContext } from "@/context/SessionContext";
import { supabase } from "@/lib/supabaseClient";
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
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupText,
  InputGroupInput,
  InputGroupTextarea,
} from "../ui/input-group";
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
import { Button } from "../ui/button";
import { Mail, Key, Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router";
import LoginErrorAlert from "./LoginErrorAlert";
import logo from "../../assets/note-ed-logo.jpg";

const LoginForm = () => {
  const navigate = useNavigate();
  const { session, setSession } = useContext(SessionContext);
  const [captchaToken, setCaptchaToken] = useState("");
  const captcha = useRef();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [userCredential, setUserCredential] = useState({
    email: "",
    password: "",
  });

  const [email, setEmail] = useState("");

  const togglePassword = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const handleLogin = async (e) => {
    if (
      !userCredential.email.trim().includes("@") ||
      userCredential.email.trim() === "" ||
      userCredential.password.trim() === ""
    ) {
      return;
    }

    e.preventDefault();
    
    if (!captchaToken || captchaToken == "") {
      setLoginError(
        "Captcha is needed to login. Please check the checkbox before logging in.",
      );
      return;
    }
    

    const { data, error } = await supabase.auth.signInWithPassword({
      email: userCredential.email.trim(),
      password: userCredential.password.trim(),
      options: { captchaToken },
    });

    captcha.current.resetCaptcha();

    if (error) {
      setLoginError("You have entered invalid credentials. Please try again.");
      console.log(error);

      return;
    } else {
      console.log(data);
      setEmail(data.user.email);
      setSession(data.session);
    }
  };

  return (
    <section className="flex justify-end items-center">
      <Card
        className={
          "h-fit justify-center w-md border-none ring-0 shadow-none md:rounded-tr-none md:rounded-br-none"
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
            <span className="text-[2rem]">Welcome to Task-ED!</span>
          </FieldLegend>
          <FieldDescription className={"text-center"}>
            Log in to keep your tasks and notes organized in one place.
          </FieldDescription>

          {loginError && <LoginErrorAlert message={loginError} />}
        </CardHeader>

        <CardContent>
          <form action="" className="w-full h-full" onSubmit={handleLogin}>
            {/* Email Input Field */}
            <FieldGroup>
              <Field>
                <FieldContent>
                  <FieldLabel htmlFor={"email"}>Email</FieldLabel>
                  <InputGroup>
                    <InputGroupAddon>
                      <Mail strokeWidth={1} />
                    </InputGroupAddon>
                    <InputGroupInput
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

                        setLoginError("");
                      }}
                    />
                  </InputGroup>
                </FieldContent>
              </Field>

              {/* Password Input Field */}
              <Field>
                <FieldContent>
                  <FieldLabel htmlFor={"password"}>Password</FieldLabel>
                  <InputGroup>
                    <InputGroupAddon align="inline-start">
                      <Key strokeWidth={1} />
                    </InputGroupAddon>
                    <InputGroupInput
                      id={"password"}
                      type={isPasswordVisible ? "text" : "password"}
                      required
                      ref={""}
                      onChange={(e) => {
                        setUserCredential((prev) => ({
                          ...prev,
                          password: e.target.value,
                        }));

                        setLoginError("");
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

              <HCaptcha
                ref={captcha}
                sitekey={import.meta.env.VITE_HCAPTCHA_SITEKEY}
                onVerify={(token) => {
                  setCaptchaToken(token);
                }}
              />

              {/* Login Button */}
              <Button size="lg" type={"submit"} className={"mt-5"}>
                Login
              </Button>
            </FieldGroup>
          </form>
        </CardContent>

        <CardFooter>
          <CardDescription className={"text-center w-full"}>
            Doesn't have an account yet?{" "}
            <span className="underline underline-offset-1 text-blue">
              <Link to={"/signup"}>Sign Up</Link>
            </span>
          </CardDescription>
        </CardFooter>
      </Card>
    </section>
  );
};

export default LoginForm;
