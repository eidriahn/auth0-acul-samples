import { useFormContext } from "react-hook-form";

import { ULThemePrimaryButton } from "@/components/ULThemePrimaryButton";
import { usePasswordlessCodeVerify } from "@/hooks/usePasswordless";
import { startPasswordlessLogin } from "@/lib/requests/passwordless";

import { useLoginIdManager } from "../hooks/useLoginIdManager";
import { loginIdSchema } from "../schemas";

import { IdentifierScreenStep, LoginIdFormData } from "./ScreenController";

export const ScreenActions = ({
  step,
  startPasswordless,
}: {
  step: IdentifierScreenStep;
  startPasswordless: (
    mode: Parameters<typeof startPasswordlessLogin>[0]["mode"]
  ) => Promise<void>;
}) => {
  const {
    watch,
    formState: { isSubmitting },
  } = useFormContext<LoginIdFormData>();
  const emailFieldVal = watch("email");
  const [code, email] = watch(["code", "email"]);

  const { texts } = useLoginIdManager();
  const { mutateAsync, isPending } = usePasswordlessCodeVerify({
    onSuccess: (data) => {
      if (data.ok) {
        window.location.href = "https://planetfitness.com/";
      }
    },
  });

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

    await mutateAsync({ email, code });
  };

  if (step === "code-input") {
    return (
      <div className="pb-4 w-full">
        <ULThemePrimaryButton
          type="button"
          className="w-full"
          disabled={!code || (code?.length ?? 0) !== 6 || isPending}
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
