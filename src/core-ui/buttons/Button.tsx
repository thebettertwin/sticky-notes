import type { ComponentProps } from "react";

interface ButtonProps extends ComponentProps<"button"> {
  variant?: "primary" | "secondary";
}

function Button({ variant = "primary", className, type = "button", ...props }: ButtonProps) {
  const classes = [`${variant}-button`, className].filter(Boolean).join(" ");
  return <button type={type} className={classes} {...props} />;
}

export default Button;
