import { Dispatch, SetStateAction } from "react";
import { useFormContext } from "react-hook-form";

import type {
  Error,
  TransactionMembersOnLoginId,
} from "@auth0/auth0-acul-js/types";

import { ULThemeFloatingLabelField } from "@/components/form/ULThemeFloatingLabelField";
import { ULThemeFormMessage } from "@/components/form/ULThemeFormMessage";
import { FormField, FormItem } from "@/components/ui/form";
import ULThemeCodeInput from "@/components/ULThemeCodeInput";
import ULThemeCountryCodePicker from "@/components/ULThemeCountryCodePicker";
import { ULThemeAlert, ULThemeAlertTitle } from "@/components/ULThemeError";
import ULThemeLink from "@/components/ULThemeLink";
import ULThemeSubtitle from "@/components/ULThemeSubtitle";
import ULThemeTitle from "@/components/ULThemeTitle";
import {
  isPhoneNumberSupported,
  transformAuth0CountryCode,
} from "@/utils/helpers/countryUtils";
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
    handlePickCountryCode,
  } = useLoginIdManager();
  const { control } = useFormContext<LoginIdFormData>();

  // Handle text fallbacks in component
  const forgotPasswordText = texts?.forgotPasswordText || "Forgot Password?";

  // Get general errors (not field-specific)
  const generalErrors =
    errors?.filter((error: Error) => !error.field || error.field === null) ||
    [];

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

  const shouldShowCountryPicker = isPhoneNumberSupported(allowedIdentifiers);

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

      {/* Country Code Picker - only show if phone numbers are supported */}
      {shouldShowCountryPicker && (
        <div className="pb-6 w-full">
          <ULThemeCountryCodePicker
            selectedCountry={transformAuth0CountryCode(
              (loginIdInstance?.transaction as TransactionMembersOnLoginId)
                ?.countryCode,
              (loginIdInstance?.transaction as TransactionMembersOnLoginId)
                ?.countryPrefix
            )}
            onClick={handlePickCountryCode}
            fullWidth
            placeholder="Select Country"
          />
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
  startPasswordless: (mode: "code" | "link") => Promise<void>;
  setStep: Dispatch<SetStateAction<IdentifierScreenStep>>;
}) => {
  const { watch, control, setValue } = useFormContext<LoginIdFormData>();
  const email = watch("email");

  return (
    <div className="flex flex-col items-center w-full gap-6">
      {/* Title and description */}
      <div className="text-center w-full space-y-2">
        <ULThemeTitle>Enter verification code</ULThemeTitle>
        <ULThemeSubtitle>
          We&apos;ve sent a 6-digit code to{" "}
          <span className="font-semibold">{email}</span>. Please enter it below.
        </ULThemeSubtitle>
      </div>

      {/* Code Input */}
      <div className="w-full flex justify-center pb-2">
        <FormField
          control={control}
          name="code"
          render={({ field }) => (
            <FormItem className="flex flex-col items-center">
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
  startPasswordless: (mode: "code" | "link") => Promise<void>;
  setStep: Dispatch<SetStateAction<IdentifierScreenStep>>;
}) => {
  const { watch } = useFormContext<LoginIdFormData>();
  const email = watch("email");

  return (
    <div className="flex flex-col items-center w-full gap-6">
      {/* Title and description */}
      <div className="text-center w-full space-y-2">
        <ULThemeTitle>Check your email</ULThemeTitle>
        <ULThemeSubtitle>
          We&apos;ve sent a magic link to{" "}
          <span className="font-semibold">{email}</span>. Click the link in the
          email to sign in.
        </ULThemeSubtitle>
      </div>

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
