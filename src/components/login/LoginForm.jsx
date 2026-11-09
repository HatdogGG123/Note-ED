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

const LoginForm = () => {
  const navigate = useNavigate();
  const { session, setSession } = useContext(SessionContext);

  const [loginError, setLoginError] = useState("");
  const [userCredential, setUserCredential] = useState({
    email: "",
    password: "",
  });

  const [email, setEmail] = useState("");

  const handleLogin = async (e) => {
    if (
      !userCredential.email.trim().includes("@") ||
      userCredential.email.trim() === "" ||
      userCredential.password.trim() === ""
    ) {
      return;
    }

    e.preventDefault();

    const { data, error } = await supabase.auth.signInWithPassword({
      email: userCredential.email.trim(),
      password: userCredential.password.trim(),
    });

    if (error) {
      setLoginError("You have entered invalid credentials. Please try again.");
      return;
    } else {
      console.log(data);
      setEmail(data.user.email);
      setSession(data.session);
    }
  };

  return (
    <section className="flex justify-end">
      <Card
        className={
          "h-full justify-center w-md rounded-tr-none rounded-br-none border-none ring-0"
        }
      >
        <p>{email}</p>
        <CardHeader className={"flex flex-col items-center"}>
          <img
            src="/src/assets/note-ed-logo.jpg"
            alt="Note-ED Logo."
            loading="lazy"
            className="aspect-square size-10"
          />
          <FieldLegend>
            <span className="text-[2rem]">Welcome to Note-ED!</span>
          </FieldLegend>
          <FieldDescription>
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
                      placeholder={"sample@gmail.com"}
                      type={"password"}
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
                    <InputGroupButton align="inline-end">
                      <EyeOff strokeWidth={1} />
                    </InputGroupButton>
                  </InputGroup>

                  <FieldLabel className={"w-full flex justify-end"}>
                    <Link to={"/forgotPassword"} className="underline">
                      Forgot Password?
                    </Link>
                  </FieldLabel>
                </FieldContent>
              </Field>

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
