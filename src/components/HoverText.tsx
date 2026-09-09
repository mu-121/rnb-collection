import type { ReactNode } from "react";

type HoverTextProps = {
  children: ReactNode;
  className?: string;
};

/**
 * Vertical roll hover label — duplicate line slides in via transform.
 * Triggered by parent :hover / :focus-visible (see .hover-text in globals.css).
 */
export default function HoverText({ children, className }: HoverTextProps) {
  return (
    <span className={className ? `hover-text ${className}` : "hover-text"}>
      <span className="hover-text__track">
        <span className="hover-text__line">{children}</span>
        <span className="hover-text__line" aria-hidden="true">
          {children}
        </span>
      </span>
    </span>
  );
}
