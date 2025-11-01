import ULThemeLogo from "@/components/ULThemeLogo";
import ULThemeSubtitle from "@/components/ULThemeSubtitle";
import ULThemeTitle from "@/components/ULThemeTitle";

import { useLoginIdManager } from "../hooks/useLoginIdManager";

function Header() {
  const { texts } = useLoginIdManager();

  // Handle text fallbacks in component
  const logoAltText = texts?.logoAltText || "Application Logo";

  return (
    <div className="flex flex-col items-start pb-6">
      {/* Logo row with bottom padding */}
      <div className="pb-6">
        <ULThemeLogo altText={logoAltText}></ULThemeLogo>
      </div>

      {/* Title row with bottom padding */}
      <div className="pb-4 w-full">
        <ULThemeTitle className="m-0">{texts?.title || "Welcome"}</ULThemeTitle>
      </div>

      {/* Description row with bottom padding */}
      <div className="pb-6 w-full">
        <ULThemeSubtitle className="m-0">
          {texts?.description ||
            "Log in to dev-tenant to continue to my acul react."}
        </ULThemeSubtitle>
      </div>
    </div>
  );
}

export default Header;
