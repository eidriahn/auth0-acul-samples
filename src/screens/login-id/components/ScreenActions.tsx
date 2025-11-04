import { useFormContext } from "react-hook-form";

import { ULThemePrimaryButton } from "@/components/ULThemePrimaryButton";
import { env } from "@/lib/env";

import { useLoginIdManager } from "../hooks/useLoginIdManager";
import { loginIdSchema } from "../schemas";

import { IdentifierScreenStep, LoginIdFormData } from "./ScreenController";

export const ScreenActions = ({
  step,
  startPasswordless,
}: {
  step: IdentifierScreenStep;
  startPasswordless: (mode: "code" | "link") => Promise<void>;
}) => {
  const {
    watch,
    formState: { isSubmitting },
  } = useFormContext<LoginIdFormData>();
  const emailFieldVal = watch("email");
  const [code, email] = watch(["code", "email"]);

  const { texts } = useLoginIdManager();

  const buttonText = texts?.buttonText || "Continue";

  if (step === "identifier") {
    return (
      <>
        <div className="pb-4 w-full">
          <ULThemePrimaryButton
            type="button"
            className="w-full"
            disabled={
              loginIdSchema.shape.email.safeParse(emailFieldVal).success ===
              false
            }
            onClick={() => startPasswordless("code")}
            variant="outline"
          >
            Send a Code
          </ULThemePrimaryButton>
        </div>
        <div className="pb-4 w-full">
          <ULThemePrimaryButton
            type="button"
            className="w-full"
            disabled={
              loginIdSchema.shape.email.safeParse(emailFieldVal).success ===
              false
            }
            onClick={() => startPasswordless("link")}
            variant="outline"
          >
            Send Magic Link
          </ULThemePrimaryButton>
        </div>
        {/* Button row with bottom padding */}
        <div className="pb-4 w-full">
          <ULThemePrimaryButton
            type="submit"
            className="w-full"
            form="identifier-form"
            disabled={isSubmitting}
          >
            {buttonText}
          </ULThemePrimaryButton>
        </div>
      </>
    );
  }

  const handleVerifyCode = async () => {
    if (!code || code.length !== 6) {
      return;
    }

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      email,
      client_id: env.VITE_AUTH0_CLIENT_ID,
      connection: "email",
      verification_code: code,
    });

    const res = await fetch(
      `https://test-rejoin.adrianluca.dev/passwordless/verify`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: raw,
        redirect: "follow",
      }
    );

    if (res.ok) {
      window.location.href = "https://planetfitness.com/";
    }
  };

  if (step === "code-input") {
    return (
      <div className="pb-4 w-full">
        <ULThemePrimaryButton
          type="button"
          className="w-full"
          disabled={!code || (code?.length ?? 0) !== 6}
          onClick={handleVerifyCode}
        >
          Verify Code
        </ULThemePrimaryButton>
      </div>
    );
  }

  if (step === "magic-link") {
    return null;
  }

  return null;
};
