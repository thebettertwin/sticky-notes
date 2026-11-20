import type { ComponentProps } from "react";
import "./Toolbar.css";

interface ToolbarProps extends ComponentProps<"div"> {
  /** Required so screen readers can tell toolbars apart, e.g. "Notes" or "Note colour" */
  "aria-label": string;
  size?: "md" | "sm";
}

// A generic bar of controls. Where it sits on screen is up to its parent (see ToolbarDock).
function Toolbar({ size = "md", className, ...props }: ToolbarProps) {
  const classes = ["toolbar", `toolbar--${size}`, className].filter(Boolean).join(" ");
  return <div role="toolbar" className={classes} {...props} />;
}

export default Toolbar;
