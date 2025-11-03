import * as React from "react";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { cn } from "@/lib/utils";

export interface ULThemeCodeInputProps {
  /**
   * Number of OTP slots to render
   */
  length?: number;
  /**
   * Value of the OTP input
   */
  value?: string;
  /**
   * Callback when the value changes
   */
  onChange?: (value: string) => void;
  /**
   * Whether the input is disabled
   */
  disabled?: boolean;
  /**
   * Additional class names for the container
   */
  className?: string;
  /**
   * Whether the input has an error
   */
  error?: boolean;
  /**
   * Auto-focus the input on mount
   */
  autoFocus?: boolean;
}

const ULThemeCodeInput = React.forwardRef<
  React.ElementRef<typeof InputOTP>,
  ULThemeCodeInputProps
>(
  (
    {
      length = 6,
      value,
      onChange,
      disabled,
      className,
      error,
      autoFocus,
      ...props
    },
    ref
  ) => {
    return (
      <InputOTP
        ref={ref}
        maxLength={length}
        value={value}
        onChange={onChange}
        disabled={disabled}
        autoFocus={autoFocus}
        containerClassName={cn(
          "flex items-center justify-center gap-2",
          className
        )}
        {...props}
      >
        <InputOTPGroup className="gap-2">
          {Array.from({ length }, (_, index) => (
            <InputOTPSlot
              key={index}
              index={index}
              className={cn(
                // Base styling with Auth0 theme
                "relative flex h-[52px] w-[52px] items-center justify-center",
                "border rounded-[10px] transition-all",

                // Typography - matching Auth0 input fields
                "theme-universal:text-(length:--ul-theme-font-body-text-size)",
                "theme-universal:font-body-text",
                "theme-universal:text-[18px]",
                "theme-universal:leading-6",
                "theme-universal:font-semibold",

                // Default state
                "theme-universal:bg-input-bg",
                "theme-universal:text-input-text",
                "theme-universal:border-input-border",
                "theme-universal:border-(length:--ul-theme-border-input-border-weight)",

                // Focus state
                "theme-universal:focus-within:border-base-focus",
                "theme-universal:focus-within:ring-0",

                // Active/selected state
                "data-[active=true]:theme-universal:border-base-focus",
                "data-[active=true]:theme-universal:ring-2",
                "data-[active=true]:theme-universal:ring-base-focus/15",

                // Error state
                error && [
                  "theme-universal:border-error",
                  "theme-universal:focus-within:border-error",
                ],

                // Disabled state
                "theme-universal:disabled:opacity-50",
                "theme-universal:disabled:cursor-not-allowed"
              )}
            />
          ))}
        </InputOTPGroup>
      </InputOTP>
    );
  }
);

ULThemeCodeInput.displayName = "ULThemeCodeInput";

export default ULThemeCodeInput;
