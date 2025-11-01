import type { HTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/utils";

export interface ULThemeTitleProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * The title of the screen.
   */
  children: ReactNode;
  /**
   * Optional class names for additional styling or overriding default styles.
   */
  className?: string;
}

const ULThemeTitle = ({ children, className, ...rest }: ULThemeTitleProps) => {
  const themedStyles =
    "text-header justify-text-header text-(length:--ul-theme-font-title-size) font-title text-8 leading-10 tracking-[-0.015em] text-black";

  return (
    <h1 className={cn(themedStyles, className)} {...rest}>
      {children}
    </h1>
  );
};

export default ULThemeTitle;
