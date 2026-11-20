import type { ComponentProps } from "react";
import "./Toolbar.css";

// Fixed to the bottom centre of the screen. Stacks its toolbars vertically,
// so a secondary toolbar placed first sits above the primary one.
function ToolbarDock({ className, ...props }: ComponentProps<"div">) {
  const classes = ["toolbar-dock", className].filter(Boolean).join(" ");
  return <div className={classes} {...props} />;
}

export default ToolbarDock;
