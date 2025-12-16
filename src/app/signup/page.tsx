"use client";
import { authClient } from "@/lib/auth/client";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { useState } from "react";
import { Message } from "primereact/message";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import InputField from "@/components/form/InputField";
import { ProgressSpinner } from "primereact/progressspinner";

interface SignupFormFields {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const usernameValidation = {
  required: "Username is required",
  minLength: {
    value: 3,
    message: "Username must be at least 3 characters long",
  },
  maxLength: {
    value: 20,
    message: "Username must be at most 20 characters long",
  },
  validate: async (value: string) => {
    const res = await authClient.isUsernameAvailable({
      username: value,
    });
    return res.data?.available ? true : "Username is not available";
  },
};

const emailValidation = {
  required: "Email is required",
  pattern: {
    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
    message: "Invalid email address",
  },
};

const passwordValidation = {
  required: "Password is required",
  minLength: {
    value: 8,
    message: "Password must be at least 8 characters long",
  },
};

const confirmPasswordValidation = {
  required: "Confirm password is required",
  validate: (value: string, formValues: SignupFormFields) => {
    return value !== formValues.password ? "Passwords do not match" : undefined;
  },
};

function SignupComplete() {
  return (
    <div className="flex flex-col" id="signup-complete-container">
      <h1 className="py-4">Verification</h1>
      <p>You should receive an email with a verification link shortly.</p>
      <p>Thank you for registering with Satisfactory Vehicle Manager.</p>
    </div>
  );
}

function SignupErrorMessage({ error }: { error: { message: string } }) {
  return <Message severity="error" text={error.message} id="signup-error-message" />;
}

function SignupForm({
  setSignupCompleted,
}: {
  setSignupCompleted: (completed: boolean) => void;
}) {
  const [busy, setBusy] = useState(false);
  const [signupError, setSignupError] = useState<{
    code?: string | undefined | undefined;
    message?: string | undefined | undefined;
    status?: number;
    statusText?: string;
  } | null>(null);
  const {
    handleSubmit,
    control,
    formState: { errors, isValid },
  } = useForm<SignupFormFields>({
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    mode: "onBlur",
  });
  const submitHandler: SubmitHandler<SignupFormFields> = async (e) => {
    setBusy(true);
    setSignupError(null);

    const { username, email, password, confirmPassword } = e;

    if (password !== confirmPassword) {
      setSignupError({ message: "Passwords do not match" });
      setBusy(false);
      return;
    }
    try {
      const { error } = await authClient.signUp.email({
        email,
        name: username,
        username: username,
        password,
        callbackURL: "/login?verified=true",
      });
      setBusy(false);
      if (error) {
        setSignupError(error);
      } else {
        setSignupCompleted(true);
      }
    } catch (err) {
      console.error("Error:", err);
      setSignupError({ message: "An error occurred while signing up" });
      setBusy(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(submitHandler)}
      id="signup-form"
      className="flex flex-col gap-4 pb-4"
    >
      {signupError && <SignupErrorMessage error={signupError as { message: string }} />}
      <InputField
        invalid={errors.username ? true : false}
        invalidMessage={errors.username?.message as string}
        label="Username"
        inputId="signup-username"
      >
        <Controller
          name="username"
          control={control}
          rules={usernameValidation}
          render={({ field }) => (
            <InputText
              {...field}
              id="signup-username"
              invalid={errors.username ? true : false}
              size="small"
              autoComplete="off"
            />
          )}
        />
      </InputField>
      <InputField
        invalid={errors.email ? true : false}
        invalidMessage={errors.email?.message as string}
        label="Email address"
        inputId="signup-email"
      >
        <Controller
          name="email"
          control={control}
          rules={emailValidation}
          render={({ field }) => (
            <InputText
              {...field}
              id="signup-email"
              invalid={errors.email ? true : false}
              size="small"
              autoComplete="off"
            />
          )}
        />
      </InputField>
      <InputField
        invalid={errors.password ? true : false}
        invalidMessage={errors.password?.message as string}
        label="Password"
        inputId="signup-password"
      >
        <Controller
          name="password"
          control={control}
          rules={passwordValidation}
          render={({ field }) => (
            <Password
              {...field}
              invalid={errors.password ? true : false}
              autoComplete="off"
              feedback={false}
              toggleMask
              inputId="signup-password"
            />
          )}
        />
      </InputField>
      <InputField
        invalid={errors.confirmPassword ? true : false}
        invalidMessage={errors.confirmPassword?.message as string}
        label="Confirm password"
        inputId="signup-confirm-password"
      >
        <Controller
          name="confirmPassword"
          control={control}
          rules={confirmPasswordValidation}
          render={({ field }) => (
            <Password
              {...field}
              invalid={errors.confirmPassword ? true : false}
              autoComplete="off"
              feedback={false}
              toggleMask
              inputId="signup-confirm-password"
              
            />
          )}
        />
      </InputField>
      <Button
        type="submit"
        label={busy ? "Creating account ... " : "Sign up"}
        id="signup-submit"
        
        disabled={!isValid || busy}
      />{" "}
      {busy && <ProgressSpinner />}
    </form>
  );
}

export default function SignupPage() {
  const [signupCompleted, setSignupCompleted] = useState(false);

  return (
    <div className="flex flex-1 items-center justify-center ">
      <div className="flex flex-col border-2 border-gray-400 rounded-md px-4 w-1/2">
        <h1 className="py-4 text-3xl">Sign up</h1>
        {!signupCompleted && (
          <SignupForm setSignupCompleted={setSignupCompleted} />
        )}
        {signupCompleted && <SignupComplete />}
      </div>
    </div>
  );
}
