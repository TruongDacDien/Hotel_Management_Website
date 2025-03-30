// import React from "react";
// import * as TogglePrimitive from "@radix-ui/react-toggle";

// const Toggle = React.forwardRef(({ className, ...props }, ref) => (
//   <TogglePrimitive.Root
//     ref={ref}
//     className={`toggle ${className}`}
//     {...props}
//   />
// ));

// Toggle.displayName = "Toggle";

// export { Toggle };

import React from "react";
import * as TogglePrimitive from "@radix-ui/react-toggle";
import { cn } from "../../lib/utils";

const toggleVariants = {
  default: "bg-transparent",
  outline:
    "border border-input bg-transparent hover:bg-accent hover:text-accent-foreground",
};

const sizeVariants = {
  default: "h-10 px-3",
  sm: "h-9 px-2.5",
  lg: "h-11 px-5",
};

const Toggle = React.forwardRef(function Toggle(
  { className, variant = "default", size = "default", ...props },
  ref
) {
  return (
    <TogglePrimitive.Root
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        toggleVariants[variant],
        sizeVariants[size],
        className
      )}
      {...props}
    />
  );
});

export { Toggle };
