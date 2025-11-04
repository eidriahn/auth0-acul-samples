import { Dispatch, SetStateAction } from "react";
import { useFormContext } from "react-hook-form";

import type { Error } from "@auth0/auth0-acul-js/types";

import { ULThemeFloatingLabelField } from "@/components/form/ULThemeFloatingLabelField";
import { ULThemeFormMessage } from "@/components/form/ULThemeFormMessage";
import { FormField, FormItem } from "@/components/ui/form";
import ULThemeCodeInput from "@/components/ULThemeCodeInput";
import { ULThemeAlert, ULThemeAlertTitle } from "@/components/ULThemeError";
import ULThemeLink from "@/components/ULThemeLink";
import ULThemeSubtitle from "@/components/ULThemeSubtitle";
import { PasswordlessMode } from "@/lib/requests/passwordless";
import { getFieldError } from "@/utils/helpers/errorUtils";
import { getIdentifierDetails } from "@/utils/helpers/identifierUtils";
import { rebaseLinkToCurrentOrigin } from "@/utils/helpers/urlUtils";

import { useLoginIdManager } from "../hooks/useLoginIdManager";

import { IdentifierScreenStep, LoginIdFormData } from "./ScreenController";

export const IdentifierForm = () => {
  const {
    errors,
    resetPasswordLink,
    isForgotPasswordEnabled,
    loginIdInstance,
    texts,
  } = useLoginIdManager();
  const { control } = useFormContext<LoginIdFormData>();
  // Handle text fallbacks in component
  const forgotPasswordText = texts?.forgotPasswordText || "Forgot Password?";

  // Get general errors (not field-specific)
  const generalErrors = (errors || []).filter(
    (error: Error) => !error.field || error.field === null
  );

  const identifierSDKError =
    getFieldError("identifier", errors) ||
    getFieldError("email", errors) ||
    getFieldError("phone", errors) ||
    getFieldError("username", errors);

  // Get allowed identifiers directly from SDK
  const allowedIdentifiers =
    loginIdInstance?.transaction?.allowedIdentifiers || [];

  const {
    label: identifierLabel,
    type: identifierType,
    autoComplete: identifierAutoComplete,
  } = getIdentifierDetails(allowedIdentifiers, texts);

  const localizedResetPasswordLink =
    resetPasswordLink && rebaseLinkToCurrentOrigin(resetPasswordLink);

  return (
    <>
      {/* General alerts at the top */}
      {generalErrors.length > 0 && (
        <div className="space-y-3 mb-4 w-full">
          {generalErrors.map((error: Error, index: number) => (
            <ULThemeAlert key={index} variant="destructive">
              <ULThemeAlertTitle>{error.message}</ULThemeAlertTitle>
            </ULThemeAlert>
          ))}
        </div>
      )}

      {/* Input row with bottom padding */}
      <div className="pb-6 w-full">
        <FormField
          control={control}
          name="email"
          rules={{
            required: "This field is required",
            maxLength: {
              value: 100,
              message: "Maximum 100 characters allowed",
            },
          }}
          render={({ field, fieldState }) => (
            <FormItem>
              <ULThemeFloatingLabelField
                {...field}
                label={identifierLabel}
                type={identifierType}
                autoFocus={true}
                autoComplete={identifierAutoComplete}
                error={!!fieldState.error || !!identifierSDKError}
              />
              <ULThemeFormMessage
                sdkError={identifierSDKError}
                hasFormError={!!fieldState.error}
              />
            </FormItem>
          )}
        />
      </div>

      {/* Forgot Password link */}
      {isForgotPasswordEnabled && localizedResetPasswordLink && (
        <div className="text-left pb-4 w-full">
          <ULThemeLink href={localizedResetPasswordLink}>
            {forgotPasswordText}
          </ULThemeLink>
        </div>
      )}
    </>
  );
};

export const CodeInputContent = ({
  startPasswordless: resendCode,
  setStep,
}: {
  startPasswordless: (mode: PasswordlessMode) => Promise<void>;
  setStep: Dispatch<SetStateAction<IdentifierScreenStep>>;
}) => {
  const { control, setValue } = useFormContext<LoginIdFormData>();

  return (
    <div className="flex flex-col items-center w-full gap-6">
      <div className="w-full flex justify-center pb-2">
        <FormField
          control={control}
          name="code"
          render={({ field }) => (
            <FormItem>
              <ULThemeCodeInput
                length={6}
                value={field.value}
                onChange={field.onChange}
                autoFocus
              />
            </FormItem>
          )}
        />
      </div>

      {/* Resend link */}
      <div className="text-center w-full">
        <ULThemeSubtitle className="inline">
          Didn&apos;t receive the code?{" "}
        </ULThemeSubtitle>
        <ULThemeLink
          href="#"
          onClick={(e) => {
            e.preventDefault();
            resendCode("code");
          }}
        >
          Resend code
        </ULThemeLink>
      </div>

      {/* Back link */}
      <div className="text-center w-full">
        <ULThemeLink
          href="#"
          onClick={(e) => {
            e.preventDefault();
            setStep("identifier");
            setValue("code", "");
          }}
        >
          ← Back to login
        </ULThemeLink>
      </div>
    </div>
  );
};

export const MagicLinkContent = ({
  startPasswordless,
  setStep,
}: {
  startPasswordless: (mode: PasswordlessMode) => Promise<void>;
  setStep: Dispatch<SetStateAction<IdentifierScreenStep>>;
}) => {
  return (
    <div className="flex flex-col items-center w-full gap-6">
      {/* Info message */}
      <div className="w-full">
        <ULThemeAlert className="border-base-focus/20 bg-base-focus/5 border">
          <ULThemeAlertTitle className="text-base font-normal text-[#4B4B4C]">
            <span className="font-semibold">Tip:</span> The link will expire in
            15 minutes. If you don&apos;t see the email, check your spam folder.
          </ULThemeAlertTitle>
        </ULThemeAlert>
      </div>

      {/* Resend link */}
      <div className="text-center w-full">
        <ULThemeSubtitle className="inline">
          Didn&apos;t receive the email?{" "}
        </ULThemeSubtitle>
        <ULThemeLink
          href="#"
          onClick={(e) => {
            e.preventDefault();
            startPasswordless("link");
          }}
        >
          Resend link
        </ULThemeLink>
      </div>

      {/* Back link */}
      <div className="text-center w-full">
        <ULThemeLink
          href="#"
          onClick={(e) => {
            e.preventDefault();
            setStep("identifier");
          }}
        >
          ← Back to login
        </ULThemeLink>
      </div>
    </div>
  );
};
