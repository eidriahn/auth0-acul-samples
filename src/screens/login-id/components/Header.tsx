import ULThemeLogo from "@/components/ULThemeLogo";
import ULThemeSubtitle from "@/components/ULThemeSubtitle";
import ULThemeTitle from "@/components/ULThemeTitle";

import { useLoginIdManager } from "../hooks/useLoginIdManager";

import { IdentifierScreenStep } from "./ScreenController";

function Header({ step }: { step: IdentifierScreenStep }) {
  const { texts } = useLoginIdManager();

  // Handle text fallbacks in component
  const logoAltText = texts?.logoAltText || "Application Logo";

  const textContent = {
    title:
      (step === "identifier" && texts?.title) ||
      (step === "code-input" && texts?.enterCode) ||
      (step === "magic-link" && texts?.checkEmail),
    description:
      (step === "identifier" && texts?.description) ||
      (step === "code-input" && texts?.checkForCode) ||
      (step === "magic-link" && texts?.magicLinkSent),
  };

  return (
    <div className="flex flex-col items-start pb-6">
      {/* Logo row with bottom padding */}
      <div className="pb-6">
        <ULThemeLogo altText={logoAltText}></ULThemeLogo>
      </div>

      {/* Title row with bottom padding */}
      <div className="pb-4 w-full">
        <ULThemeTitle className="m-0">
          {textContent?.title || "Welcome"}
        </ULThemeTitle>
      </div>

      {/* Description row with bottom padding */}
      <div className="pb-6 w-full">
        <ULThemeSubtitle
          className="m-0"
          dangerouslySetInnerHTML={{
            __html:
              textContent?.description ||
              "Log in to dev-tenant to continue to my acul react.",
          }}
        />
      </div>
    </div>
  );
}

export default Header;
