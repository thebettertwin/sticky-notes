import type { ComponentProps } from "react";
import type { Icon } from "@phosphor-icons/react";
import Button from "./Button";
import "./IconButton.css";

interface IconButtonProps
  extends Omit<ComponentProps<typeof Button>, "children" | "aria-label"> {
  label: string;
  icon: Icon;
  iconSize?: number;
}

function IconButton({ label, icon: IconComponent, iconSize = 24, className, ...props }: IconButtonProps) {
  return (
    <Button
      aria-label={label}
      title={label}
      className={["icon-button", className].filter(Boolean).join(" ")}
      {...props}
    >
      <IconComponent size={iconSize} aria-hidden="true" focusable="false" />
    </Button>
  );
}

export default IconButton;
