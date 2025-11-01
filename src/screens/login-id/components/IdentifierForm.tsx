import { useForm } from "react-hook-form";

import type {
  Error,
  TransactionMembersOnLoginId,
} from "@auth0/auth0-acul-js/types";

import { ULThemeFloatingLabelField } from "@/components/form/ULThemeFloatingLabelField";
import { ULThemeFormMessage } from "@/components/form/ULThemeFormMessage";
import { Form, FormField, FormItem } from "@/components/ui/form";
import ULThemeCountryCodePicker from "@/components/ULThemeCountryCodePicker";
import { ULThemeAlert, ULThemeAlertTitle } from "@/components/ULThemeError";
import ULThemeLink from "@/components/ULThemeLink";
import { ULThemePrimaryButton } from "@/components/ULThemePrimaryButton";
import {
  isPhoneNumberSupported,
  transformAuth0CountryCode,
} from "@/utils/helpers/countryUtils";
import { getFieldError } from "@/utils/helpers/errorUtils";
import { getIdentifierDetails } from "@/utils/helpers/identifierUtils";
import { rebaseLinkToCurrentOrigin } from "@/utils/helpers/urlUtils";

import { useLoginIdManager } from "../hooks/useLoginIdManager";

interface LoginIdFormData {
  identifier: string;
  captcha?: string;
}

function IdentifierForm() {
  const {
    handleLoginId,
    errors,
    resetPasswordLink,
    isForgotPasswordEnabled,
    loginIdInstance,
    texts,
    handlePickCountryCode,
  } = useLoginIdManager();

  const form = useForm<LoginIdFormData>({
    defaultValues: {
      identifier: "",
      captcha: "",
    },
  });

  const {
    formState: { isSubmitting },
  } = form;

  // Handle text fallbacks in component
  const buttonText = texts?.buttonText || "Continue";
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

  // Proper submit handler with form data
  const onSubmit = async (data: LoginIdFormData) => {
    await handleLoginId(data.identifier);
  };

  const localizedResetPasswordLink =
    resetPasswordLink && rebaseLinkToCurrentOrigin(resetPasswordLink);

  const shouldShowCountryPicker = isPhoneNumberSupported(allowedIdentifiers);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col items-start w-full"
      >
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
            control={form.control}
            name="identifier"
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

        {/* Button row with bottom padding */}
        <div className="pb-4 w-full">
          <ULThemePrimaryButton
            type="submit"
            className="w-full"
            disabled={isSubmitting}
          >
            {buttonText}
          </ULThemePrimaryButton>
        </div>
      </form>
    </Form>
  );
}

export default IdentifierForm;
