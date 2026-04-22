"use client";

import * as React from "react";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const PasswordInput = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false);

    return (
      <div className="relative">
        <Input
          type={showPassword ? "text" : "password"}
          className={cn(
            "pr-10",
            "tracking-widest", 
            className
          )}
          ref={ref}
          autoComplete={props.autoComplete ?? "current-password"}
          {...props}
        />
        <button
          type="button"
          tabIndex={-1}
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-black/30 hover:text-black transition-colors outline-none focus-visible:ring-2 focus-visible:ring-black/20 rounded-sm"
          aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
        >
          {showPassword ? (
            <EyeOff className="h-4.5 w-4.5" strokeWidth={1.5} />
          ) : (
            <Eye className="h-4.5 w-4.5" strokeWidth={1.5} />
          )}
        </button>
      </div>
    );
  }
);
PasswordInput.displayName = "PasswordInput";

export { PasswordInput };