import type { ComponentProps } from "react";
import type { Icon } from "@phosphor-icons/react";
import Button from "./Button";
import "./IconButton.css";

interface IconButtonProps
  extends Omit<ComponentProps<typeof Button>, "children" | "aria-label"> {
  label: string;
  icon: Icon;
  /** Optional icon shown instead of `icon` on hover and keyboard focus */
  hoverIcon?: Icon;
  iconSize?: string;
}

function IconButton({
  label,
  icon: IconComponent,
  hoverIcon: HoverIconComponent,
  iconSize = "1.5rem",
  className,
  ...props
}: IconButtonProps) {
  return (
    <Button
      aria-label={label}
      title={label}
      className={["icon-button", HoverIconComponent && "has-hover-icon", className]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      <IconComponent
        className="icon-button__icon"
        size={iconSize}
        aria-hidden="true"
        focusable="false"
      />
      {HoverIconComponent && (
        <HoverIconComponent
          className="icon-button__icon icon-button__icon--hover"
          size={iconSize}
          aria-hidden="true"
          focusable="false"
        />
      )}
    </Button>
  );
}

export default IconButton;
