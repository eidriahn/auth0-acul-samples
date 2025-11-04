import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import { usePasswordlessLoginStart } from "@/hooks/usePasswordless";
import { PasswordlessMode } from "@/lib/requests/passwordless";

import { useLoginIdManager } from "../hooks/useLoginIdManager";
import { loginIdSchema } from "../schemas";

import Header from "./Header";
import {
  CodeInputContent,
  IdentifierForm,
  MagicLinkContent,
} from "./IdentifierForm";
import { ScreenActions } from "./ScreenActions";

export interface LoginIdFormData {
  email: string;
  code?: string;
}

export type IdentifierScreenStep = "identifier" | "code-input" | "magic-link";

const content = {
  identifier: IdentifierForm,
  ["code-input"]: CodeInputContent,
  ["magic-link"]: MagicLinkContent,
};

export const ScreenController = () => {
  const [step, setStep] = useState<IdentifierScreenStep>("identifier");

  const form = useForm<LoginIdFormData>({
    defaultValues: {
      email: "",
      code: "",
    },
    resolver: zodResolver(loginIdSchema),
  });
  const email = form.watch("email");
  const { handleLoginId } = useLoginIdManager();
  const { mutate } = usePasswordlessLoginStart();

  const onSubmit = async (data: LoginIdFormData) => {
    await handleLoginId(data.email);
  };

  const handlePasswordlessLoginStart = async (mode: PasswordlessMode) => {
    mutate({ email, mode });

    if (mode === "code") {
      setStep("code-input");
    } else if (mode === "link") {
      setStep("magic-link");
    }
  };

  const Content = content[step];

  return (
    <>
      <Header step={step} />
      <FormProvider {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col items-start w-full"
          id="identifier-form"
        >
          <Content
            startPasswordless={handlePasswordlessLoginStart}
            setStep={setStep}
          />
        </form>
        <ScreenActions
          step={step}
          startPasswordless={handlePasswordlessLoginStart}
        />
      </FormProvider>
    </>
  );
};
