import * as React from "react";
import { cn } from "../../lib/utils";

const Input = React.forwardRef(
  (
    { className, type = "text", "aria-invalid": ariaInvalid, ...props },
    ref
  ) => {
    return (
      <input
        type={type}
        ref={ref}
        aria-invalid={ariaInvalid}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder-muted-foreground",
          "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          "disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
